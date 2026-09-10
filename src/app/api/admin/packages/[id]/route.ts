import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PricingPackage } from "@/models";

// PUT update a package
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const pkg = await PricingPackage.findByPk(id);
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const { title, price, regularPrice, classCount, tagline, validTill, features, isActive } = data;

    await pkg.update({
      title: title !== undefined ? title : pkg.title,
      price: price !== undefined ? parseFloat(price) : pkg.price,
      regularPrice: regularPrice !== undefined ? (regularPrice ? parseFloat(regularPrice) : null) : pkg.regularPrice,
      classCount: classCount !== undefined ? (classCount !== "" ? parseInt(classCount, 10) : 12) : pkg.classCount,
      tagline: tagline !== undefined ? tagline : pkg.tagline,
      validTill: validTill !== undefined ? (validTill ? new Date(validTill) : null) : pkg.validTill,
      features: features !== undefined ? (features ? JSON.stringify(features) : null) : pkg.features,
      isActive: isActive !== undefined ? isActive : pkg.isActive
    } as any);

    return NextResponse.json(pkg);
  } catch (error) {
    console.error("Failed to update package:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE a package
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const pkg = await PricingPackage.findByPk(id);
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    await pkg.destroy();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete package:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
