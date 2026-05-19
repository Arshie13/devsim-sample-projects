import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/orders - List all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { order_date: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

interface CheckoutItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

// POST /api/orders - Create an order, its line items, and decrement stock
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      coupon_id,
      total_amount,
      discount_amount,
      items,
    }: {
      customer_name: string;
      coupon_id?: string | null;
      total_amount: number;
      discount_amount: number;
      items: CheckoutItem[];
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order has no items' }, { status: 400 });
    }

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customer_name: customer_name || 'Walk-in Customer',
          coupon_id: coupon_id || null,
          total_amount: Number(total_amount),
          discount_amount: Number(discount_amount) || 0,
          items: {
            create: items.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
              subtotal: item.subtotal,
            })),
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { product_id: item.product_id },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
