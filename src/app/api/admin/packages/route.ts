import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PricingPackage } from "@/models";

// GET all packages
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const packages = await PricingPackage.findAll({ order: [['createdAt', 'DESC']] });
    return NextResponse.json(packages);
  } catch (error) {
    console.error("Failed to fetch packages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST create a new package
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { title, price, regularPrice, classCount, tagline, validTill, features, isActive } = data;

    if (!title || price === undefined) {
      return NextResponse.json({ error: "Title and price are required" }, { status: 400 });
    }

    const newPackage = await PricingPackage.create({
      title,
      price: parseFloat(price),
      regularPrice: regularPrice ? parseFloat(regularPrice) : null,
      classCount: classCount !== undefined && classCount !== "" ? parseInt(classCount, 10) : 12,
      tagline: tagline || null,
      validTill: validTill ? new Date(validTill) : null,
      features: features ? JSON.stringify(features) : null,
      isActive: isActive !== undefined ? isActive : true
    } as any);

    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error("Failed to create package:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
