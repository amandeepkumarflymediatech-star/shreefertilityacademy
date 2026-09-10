import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Order, PricingPackage, Coupon, Membership, Payment } from "@/models";
import { createPhonePePayment } from "@/lib/phonepe";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to proceed." }, { status: 401 });
    }

    const { packageId, couponCode, amount: requestedAmount } = await req.json();

    if (!packageId) {
      return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
    }

    // 1. Fetch package from database
    const pkg = await PricingPackage.findByPk(packageId);
    const baseAmount = pkg ? pkg.price : (requestedAmount || 60000);

    if (baseAmount <= 0) {
      return NextResponse.json({ error: "Invalid package amount" }, { status: 400 });
    }

    let discount = 0;
    let validCoupon: any = null;

    // 2. Validate coupon if provided
    if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
      const code = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ where: { code } });

      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }

      if (!coupon.isActive) {
        return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
      }

      if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
        return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
      }

      if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: "This coupon has reached its maximum usage limit" }, { status: 400 });
      }

      if (coupon.discountType === "PERCENTAGE") {
        discount = (baseAmount * coupon.discountValue) / 100;
      } else if (coupon.discountType === "FIXED_AMOUNT") {
        discount = coupon.discountValue;
      }

      discount = Math.min(baseAmount, discount);
      validCoupon = coupon;
    }

    const finalAmount = Math.max(0, baseAmount - discount);

    // 3. Create a Pending Order in DB
    const order = await Order.create({
      studentId: session.user.id,
      amount: finalAmount,
      currency: "INR",
      status: "PENDING",
      membershipId: packageId,
      couponId: validCoupon ? validCoupon.id : null,
    } as any);

    // 4. If 100% discount (final amount is 0)
    if (finalAmount === 0) {
      let packageClasses = pkg?.classCount || 12;

      // Carry over remaining classes
      const existingActiveMemberships = await Membership.findAll({
        where: { studentId: session.user.id, status: "ACTIVE" },
      });

      let leftoverClasses = 0;
      for (const mem of existingActiveMemberships as any[]) {
        const rem = Math.max(0, (mem.maxClasses || 0) - (mem.usedClasses || 0));
        leftoverClasses += rem;
        await mem.update({ status: "RENEWED" });
      }

      const totalClasses = packageClasses + leftoverClasses;
      const validUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      const membership = await Membership.create({
        studentId: session.user.id,
        maxClasses: totalClasses,
        usedClasses: 0,
        validUntil: validUntil,
        status: "ACTIVE",
      } as any);

      await order.update({
        status: "PAID",
      });

      await Payment.create({
        orderId: order.id,
        studentId: session.user.id,
        amount: 0,
        currency: "INR",
        status: "SUCCESS",
        merchantTransactionId: `FREE_COUPON_${order.id.slice(0, 8)}`,
        phonepeTransactionId: validCoupon ? `COUPON_${validCoupon.code}` : "FREE_GRANT",
      } as any);

      if (validCoupon) {
        await validCoupon.increment("usedCount");
      }

      return NextResponse.json({
        success: true,
        redirectUrl: `/invoice/${order.id}`,
        orderId: order.id,
        isFree: true,
      });
    }

    // 5. Initiate PhonePe V2 Checkout Session for paid amount
    const merchantOrderId = `MT${order.id.replace(/-/g, '').substring(0, 30)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const paymentResponse = await createPhonePePayment({
      merchantOrderId: merchantOrderId,
      merchantUserId: session.user.id,
      amountInPaise: Math.round(finalAmount * 100),
      redirectUrl: `${appUrl}/api/phonepe/callback?orderId=${order.id}`,
      callbackUrl: `${appUrl}/api/phonepe/webhook`,
      message: `Enrollment in ${pkg ? pkg.title : "Fellowship Program"}`,
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
