import { beforeAll, afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-change-me";
process.env.PORT = process.env.PORT ?? "0";

let mongoServer: MongoMemoryServer | null = null;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key]!.deleteMany({});
  }
});
