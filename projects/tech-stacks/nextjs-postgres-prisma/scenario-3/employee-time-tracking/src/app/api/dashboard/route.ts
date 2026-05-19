import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/dashboard - Aggregate all data the manager dashboard needs
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [employees, timeEntries, timeOffRequests, payrollPeriods, payrollRecords] =
      await Promise.all([
        prisma.employee.findMany({
          where: { role: { not: 'admin' } },
          orderBy: { id: 'asc' },
        }),
        prisma.timeEntry.findMany({ orderBy: { clock_in: 'desc' } }),
        prisma.timeOffRequest.findMany({ orderBy: { created_at: 'desc' } }),
        prisma.payrollPeriod.findMany({ orderBy: { start_date: 'desc' } }),
        prisma.payrollRecord.findMany({ orderBy: { id: 'desc' } }),
      ]);

    return NextResponse.json({
      employees,
      timeEntries,
      timeOffRequests,
      payrollPeriods,
      payrollRecords,
    });
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
