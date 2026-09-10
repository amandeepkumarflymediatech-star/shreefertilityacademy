import { NextRequest, NextResponse } from "next/server";
import { Order, Membership, Payment, PricingPackage, Coupon } from "@/models";
import { getPhonePeOrderStatus } from "@/lib/phonepe";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty or form data
    }

    const merchantOrderId = body?.data?.merchantOrderId || body?.merchantOrderId;

    if (!merchantOrderId) {
      return NextResponse.json({ success: true, message: "Webhook received" });
    }

    // Match order
    const allOrders = await Order.findAll({ where: { status: "PENDING" } });
    const order = allOrders.find(o => `MT${o.id.replace(/-/g, '').substring(0, 30)}` === merchantOrderId);

    if (!order) {
      return NextResponse.json({ success: true, message: "Order not found or already processed" });
    }

    const { status, data } = await getPhonePeOrderStatus(merchantOrderId);
    const state = data?.state || data?.code;

    if (state === "COMPLETED" || state === "SUCCESS" || state === "PAYMENT_SUCCESS") {
      let verifiedAmount = order.amount;
      if (data?.amount) {
        verifiedAmount = data.amount / 100;
      }
      const phonepeTxnId = data?.orderId || "N/A";

      // 1. Determine package class quota
      let packageClasses = 12;
      if (order.membershipId) {
        const pkg = await PricingPackage.findByPk(order.membershipId);
        if (pkg) {
          if (pkg.classCount && pkg.classCount > 0) {
            packageClasses = pkg.classCount;
          } else if (pkg.features) {
            try {
              const feats = typeof pkg.features === "string" ? JSON.parse(pkg.features) : pkg.features;
              if (Array.isArray(feats)) {
                for (const f of feats) {
                  const m = f.match(/(\d+)\s*(?:Live|Interactive|Classes|Sessions|Masterclasses|Webinars)/i);
                  if (m) {
                    packageClasses = parseInt(m[1], 10);
                    break;
                  }
                }
              }
            } catch (e) {
              console.error("Webhook feature parse error:", e);
            }
          }
        }
      }

      // 2. Rollover leftover classes
      const existingActiveMemberships = await Membership.findAll({
        where: {
          studentId: order.studentId,
          status: "ACTIVE",
        },
      });

      let leftoverClasses = 0;
      for (const mem of existingActiveMemberships as any[]) {
        const rem = Math.max(0, (mem.maxClasses || 0) - (mem.usedClasses || 0));
        leftoverClasses += rem;
        await mem.update({ status: "RENEWED" });
      }

      const totalClasses = packageClasses + leftoverClasses;
      const validUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      // 3. Create active Membership
      const membership = await Membership.create({
        studentId: order.studentId,
        maxClasses: totalClasses,
        usedClasses: 0,
        validUntil: validUntil,
        status: "ACTIVE",
      } as any);

      // Update Order
      await order.update({
        status: "PAID",
      });

      // Create Payment
      await Payment.create({
        orderId: order.id,
        studentId: order.studentId,
        amount: verifiedAmount,
        currency: "INR",
        status: "SUCCESS",
        merchantTransactionId: merchantOrderId,
        phonepeTransactionId: phonepeTxnId,
      } as any);

      // Increment coupon usage count if applied
      if (order.couponId) {
        try {
          const appliedCoupon = await Coupon.findByPk(order.couponId);
          if (appliedCoupon) {
            await appliedCoupon.increment('usedCount');
          }
        } catch (couponErr) {
          console.error("Webhook coupon increment error:", couponErr);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PhonePe webhook error:", error);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}
