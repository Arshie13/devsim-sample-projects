import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (respecting foreign keys)
  await prisma.attendance.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  // Seed a demo member
  const member = await prisma.user.create({
    data: {
      email: 'jordan.member@fittech.com',
      first_name: 'Jordan',
      last_name: 'Rivera',
      phone: '555-0142',
      email_verified: true,
      status: 'active',
    },
  });
  console.log('✅ Member created:', member.email);

  // Seed membership
  await prisma.membership.create({
    data: {
      user_id: member.user_id,
      type: 'premium',
      status: 'active',
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-12-31'),
    },
  });
  console.log('✅ Membership created');

  // Seed classes
  const classData = [
    { name: 'Morning Yoga', schedule: 'Mon/Wed/Fri 7:00 AM', instructor: 'Amara Singh', capacity: 15 },
    { name: 'HIIT Bootcamp', schedule: 'Tue/Thu 6:00 PM', instructor: 'Carlos Mendez', capacity: 12 },
    { name: 'Spin Class', schedule: 'Mon/Wed 5:30 PM', instructor: 'Nina Park', capacity: 20 },
    { name: 'Strength Training', schedule: 'Sat 9:00 AM', instructor: 'Derek Cole', capacity: 10 },
    { name: 'Pilates', schedule: 'Tue/Thu 8:00 AM', instructor: 'Sophie Tan', capacity: 14 },
  ];

  const classes = [];
  for (const c of classData) {
    classes.push(await prisma.class.create({ data: c }));
  }
  console.log('✅ Classes created');

  // Seed a booking for the demo member
  await prisma.booking.create({
    data: { user_id: member.user_id, class_id: classes[0].id },
  });
  console.log('✅ Booking created');

  // Seed attendance history
  await prisma.attendance.createMany({
    data: [
      { user_id: member.user_id, class_id: classes[0].id, attended_at: new Date('2025-05-05T07:00:00') },
      { user_id: member.user_id, class_id: classes[2].id, attended_at: new Date('2025-05-07T17:30:00') },
      { user_id: member.user_id, class_id: classes[1].id, attended_at: new Date('2025-05-08T18:00:00') },
    ],
  });
  console.log('✅ Attendance records created');

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
