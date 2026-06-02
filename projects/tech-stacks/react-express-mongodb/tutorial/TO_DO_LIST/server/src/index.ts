import { createApp } from "./app.js";
import { connectDB, disconnectDB } from "./db.js";
import { env } from "./env.js";

async function main() {
  await connectDB();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
