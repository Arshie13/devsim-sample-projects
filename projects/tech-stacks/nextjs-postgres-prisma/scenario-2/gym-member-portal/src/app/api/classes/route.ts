import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/classes - List all classes
export async function GET() {
  try {
    const classes = await prisma.class.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}
