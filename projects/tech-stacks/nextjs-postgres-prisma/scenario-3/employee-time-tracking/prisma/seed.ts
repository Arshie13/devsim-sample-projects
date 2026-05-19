import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Build a DateTime at a given hour, `daysAgo` days before now.
const at = (daysAgo: number, hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d;
};

async function main() {
  // Wipe existing data, children before parents.
  await prisma.payrollRecord.deleteMany();
  await prisma.timeOffRequest.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.payrollPeriod.deleteMany();
  await prisma.employee.deleteMany();

  // Manager first — employees reference manager_id.
  const manager = await prisma.employee.create({
    data: {
      email: "manager@acme.test",
      first_name: "Morgan",
      last_name: "Price",
      role: "manager",
      hourly_rate: 55,
    },
  });

  const alice = await prisma.employee.create({
    data: {
      email: "alice@acme.test",
      first_name: "Alice",
      last_name: "Nguyen",
      role: "employee",
      manager_id: manager.id,
      hourly_rate: 32,
    },
  });

  const bob = await prisma.employee.create({
    data: {
      email: "bob@acme.test",
      first_name: "Bob",
      last_name: "Reyes",
      role: "employee",
      manager_id: manager.id,
      hourly_rate: 28,
    },
  });

  // Time entries — one open (no clock_out), the rest closed.
  await prisma.timeEntry.createMany({
    data: [
      { employee_id: alice.id, clock_in: at(2, 9), clock_out: at(2, 17), notes: "Standard shift" },
      { employee_id: alice.id, clock_in: at(1, 9), clock_out: at(1, 18), notes: "Stayed late" },
      { employee_id: alice.id, clock_in: at(0, 9) }, // currently clocked in
      { employee_id: bob.id, clock_in: at(2, 8), clock_out: at(2, 16) },
      { employee_id: bob.id, clock_in: at(1, 8), clock_out: at(1, 16) },
    ],
  });

  // Time-off requests (dates stored as strings per the schema).
  await prisma.timeOffRequest.createMany({
    data: [
      {
        employee_id: alice.id,
        start_date: "2026-06-01",
        end_date: "2026-06-03",
        hours: 24,
        request_type: "vacation",
        status: "pending",
        notes: "Family trip",
      },
      {
        employee_id: bob.id,
        start_date: "2026-05-12",
        end_date: "2026-05-12",
        hours: 8,
        request_type: "sick",
        status: "approved",
        reviewed_by: manager.id,
        reviewed_at: at(5, 10),
      },
    ],
  });

  // A closed payroll period with one record per employee.
  const period = await prisma.payrollPeriod.create({
    data: {
      start_date: "2026-05-01",
      end_date: "2026-05-15",
      status: "processed",
      processed_at: at(3, 12),
    },
  });

  await prisma.payrollRecord.createMany({
    data: [
      {
        payroll_period_id: period.id,
        employee_id: alice.id,
        regular_hours: 80,
        overtime_hours: 4,
        total_hours: 84,
        hourly_rate: 32,
        gross_pay: 80 * 32 + 4 * 32 * 1.5,
      },
      {
        payroll_period_id: period.id,
        employee_id: bob.id,
        regular_hours: 80,
        overtime_hours: 0,
        total_hours: 80,
        hourly_rate: 28,
        gross_pay: 80 * 28,
      },
    ],
  });

  console.log("Seed complete: 3 employees, 5 time entries, 2 time-off requests, 1 payroll period, 2 payroll records.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
