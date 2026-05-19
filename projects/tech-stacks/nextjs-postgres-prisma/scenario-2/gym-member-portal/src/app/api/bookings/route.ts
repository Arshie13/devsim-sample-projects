import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/bookings
//   ?userId=<id>  -> that member's bookings (with class details)
//   (no param)    -> all bookings (used to compute class capacity)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const bookings = await prisma.booking.findMany({
        where: { user_id: userId },
        include: { classes: true },
        orderBy: { booked_at: 'desc' },
      });
      return NextResponse.json(bookings);
    }

    const bookings = await prisma.booking.findMany({
      select: { class_id: true },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST /api/bookings - Book a class for a member
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, class_id } = body;

    if (!user_id || class_id == null) {
      return NextResponse.json(
        { error: 'user_id and class_id are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.booking.findFirst({
      where: { user_id, class_id: Number(class_id) },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'You have already booked this class' },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: { user_id, class_id: Number(class_id) },
      include: { classes: true },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to book class' }, { status: 500 });
  }
}
