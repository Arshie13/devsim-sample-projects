import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.todo.deleteMany();

  const todos = await prisma.todo.createMany({
    data: [
      { title: 'Set up environment variables', completed: true },
      { title: 'Run initial Prisma migration', completed: true },
      { title: 'Explore the NestJS project structure', completed: false },
      { title: 'Test the API endpoints with a REST client', completed: false },
    ],
  });

  console.log(`✅ Seeded ${todos.count} todos.`);
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
