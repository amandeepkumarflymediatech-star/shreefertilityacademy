import { NextResponse } from 'next/server';
import { Coupon } from '@/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = 10;
    const session = await getServerSession(authOptions);
    
    // Add basic admin check
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows: coupons, count: total } = await Coupon.findAndCountAll({
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return NextResponse.json({
      coupons,
      totalPages: Math.ceil(total / pageSize)
    });

  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}
