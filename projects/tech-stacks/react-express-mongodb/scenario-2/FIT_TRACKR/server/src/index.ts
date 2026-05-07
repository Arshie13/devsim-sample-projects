import { createApp } from "./app.js";
import { connectDB } from "./db.js";
import { env } from "./env.js";

async function start() {
  await connectDB();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`🚀 FitTrackr server running on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
