import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (respecting foreign keys)
  await prisma.payrollRecord.deleteMany();
  await prisma.payrollPeriod.deleteMany();
  await prisma.timeOffRequest.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.employee.deleteMany();

  // Dates are generated relative to "now" so the dashboard always shows
  // current attendance once the database has been seeded.
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const at = (h: number, m: number) =>
    `${today}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
  const addDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  // Seed employees
  const employeeData = [
    { email: 'sarah@workpulse.com', first_name: 'Sarah', last_name: 'Johnson', role: 'employee', hourly_rate: 75 },
    { email: 'michael@workpulse.com', first_name: 'Michael', last_name: 'Chen', role: 'employee', hourly_rate: 65 },
    { email: 'emily@workpulse.com', first_name: 'Emily', last_name: 'Davis', role: 'employee', hourly_rate: 70 },
    { email: 'james@workpulse.com', first_name: 'James', last_name: 'Wilson', role: 'employee', hourly_rate: 55 },
    { email: 'lisa@workpulse.com', first_name: 'Lisa', last_name: 'Anderson', role: 'employee', hourly_rate: 60 },
    { email: 'robert@workpulse.com', first_name: 'Robert', last_name: 'Taylor', role: 'employee', hourly_rate: 80 },
  ];

  const employees = [];
  for (const e of employeeData) {
    employees.push(
      await prisma.employee.create({ data: { ...e, created_at: today } }),
    );
  }
  console.log('✅ Employees created');

  // Seed time entries for today
  const timeEntryData = [
    { employee_id: employees[0].id, clock_in: at(9, 0), clock_out: null },
    { employee_id: employees[1].id, clock_in: at(8, 45), clock_out: null },
    { employee_id: employees[2].id, clock_in: at(9, 15), clock_out: null },
    { employee_id: employees[3].id, clock_in: at(8, 30), clock_out: null },
    { employee_id: employees[4].id, clock_in: at(9, 0), clock_out: at(18, 0) },
    { employee_id: employees[5].id, clock_in: at(7, 30), clock_out: null },
  ];
  for (const t of timeEntryData) {
    await prisma.timeEntry.create({ data: { ...t, created_at: today } });
  }
  console.log('✅ Time entries created');

  // Seed time-off requests
  const timeOffData = [
    { employee_id: employees[0].id, start_date: addDays(7), end_date: addDays(11), hours: 40, request_type: 'vacation', status: 'pending', notes: 'Family vacation' },
    { employee_id: employees[2].id, start_date: addDays(1), end_date: addDays(1), hours: 8, request_type: 'sick', status: 'pending', notes: 'Not feeling well' },
    { employee_id: employees[1].id, start_date: addDays(3), end_date: addDays(3), hours: 8, request_type: 'personal', status: 'pending', notes: 'Personal appointment' },
    { employee_id: employees[3].id, start_date: addDays(-10), end_date: addDays(-6), hours: 40, request_type: 'vacation', status: 'approved', notes: 'Spring break', reviewed_by: employees[0].id, reviewed_at: addDays(-20) },
  ];
  for (const r of timeOffData) {
    await prisma.timeOffRequest.create({ data: { ...r, created_at: today } });
  }
  console.log('✅ Time-off requests created');

  // Seed payroll periods
  const closedPeriod = await prisma.payrollPeriod.create({
    data: { start_date: addDays(-30), end_date: addDays(-16), status: 'closed', processed_at: addDays(-15), created_at: today },
  });
  await prisma.payrollPeriod.create({
    data: { start_date: addDays(-15), end_date: addDays(-1), status: 'open', created_at: today },
  });
  console.log('✅ Payroll periods created');

  // Seed payroll records for the closed period
  const payrollData = [
    { employee_id: employees[0].id, regular_hours: 40, overtime_hours: 5, total_hours: 45, hourly_rate: 75, gross_pay: 3375 },
    { employee_id: employees[1].id, regular_hours: 40, overtime_hours: 2, total_hours: 42, hourly_rate: 65, gross_pay: 2795 },
    { employee_id: employees[2].id, regular_hours: 38, overtime_hours: 4, total_hours: 42, hourly_rate: 70, gross_pay: 3080 },
    { employee_id: employees[4].id, regular_hours: 40, overtime_hours: 0, total_hours: 40, hourly_rate: 60, gross_pay: 2400 },
    { employee_id: employees[5].id, regular_hours: 40, overtime_hours: 8, total_hours: 48, hourly_rate: 80, gross_pay: 4160 },
  ];
  for (const p of payrollData) {
    await prisma.payrollRecord.create({
      data: { ...p, payroll_period_id: closedPeriod.id, created_at: today },
    });
  }
  console.log('✅ Payroll records created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
