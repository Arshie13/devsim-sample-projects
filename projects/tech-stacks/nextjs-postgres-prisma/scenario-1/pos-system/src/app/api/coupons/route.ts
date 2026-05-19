import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/coupons - List coupons (pass ?active=true for active ones only)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const coupons = await prisma.coupon.findMany({
      where: activeOnly ? { is_active: true } : undefined,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

// POST /api/coupons - Create a new coupon
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discount_percent } = body;

    if (!code || discount_percent == null) {
      return NextResponse.json(
        { error: 'code and discount_percent are required' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: String(code).toUpperCase(),
        discount_percent: Number(discount_percent),
        is_active: true,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
