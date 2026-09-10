import { NextRequest, NextResponse } from "next/server";
import { Order, Membership, Payment } from "@/models";
import { 
  PHONEPE_MERCHANT_ID,
  PHONEPE_SALT_KEY,
  PHONEPE_SALT_INDEX,
  PHONEPE_ENV
} from "@/lib/phonepe";
import { StandardCheckoutClient, Env } from "@phonepe-pg/pg-sdk-node";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const transactionId = formData.get("transactionId") as string;
    
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId || !transactionId) {
      return NextResponse.redirect(new URL("/student?payment=failed", req.url));
    }

    const order = await Order.findByPk(orderId);

    if (!order || order.status === "PAID") {
      return NextResponse.redirect(new URL(`/invoice/${orderId}`, req.url), 303);
    }

    // Call PhonePe status API using SDK
    const env = (PHONEPE_ENV === 'PROD' || PHONEPE_ENV === 'production') ? Env.PRODUCTION : Env.SANDBOX;
    const client = StandardCheckoutClient.getInstance(
        PHONEPE_MERCHANT_ID,
        PHONEPE_SALT_KEY,
        parseInt(PHONEPE_SALT_INDEX || '1'),
        env
    );

    const verifyData = await client.getOrderStatus(transactionId);

    if (verifyData && (verifyData.state === "COMPLETED" || verifyData.state === "SUCCESS")) {
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
        amount: verifyData.amount ? verifyData.amount / 100 : order.amount,
        currency: "INR",
        status: "SUCCESS",
        merchantTransactionId: transactionId,
        phonepeTransactionId: verifyData.orderId || transactionId,
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
