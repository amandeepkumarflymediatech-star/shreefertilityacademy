import { NextResponse } from "next/server";
import { PricingPackage } from "@/models";

export async function GET() {
  try {
    const packages = await PricingPackage.findAll({
      where: { isActive: true },
      order: [['price', 'ASC']]
    });
    
    return NextResponse.json(packages);
  } catch (error) {
    console.error("Failed to fetch public packages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
