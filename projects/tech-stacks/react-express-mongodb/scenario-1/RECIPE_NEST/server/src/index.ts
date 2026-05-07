import { createApp } from "./app.js";
import { connectDB } from "./db.js";
import { env } from "./env.js";

async function main() {
  await connectDB();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[recipe-nest] API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("[recipe-nest] Failed to start", err);
  process.exit(1);
});
