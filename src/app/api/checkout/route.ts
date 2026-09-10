import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Order } from "@/models";
import { 
  PHONEPE_MERCHANT_ID,
  PHONEPE_SALT_KEY,
  PHONEPE_SALT_INDEX,
  PHONEPE_ENV
} from "@/lib/phonepe";
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from "@phonepe-pg/pg-sdk-node";

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

    const merchantTransactionId = `MT${order.id.replace(/-/g, '').substring(0, 30)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 2. Initialize PhonePe SDK Client
    const env = (PHONEPE_ENV === 'PROD' || PHONEPE_ENV === 'production') ? Env.PRODUCTION : Env.SANDBOX;
    const client = StandardCheckoutClient.getInstance(
        PHONEPE_MERCHANT_ID,
        PHONEPE_SALT_KEY,
        parseInt(PHONEPE_SALT_INDEX || '1'),
        env
    );

    // 3. Prepare Checkout Request
    const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantTransactionId)
        .amount(Math.round(amount * 100)) // amount in paise
        .redirectUrl(`${appUrl}/api/phonepe/callback?orderId=${order.id}`)
        .message("Payment for Shree Fertility Academy Course")
        .build();

    // 4. Call PhonePe API
    const response = await client.pay(request);

    if (response && response.redirectUrl) {
      return NextResponse.json({ 
        success: true, 
        redirectUrl: response.redirectUrl,
        orderId: order.id
      });
    } else {
      console.error("PhonePe Initiation Failed:", response);
      return NextResponse.json({ error: "Payment initiation failed", details: response }, { status: 400 });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
