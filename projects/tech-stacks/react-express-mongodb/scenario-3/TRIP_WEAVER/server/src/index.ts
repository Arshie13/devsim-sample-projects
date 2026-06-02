import { createApp } from "./app.js";
import { connectDB } from "./db.js";
import { env } from "./env.js";

async function start() {
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`🚀 TripWeaver server running on http://localhost:${env.PORT}`);
  });

  connectDB().catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
