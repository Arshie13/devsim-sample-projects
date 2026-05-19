import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface OrderItemInput {
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { order_date: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: OrderItemInput[] = body.items ?? [];

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customer_name: body.customer_name,
          total_amount: Number(body.total_amount),
          discount_amount: Number(body.discount_amount ?? 0),
          coupon_id: body.coupon_id ?? null,
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

      // Decrement stock for each purchased product.
      for (const item of items) {
        await tx.product.update({
          where: { product_id: item.product_id },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
