import "dotenv/config";
import cors from "cors";
import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDatabase, disconnectDatabase } from "./utils/prisma.js";

const app = express();
const port = Number(process.env.PORT ?? 5000);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api", routes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDatabase();
  process.exit(0);
});

void startServer();
