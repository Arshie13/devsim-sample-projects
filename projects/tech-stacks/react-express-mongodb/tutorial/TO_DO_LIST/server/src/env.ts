import "dotenv/config";

export const env = {
  MONGO_URI: process.env.MONGO_URI ?? "mongodb://localhost:27017/todo_tutorial",
  PORT: Number(process.env.PORT ?? 5000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
};
