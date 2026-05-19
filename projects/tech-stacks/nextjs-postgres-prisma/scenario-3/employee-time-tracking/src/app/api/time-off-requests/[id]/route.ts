import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.timeOffRequest.update({
      where: { id: Number(id) },
      data: {
        status: body.status,
        reviewed_by: body.reviewed_by ?? null,
        reviewed_at: body.reviewed_at ?? null,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
