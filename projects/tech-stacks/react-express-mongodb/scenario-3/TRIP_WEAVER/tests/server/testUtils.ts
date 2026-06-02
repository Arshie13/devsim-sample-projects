import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../server/src/models/User";
import Trip from "../../server/src/models/Trip";
import Stop from "../../server/src/models/Stop";
import Vote from "../../server/src/models/Vote";
import Expense from "../../server/src/models/Expense";
import Comment from "../../server/src/models/Comment";

export async function createTestUser(overrides: Partial<{
  name: string;
  username: string;
  email: string;
  password: string;
  timezone: string;
  homeCity: string;
}> = {}) {
  const passwordHash = await bcrypt.hash(overrides.password ?? "password123", 10);
  const user = await User.create({
    name: overrides.name ?? "Test User",
    username: overrides.username ?? `user_${Date.now()}`,
    email: overrides.email ?? `test_${Date.now()}@example.com`,
    passwordHash,
    timezone: overrides.timezone ?? "UTC",
    homeCity: overrides.homeCity,
  });
  return user;
}

export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET ?? "test-secret";
  return jwt.sign({ id: userId }, secret, { expiresIn: "1h" });
}

export async function createTestTrip(ownerId: string, overrides: Partial<{
  title: string;
  slug: string;
  destination: string;
  destinationTimezone: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  collaboratorIds: string[];
}> = {}) {
  const slug = overrides.slug ?? `trip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const trip = await Trip.create({
    title: overrides.title ?? "Test Trip",
    slug,
    ownerId: new mongoose.Types.ObjectId(ownerId),
    collaboratorIds: (overrides.collaboratorIds ?? []).map((id) => new mongoose.Types.ObjectId(id)),
    destination: overrides.destination ?? "Tokyo, Japan",
    destinationTimezone: overrides.destinationTimezone ?? "UTC",
    startDate: overrides.startDate ?? new Date("2026-04-10T00:00:00Z"),
    endDate: overrides.endDate ?? new Date("2026-04-17T00:00:00Z"),
    budget: overrides.budget ?? 3000,
    currency: overrides.currency ?? "USD",
  });
  return trip;
}

export async function createTestStop(tripId: string, suggestedById: string, overrides: Partial<{
  title: string;
  category: string;
  location: string;
  dayDate: Date;
  order: number;
  voteCount: number;
}> = {}) {
  const stop = await Stop.create({
    tripId: new mongoose.Types.ObjectId(tripId),
    title: overrides.title ?? "Test Stop",
    category: overrides.category ?? "sightseeing",
    location: overrides.location ?? "Test Location",
    dayDate: overrides.dayDate ?? new Date("2026-04-10T09:00:00Z"),
    order: overrides.order ?? 1,
    voteCount: overrides.voteCount ?? 0,
    suggestedBy: new mongoose.Types.ObjectId(suggestedById),
  });
  return stop;
}

export async function createTestVote(stopId: string, userId: string) {
  return Vote.create({
    stopId: new mongoose.Types.ObjectId(stopId),
    userId: new mongoose.Types.ObjectId(userId),
  });
}

export async function createTestExpense(tripId: string, paidById: string, splitBetween: string[], overrides: Partial<{
  amount: number;
  currency: string;
  description: string;
}> = {}) {
  return Expense.create({
    tripId: new mongoose.Types.ObjectId(tripId),
    paidById: new mongoose.Types.ObjectId(paidById),
    amount: overrides.amount ?? 100,
    currency: overrides.currency ?? "USD",
    description: overrides.description ?? "Test Expense",
    splitBetween: splitBetween.map((id) => new mongoose.Types.ObjectId(id)),
  });
}

export { User, Trip, Stop, Vote, Expense, Comment };
