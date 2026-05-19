import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const coupons = await prisma.coupon.findMany({
      where: activeOnly ? { is_active: true } : undefined,
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(coupons);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const coupon = await prisma.coupon.create({
      data: {
        code: String(body.code).toUpperCase(),
        discount_percent: Number(body.discount_percent),
        is_active: body.is_active ?? true,
      },
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
