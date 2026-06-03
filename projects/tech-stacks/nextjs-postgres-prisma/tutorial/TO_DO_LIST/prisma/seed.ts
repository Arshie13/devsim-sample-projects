import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.todo.deleteMany();

  // Seed starter todos
  await prisma.todo.createMany({
    data: [
      { title: 'Buy groceries', completed: false },
      { title: 'Finish project report', completed: true },
      { title: 'Call dentist for appointment', completed: false },
      { title: 'Water the plants', completed: true },
    ],
  });
  console.log('✅ Todos created');

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
