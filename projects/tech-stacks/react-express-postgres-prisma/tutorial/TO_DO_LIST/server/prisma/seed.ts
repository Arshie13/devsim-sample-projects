import { prisma } from "../src/utils/prisma.js";

async function main() {
  const seedTodos = [
    { title: "Set up environment variables", completed: true },
    { title: "Run initial Prisma migration", completed: true },
    { title: "Build one-page todo UI", completed: false },
    { title: "Test add, toggle, and delete actions", completed: false },
  ];

  await prisma.todo.deleteMany();

  await prisma.todo.createMany({
    data: seedTodos,
  });

  console.log(`Seeded ${seedTodos.length} todos.`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
