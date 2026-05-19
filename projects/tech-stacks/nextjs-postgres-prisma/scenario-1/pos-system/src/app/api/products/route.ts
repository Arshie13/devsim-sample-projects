import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products - List all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { product_name: 'asc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_name, price, quantity } = body;

    if (!product_name || price == null || quantity == null) {
      return NextResponse.json(
        { error: 'product_name, price and quantity are required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        product_name,
        price: Number(price),
        quantity: Number(quantity),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
