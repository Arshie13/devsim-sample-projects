import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";

export async function connectDB(uri: string = MONGO_URI): Promise<void> {
  await mongoose.connect(uri);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
