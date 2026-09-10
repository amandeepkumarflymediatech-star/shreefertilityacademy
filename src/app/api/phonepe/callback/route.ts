import { NextRequest, NextResponse } from "next/server";
import { Order, Membership, Payment, PricingPackage, Coupon } from "@/models";
import { getPhonePeOrderStatus } from "@/lib/phonepe";

async function processCallback(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const url = new URL(req.url);
    let orderId = url.searchParams.get("orderId");

    // Check in formData / json if not in searchParams
    if (!orderId && req.method === "POST") {
      try {
        const contentType = req.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const body = await req.json();
          orderId = body.orderId || body.merchantOrderId;
        } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
          const formData = await req.formData();
          orderId = (formData.get("orderId") as string) || (formData.get("merchantOrderId") as string);
        }
      } catch (e) {
        // ignore parse error if body is empty or already consumed
      }
    }

    if (!orderId) {
      return NextResponse.redirect(`${appUrl}/student?payment=failed`, 303);
    }

    // In case orderId passed is merchantOrderId format e.g. MT...
    let order = await Order.findByPk(orderId);
    if (!order) {
      // Try finding by merchantOrderId or stripped UUID
      const allOrders = await Order.findAll({ where: { status: "PENDING" } });
      order = allOrders.find(o => `MT${o.id.replace(/-/g, '').substring(0, 30)}` === orderId) || null;
    }

    if (!order) {
      return NextResponse.redirect(`${appUrl}/student?payment=failed`, 303);
    }

    if (order.status === "PAID") {
      return NextResponse.redirect(`${appUrl}/invoice/${order.id}`, 303);
    }

    const merchantOrderId = `MT${order.id.replace(/-/g, '').substring(0, 30)}`;

    // Call PhonePe V2 status API to verify
    let isSuccess = false;
    let isPending = false;
    let verifiedAmount = order.amount;
    let phonepeTxnId = 'N/A';

    try {
      const { status, data } = await getPhonePeOrderStatus(merchantOrderId);
      console.log("PhonePe V2 Status Response:", { status, data });

      const state = data?.state || data?.code;
      if (state === "COMPLETED" || state === "SUCCESS" || state === "PAYMENT_SUCCESS") {
        isSuccess = true;
        if (data?.amount) {
          verifiedAmount = data.amount / 100;
        }
        if (data?.orderId) {
          phonepeTxnId = data.orderId;
        }
      } else if (state === "PENDING" || state === "PAYMENT_PENDING") {
        isPending = true;
      }
    } catch (e) {
      console.error("PhonePe V2 status verification call failed:", e);
    }

    if (isSuccess) {
      // 1. Determine package class quota
      let packageClasses = 12; // default
      if (order.membershipId) {
        const pkg = await PricingPackage.findByPk(order.membershipId);
        if (pkg) {
          if (pkg.classCount && pkg.classCount > 0) {
            packageClasses = pkg.classCount;
          } else if (pkg.features) {
            try {
              const feats = typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features;
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
              console.error("Error parsing package features for class count:", e);
            }
          }
        }
      }

      // 2. Carry over remaining unused classes from existing active memberships
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
      const validUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year validity

      // 3. Create fresh Active Membership with combined classes
      const membership = await Membership.create({
        studentId: order.studentId,
        maxClasses: totalClasses,
        usedClasses: 0,
        validUntil: validUntil,
        status: "ACTIVE"
      } as any);

      // Update Order to PAID
      await order.update({
        status: "PAID",
      });

      // Create Payment record
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
          console.error("Failed to increment coupon usedCount:", couponErr);
        }
      }

      return NextResponse.redirect(`${appUrl}/invoice/${order.id}`, 303);
    } else if (isPending) {
      return NextResponse.redirect(`${appUrl}/student?payment=pending`, 303);
    } else {
      // Payment Failed
      await order.update({ status: "FAILED" });
      return NextResponse.redirect(`${appUrl}/student?payment=failed`, 303);
    }

  } catch (error) {
    console.error("PhonePe callback error:", error);
    return NextResponse.redirect(`${appUrl}/student?payment=error`, 303);
  }
}

export async function GET(req: NextRequest) {
  return processCallback(req);
}

export async function POST(req: NextRequest) {
  return processCallback(req);
}
