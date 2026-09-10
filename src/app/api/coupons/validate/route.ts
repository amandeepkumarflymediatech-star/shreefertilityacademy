import { NextRequest, NextResponse } from "next/server";
import { Coupon } from "@/models";

export async function POST(req: NextRequest) {
  try {
    const { code, amount } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const numericAmount = Number(amount) || 0;
    if (numericAmount <= 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
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

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (numericAmount * coupon.discountValue) / 100;
    } else if (coupon.discountType === "FIXED_AMOUNT") {
      discount = coupon.discountValue;
    }

    discount = Math.min(numericAmount, discount);
    const finalAmount = Math.max(0, numericAmount - discount);

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      originalAmount: numericAmount,
      discountAmount: discount,
      finalAmount: finalAmount,
    });
  } catch (error: any) {
    console.error("Coupon Validation Error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
