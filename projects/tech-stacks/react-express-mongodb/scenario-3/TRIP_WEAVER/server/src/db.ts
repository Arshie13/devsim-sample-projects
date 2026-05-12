import mongoose from "mongoose";
import { env } from "./env.js";
const { MONGO_URI } = env;

export async function connectDB(uri: string = MONGO_URI): Promise<void> {
  await mongoose.connect(uri);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
