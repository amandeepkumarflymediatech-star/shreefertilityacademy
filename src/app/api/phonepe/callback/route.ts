import { NextRequest, NextResponse } from "next/server";
import { Order, Membership, Payment, PricingPackage } from "@/models";
import { 
  PHONEPE_MERCHANT_ID, 
  PHONEPE_BASE_URL, 
  generateChecksum 
} from "@/lib/phonepe";

export async function POST(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const formData = await req.formData();
    const transactionId = (formData.get("transactionId") as string) || (formData.get("merchantTransactionId") as string);
    const code = formData.get("code") as string;
    
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.redirect(`${appUrl}/student?payment=failed`, 303);
    }

    const order = await Order.findByPk(orderId);

    if (!order || order.status === "PAID") {
      return NextResponse.redirect(`${appUrl}/invoice/${orderId}`, 303);
    }

    const merchantTransactionId = `MT${order.id.replace(/-/g, '').substring(0, 30)}`;

    // Call PhonePe status API to verify
    const endpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${merchantTransactionId}`;
    const checksum = generateChecksum("", endpoint);

    let isSuccess = false;
    let verifiedAmount = order.amount;
    let phonepeTxnId = transactionId || 'N/A';

    try {
      const verifyRes = await fetch(`${PHONEPE_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": PHONEPE_MERCHANT_ID
        }
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success && verifyData.code === "PAYMENT_SUCCESS") {
        isSuccess = true;
        if (verifyData.data?.amount) {
          verifiedAmount = verifyData.data.amount / 100;
        }
        if (verifyData.data?.transactionId) {
          phonepeTxnId = verifyData.data.transactionId;
        }
      }
    } catch (e) {
      console.error("PhonePe status verification call failed:", e);
      // Fallback check on formData code if status endpoint failed
      if (code === "PAYMENT_SUCCESS") {
        isSuccess = true;
      }
    }

    if (isSuccess || code === "PAYMENT_SUCCESS") {
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
        membershipId: membership.id
      });

      // Create Payment record
      await Payment.create({
        orderId: orderId,
        studentId: order.studentId,
        amount: verifiedAmount,
        currency: "INR",
        status: "SUCCESS",
        merchantTransactionId: merchantTransactionId,
        phonepeTransactionId: phonepeTxnId,
      } as any);

      return NextResponse.redirect(`${appUrl}/invoice/${orderId}`, 303);
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

