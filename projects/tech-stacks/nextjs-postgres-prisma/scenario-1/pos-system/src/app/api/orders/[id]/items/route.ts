import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const items = await prisma.orderItem.findMany({
      where: { order_id: id },
      include: { product: { select: { product_name: true } } },
    });

    const formatted = items.map((item) => ({
      product_name: item.product?.product_name ?? 'Unknown',
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch order items' }, { status: 500 });
  }
}
