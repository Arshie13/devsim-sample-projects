import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB(uri: string = env.MONGO_URI): Promise<typeof mongoose> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose;
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
