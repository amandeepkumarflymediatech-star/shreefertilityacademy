import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Order } from "@/models";
import { 
  PHONEPE_MERCHANT_ID, 
  PHONEPE_BASE_URL, 
  generateChecksum 
} from "@/lib/phonepe";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, membershipPlanId } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 1. Create a Pending Order in DB
    const order = await Order.create({
      studentId: session.user.id,
      amount: amount,
      currency: "INR",
      status: "PENDING",
      // We will store membership details after payment success
    } as any);

    const merchantTransactionId = `MT${order.id.replace(/-/g, '').substring(0, 30)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 2. Prepare PhonePe Payload
    const payloadData = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: session.user.id.substring(0, 35), // max 35 chars
      amount: Math.round(amount * 100), // in paise
      redirectUrl: `${appUrl}/api/phonepe/callback?orderId=${order.id}`,
      redirectMode: "POST",
      callbackUrl: `${appUrl}/api/phonepe/webhook`,
      mobileNumber: "9999999999", // Can be dynamic
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const payloadString = JSON.stringify(payloadData);
    const payloadBase64 = Buffer.from(payloadString).toString("base64");
    
    // 3. Generate Checksum
    const endpoint = "/pg/v1/pay";
    const checksum = generateChecksum(payloadBase64, endpoint);

    // 4. Call PhonePe API
    console.log("PHONEPE_BASE_URL:", PHONEPE_BASE_URL);
    console.log("ENDPOINT:", endpoint);
    console.log("FULL URL:", `${PHONEPE_BASE_URL}${endpoint}`);
    console.log("PHONEPE_MERCHANT_ID:", PHONEPE_MERCHANT_ID);

    const response = await fetch(`${PHONEPE_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "Accept": "application/json",
      },
      body: JSON.stringify({
        request: payloadBase64
      })
    });

    const result = await response.json();

    if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({ 
        success: true, 
        redirectUrl: result.data.instrumentResponse.redirectInfo.url,
        orderId: order.id
      });
    } else {
      console.error("PhonePe Initiation Failed:", result);
      return NextResponse.json({ error: "Payment initiation failed", details: result }, { status: 400 });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
