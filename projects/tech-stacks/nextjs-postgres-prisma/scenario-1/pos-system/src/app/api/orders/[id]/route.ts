import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id] - Get an order with its line items and product names
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { order_id: id },
      include: {
        items: {
          include: { product: { select: { product_name: true } } },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
