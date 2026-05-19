import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/coupons/[id] - Update a coupon (e.g. toggle is_active)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, discount_percent, is_active } = body;

    const coupon = await prisma.coupon.update({
      where: { coupon_id: id },
      data: {
        ...(code !== undefined && { code: String(code).toUpperCase() }),
        ...(discount_percent !== undefined && {
          discount_percent: Number(discount_percent),
        }),
        ...(is_active !== undefined && { is_active }),
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

// DELETE /api/coupons/[id] - Delete a coupon
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.coupon.delete({ where: { coupon_id: id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
