import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const classes = await prisma.class.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json(classes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}
