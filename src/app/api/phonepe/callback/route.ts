import { NextRequest, NextResponse } from "next/server";
import { Order, Membership, Payment } from "@/models";
import { 
  PHONEPE_MERCHANT_ID, 
  PHONEPE_BASE_URL, 
  generateChecksum 
} from "@/lib/phonepe";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const transactionId = (formData.get("transactionId") as string) || (formData.get("merchantTransactionId") as string);
    const code = formData.get("code") as string;
    
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.redirect(new URL("/student?payment=failed", req.url));
    }

    const order = await Order.findByPk(orderId);

    if (!order || order.status === "PAID") {
      return NextResponse.redirect(new URL(`/invoice/${orderId}`, req.url), 303);
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
      // Create Membership for 1 Year with 12 Classes
      const membership = await Membership.create({
        studentId: order.studentId,
        maxClasses: 12,
        usedClasses: 0,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
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

      return NextResponse.redirect(new URL(`/invoice/${orderId}`, req.url), 303);
    } else {
      // Payment Failed
      await order.update({ status: "FAILED" });
      return NextResponse.redirect(new URL("/student?payment=failed", req.url), 303);
    }

  } catch (error) {
    console.error("PhonePe callback error:", error);
    return NextResponse.redirect(new URL("/student?payment=error", req.url));
  }
}

