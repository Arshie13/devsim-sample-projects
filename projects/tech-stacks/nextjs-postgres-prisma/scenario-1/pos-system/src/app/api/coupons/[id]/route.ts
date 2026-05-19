import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (body.code !== undefined) data.code = String(body.code).toUpperCase();
    if (body.discount_percent !== undefined) data.discount_percent = Number(body.discount_percent);
    if (body.is_active !== undefined) data.is_active = body.is_active;

    const coupon = await prisma.coupon.update({
      where: { coupon_id: id },
      data,
    });
    return NextResponse.json(coupon);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.coupon.delete({ where: { coupon_id: id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
