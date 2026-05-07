import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../../server/src/models/User.js";

export async function createTestUser(
  overrides: Partial<{ name: string; username: string; email: string; timezone: string }> = {},
) {
  const username = overrides.username ?? `tester_${Math.random().toString(36).slice(2, 8)}`;
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await User.create({
    name: overrides.name ?? "Test User",
    username,
    email: overrides.email ?? `${username}@example.com`,
    passwordHash,
    timezone: overrides.timezone ?? "UTC",
  });
  const token = jwt.sign({ userId: String(user._id), username }, process.env.JWT_SECRET!);
  return { user, token };
}
