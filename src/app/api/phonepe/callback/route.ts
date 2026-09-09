import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { 
  PHONEPE_MERCHANT_ID, 
  PHONEPE_BASE_URL, 
  generateChecksum 
} from "@/lib/phonepe";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const transactionId = formData.get("transactionId") as string;
    
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId || !transactionId) {
      return NextResponse.redirect(new URL("/student?payment=failed", req.url));
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || order.status === "PAID") {
      return NextResponse.redirect(new URL(`/invoice/${orderId}`, req.url), 303);
    }

    // Call PhonePe status API to verify
    const endpoint = `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`;
    // For GET status API, payload string is empty
    const checksum = generateChecksum("", endpoint);

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
      // Create Membership for 1 Year with 12 Classes
      const membership = await prisma.membership.create({
        data: {
          studentId: order.studentId,
          maxClasses: 12,
          usedClasses: 0,
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
          status: "ACTIVE"
        }
      });

      // Update Order to PAID
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          membershipId: membership.id
        }
      });

      // Create Payment record
      await prisma.payment.create({
        data: {
          orderId: orderId,
          studentId: order.studentId,
          amount: verifyData.data.amount / 100, // convert paise back to rupees
          currency: "INR",
          status: "SUCCESS",
          merchantTransactionId: `MT${order.id.replace(/-/g, '').substring(0, 30)}`,
          phonepeTransactionId: transactionId,
        }
      });

      return NextResponse.redirect(new URL(`/invoice/${orderId}`, req.url), 303);
    } else {
      // Payment Failed
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" }
      });
      return NextResponse.redirect(new URL("/student?payment=failed", req.url), 303);
    }

  } catch (error) {
    console.error("PhonePe callback error:", error);
    return NextResponse.redirect(new URL("/student?payment=error", req.url));
  }
}
