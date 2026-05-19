import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const daysFromNow = (days: number) => new Date(Date.now() + days * 86_400_000);

async function main() {
  // Wipe existing data, children before parents.
  await prisma.attendance.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.class.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // Staff account — sign in with staff@gym.test / password123
  await prisma.user.create({
    data: {
      email: "staff@gym.test",
      password: passwordHash,
      first_name: "Sam",
      last_name: "Staff",
      name: "Sam Staff",
      phone: "555-0100",
      status: "active",
    },
  });

  // Members (sign in with the email below / password123)
  const alice = await prisma.user.create({
    data: {
      email: "alice@gym.test",
      password: passwordHash,
      first_name: "Alice",
      last_name: "Nguyen",
      name: "Alice Nguyen",
      phone: "555-0101",
      status: "active",
      membership: {
        create: {
          type: "premium",
          status: "active",
          start_date: daysFromNow(-30),
          end_date: daysFromNow(335),
        },
      },
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@gym.test",
      password: passwordHash,
      first_name: "Bob",
      last_name: "Reyes",
      name: "Bob Reyes",
      phone: "555-0102",
      status: "active",
      membership: {
        create: {
          type: "standard",
          status: "active",
          start_date: daysFromNow(-10),
          end_date: daysFromNow(20),
        },
      },
    },
  });

  // Classes
  const yoga = await prisma.class.create({
    data: { name: "Morning Yoga", schedule: "Mon/Wed/Fri 07:00", instructor: "Priya Shah", capacity: 20 },
  });
  const spin = await prisma.class.create({
    data: { name: "Spin Cycle", schedule: "Tue/Thu 18:00", instructor: "Marco Diaz", capacity: 15 },
  });
  await prisma.class.create({
    data: { name: "Strength 101", schedule: "Sat 10:00", instructor: "Dana Lee", capacity: 12 },
  });

  // Bookings + attendance
  await prisma.booking.createMany({
    data: [
      { user_id: alice.id, class_id: yoga.id },
      { user_id: alice.id, class_id: spin.id },
      { user_id: bob.id, class_id: yoga.id },
    ],
  });
  await prisma.attendance.createMany({
    data: [
      { user_id: alice.id, class_id: yoga.id },
      { user_id: bob.id, class_id: yoga.id },
    ],
  });

  console.log("Seed complete: 3 users, 2 memberships, 3 classes, 3 bookings, 2 attendances.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
