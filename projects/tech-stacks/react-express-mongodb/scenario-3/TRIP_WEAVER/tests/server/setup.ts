import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll, afterEach } from "vitest";

process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-change-me";
process.env.PORT = process.env.PORT ?? "4002";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
