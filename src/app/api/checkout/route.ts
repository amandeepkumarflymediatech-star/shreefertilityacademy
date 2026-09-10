import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Order } from "@/models";
import { createPhonePePayment } from "@/lib/phonepe";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, packageId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 1. Create a Pending Order in DB
    const order = await Order.create({
      studentId: session.user.id,
      amount: amount,
      currency: "INR",
      status: "PENDING",
      membershipId: packageId, // Storing the selected package ID
    } as any);

    const merchantOrderId = `MT${order.id.replace(/-/g, '').substring(0, 30)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 2. Initiate PhonePe V2 Checkout Session
    const paymentResponse = await createPhonePePayment({
      merchantOrderId: merchantOrderId,
      amountInPaise: Math.round(amount * 100),
      redirectUrl: `${appUrl}/api/phonepe/callback?orderId=${order.id}`,
      callbackUrl: `${appUrl}/api/phonepe/webhook`,
      message: "Reproductive Medicine Fellowship Mentorship",
    });

    if (paymentResponse.redirectUrl) {
      return NextResponse.json({ 
        success: true, 
        redirectUrl: paymentResponse.redirectUrl,
        orderId: order.id,
        phonepeOrderId: paymentResponse.orderId,
      });
    } else {
      console.error("PhonePe V2 Initiation Failed - No redirectUrl:", paymentResponse);
      return NextResponse.json({ 
        error: "Failed to obtain payment redirect URL", 
        details: paymentResponse 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("PhonePe V2 Checkout error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to create checkout session" 
    }, { status: 500 });
  }
}
