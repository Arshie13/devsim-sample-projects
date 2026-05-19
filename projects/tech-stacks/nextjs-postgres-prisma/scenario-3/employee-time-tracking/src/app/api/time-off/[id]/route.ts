import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/time-off/[id] - Approve or reject a time-off request
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, reviewed_by } = body;

    const updated = await prisma.timeOffRequest.update({
      where: { id: Number(id) },
      data: {
        ...(status !== undefined && { status }),
        reviewed_by: reviewed_by ?? null,
        reviewed_at: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating time-off request:', error);
    return NextResponse.json(
      { error: 'Failed to update time-off request' },
      { status: 500 }
    );
  }
}
