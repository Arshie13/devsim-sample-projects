import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/bookings           -> every booking (used for capacity counts)
// GET /api/bookings?userId=x  -> a single member's bookings, with class details
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const bookings = await prisma.booking.findMany({
      where: userId ? { user_id: userId } : undefined,
      orderBy: { booked_at: 'desc' },
      include: { class: true },
    });

    const formatted = bookings.map((b) => ({
      id: b.id,
      class_id: b.class_id,
      user_id: b.user_id,
      booked_at: b.booked_at,
      classes: b.class,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const booking = await prisma.booking.create({
      data: {
        user_id: body.user_id,
        class_id: Number(body.class_id),
      },
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
