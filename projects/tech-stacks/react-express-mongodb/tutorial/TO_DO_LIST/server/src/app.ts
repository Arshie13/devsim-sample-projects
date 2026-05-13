import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import { env } from "./env.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CLIENT_ORIGIN }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
}
