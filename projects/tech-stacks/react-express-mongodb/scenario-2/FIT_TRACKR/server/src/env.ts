import "dotenv/config";

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export const env = {
  MONGO_URI: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/fittrackr",
  PORT: Number(process.env.PORT ?? 4000),
  JWT_SECRET: required("JWT_SECRET"),
};
