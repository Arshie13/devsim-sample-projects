import { connectDB, disconnectDB } from "../db.js";
import { Todo } from "../models/Todo.js";

async function main() {
  await connectDB();

  const seedTodos = [
    { title: "Set up environment variables", completed: true },
    { title: "Connect to MongoDB and verify the connection", completed: true },
    { title: "Build one-page todo UI", completed: false },
    { title: "Test add, toggle, and delete actions", completed: false },
  ];

  await Todo.deleteMany({});
  await Todo.insertMany(seedTodos);

  console.log(`Seeded ${seedTodos.length} todos.`);
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(disconnectDB);
