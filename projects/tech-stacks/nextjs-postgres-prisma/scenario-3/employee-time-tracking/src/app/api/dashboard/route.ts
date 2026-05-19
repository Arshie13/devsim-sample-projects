import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [employees, timeEntries, timeOffRequests, payrollPeriods, payrollRecords] =
      await Promise.all([
        prisma.employee.findMany({ where: { role: { not: 'admin' } } }),
        prisma.timeEntry.findMany(),
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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
