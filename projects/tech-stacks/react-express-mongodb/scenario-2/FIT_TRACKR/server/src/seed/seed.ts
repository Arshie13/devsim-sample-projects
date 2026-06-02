/**
 * FitTrackr application database seed.
 *
 * Inserts sample users, workouts, comments, and cheers into MongoDB so that
 * a freshly-cloned dev environment shows realistic content as soon as
 * the client starts.
 *
 * Run with:
 *   npm run db:seed   (from the server/ directory)
 *
 * Notes for DevSim:
 *   - tomh has timezone "Asia/Manila" (UTC+8) — used to reproduce L5-T2 bug.
 *   - Two workouts for tomh are placed at 15:30 UTC on consecutive UTC dates,
 *     which is 23:30 local time on consecutive local days (Mon/Tue in Manila).
 *     A naive UTC-date grouping will miscounts this as a broken streak.
 *   - Two duplicate Cheer docs are seeded intentionally to demonstrate L5-T1
 *     counter drift (same userId+workoutId pair appears twice).
 *   - cheerCount on some workouts is intentionally higher than the number of
 *     unique Cheer docs, reflecting the pre-fix state.
 */
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../db.js";
import { User } from "../models/User.js";
import { Workout } from "../models/Workout.js";
import { Comment } from "../models/Comment.js";
import { Cheer } from "../models/Cheer.js";
import { slugify } from "../utils/slug.js";

interface SeedUser {
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  role: "member" | "coach";
  timezone: string;
}

const seedUsers: SeedUser[] = [
  { name: "Jules Romero", username: "coachjules", email: "jules@fittrackr.dev", password: "password123", bio: "Strength coach. 10 years on the platform.", role: "coach", timezone: "UTC" },
  { name: "Maya Tanaka", username: "coachmaya", email: "maya@fittrackr.dev", password: "password123", bio: "Mobility & yoga specialist.", role: "coach", timezone: "UTC" },
  { name: "Tom Harada", username: "tomh", email: "tom@fittrackr.dev", password: "password123", bio: "Runner turned lifter.", role: "member", timezone: "Asia/Manila" },
  { name: "Priya Iyer", username: "priya", email: "priya@fittrackr.dev", password: "password123", bio: "HIIT is life.", role: "member", timezone: "UTC" },
  { name: "Marcus Bell", username: "marcusb", email: "marcus@fittrackr.dev", password: "password123", bio: "Powerlifting since 2018.", role: "member", timezone: "UTC" },
  { name: "Linnea Berg", username: "linnea", email: "linnea@fittrackr.dev", password: "password123", bio: "Cyclist and weekend hiker.", role: "member", timezone: "UTC" },
  { name: "Devon Ortega", username: "dev0", email: "devon@fittrackr.dev", password: "password123", bio: "Beginner trying everything.", role: "member", timezone: "UTC" },
  { name: "Kit Andersen", username: "kit", email: "kit@fittrackr.dev", password: "password123", bio: "Calisthenics only.", role: "member", timezone: "UTC" },
];

interface SeedWorkout {
  authorIndex: number;
  title: string;
  category: "strength" | "cardio" | "mobility" | "hiit";
  exercises: { name: string; sets: number; reps: number; weightKg: number; durationSec: number }[];
  notes: string;
  tags: string[];
  durationMin: number;
  daysAgo: number;
  utcHour?: number;
  initialCheerCount: number;
}

const seedWorkouts: SeedWorkout[] = [
  {
    authorIndex: 0,
    title: "Heavy Squat Day",
    category: "strength",
    exercises: [
      { name: "Back Squat", sets: 5, reps: 5, weightKg: 120, durationSec: 0 },
      { name: "Romanian Deadlift", sets: 3, reps: 8, weightKg: 90, durationSec: 0 },
      { name: "Leg Press", sets: 3, reps: 12, weightKg: 200, durationSec: 0 },
    ],
    notes: "Hit a new 5RM today. Focus on bracing throughout.",
    tags: ["strength", "legs", "squat"],
    durationMin: 70,
    daysAgo: 1,
    initialCheerCount: 18,
  },
  {
    authorIndex: 0,
    title: "Upper Body Push",
    category: "strength",
    exercises: [
      { name: "Bench Press", sets: 4, reps: 6, weightKg: 100, durationSec: 0 },
      { name: "Overhead Press", sets: 3, reps: 8, weightKg: 60, durationSec: 0 },
      { name: "Dips", sets: 3, reps: 12, weightKg: 0, durationSec: 0 },
    ],
    notes: "Paused reps on bench. Really felt the chest.",
    tags: ["strength", "push", "upper"],
    durationMin: 60,
    daysAgo: 3,
    initialCheerCount: 22,
  },
  {
    authorIndex: 1,
    title: "Morning Flow & Mobility",
    category: "mobility",
    exercises: [
      { name: "Hip 90/90 Stretch", sets: 2, reps: 0, weightKg: 0, durationSec: 60 },
      { name: "Cat-Cow", sets: 2, reps: 10, weightKg: 0, durationSec: 0 },
      { name: "World's Greatest Stretch", sets: 3, reps: 5, weightKg: 0, durationSec: 0 },
    ],
    notes: "Do this first thing in the morning before coffee. Game changer.",
    tags: ["mobility", "morning", "flexibility"],
    durationMin: 25,
    daysAgo: 2,
    initialCheerCount: 31,
  },
  {
    authorIndex: 1,
    title: "Yoga Flow — Hips & Hamstrings",
    category: "mobility",
    exercises: [
      { name: "Pigeon Pose", sets: 2, reps: 0, weightKg: 0, durationSec: 90 },
      { name: "Seated Forward Fold", sets: 3, reps: 0, weightKg: 0, durationSec: 60 },
    ],
    notes: "Hold each pose, breathe into the stretch.",
    tags: ["yoga", "mobility", "recovery"],
    durationMin: 40,
    daysAgo: 5,
    initialCheerCount: 14,
  },
  {
    authorIndex: 2,
    title: "5K Morning Run",
    category: "cardio",
    exercises: [
      { name: "Easy Run", sets: 1, reps: 0, weightKg: 0, durationSec: 1620 },
    ],
    notes: "27 minutes flat. Flat course, mild wind.",
    tags: ["running", "cardio", "5k"],
    durationMin: 28,
    daysAgo: 0,
    initialCheerCount: 9,
  },
  // L5-T2 reproduction: two workouts for tomh (index 2) at 15:30Z on consecutive UTC dates.
  // In Asia/Manila (UTC+8) these are 23:30 on two consecutive local calendar days.
  // A naive UTC toISOString().slice(0,10) grouping will place them on different UTC days
  // (same as local days) so this alone doesn't break the streak.
  // BUT: if a student groups by UTC date AND uses midnight UTC as day boundary,
  // any workout before 16:00 UTC for UTC+8 users looks like "wrong" day.
  // We use 15:30Z specifically because it's 23:30 local — very close to midnight.
  {
    authorIndex: 2,
    title: "Late Night Track Session",
    category: "cardio",
    exercises: [
      { name: "400m Repeats", sets: 6, reps: 0, weightKg: 0, durationSec: 90 },
    ],
    notes: "6x400 with 90s rest. Felt strong at 23:30.",
    tags: ["track", "cardio", "intervals"],
    durationMin: 35,
    daysAgo: 8,
    utcHour: 15, // 15:30 UTC = 23:30 Manila
    initialCheerCount: 7,
  },
  {
    authorIndex: 2,
    title: "Late Night Tempo Run",
    category: "cardio",
    exercises: [
      { name: "Tempo Run", sets: 1, reps: 0, weightKg: 0, durationSec: 1800 },
    ],
    notes: "30 min tempo at 23:30. Day 2 of streak.",
    tags: ["tempo", "cardio", "running"],
    durationMin: 32,
    daysAgo: 7,
    utcHour: 15, // 15:30 UTC = 23:30 Manila
    initialCheerCount: 5,
  },
  {
    authorIndex: 3,
    title: "Tabata HIIT Blast",
    category: "hiit",
    exercises: [
      { name: "Burpees", sets: 8, reps: 0, weightKg: 0, durationSec: 20 },
      { name: "Jump Squats", sets: 8, reps: 0, weightKg: 0, durationSec: 20 },
      { name: "Mountain Climbers", sets: 8, reps: 0, weightKg: 0, durationSec: 20 },
    ],
    notes: "Pure chaos in the best way. Tabata timer on repeat.",
    tags: ["hiit", "tabata", "cardio"],
    durationMin: 25,
    daysAgo: 1,
    initialCheerCount: 25,
  },
  {
    authorIndex: 3,
    title: "Sprint Intervals",
    category: "hiit",
    exercises: [
      { name: "10m Sprints", sets: 10, reps: 0, weightKg: 0, durationSec: 8 },
      { name: "Rest Walk", sets: 10, reps: 0, weightKg: 0, durationSec: 60 },
    ],
    notes: "Full effort on every rep. No jog recovery.",
    tags: ["hiit", "sprints", "speed"],
    durationMin: 20,
    daysAgo: 4,
    initialCheerCount: 16,
  },
  {
    authorIndex: 4,
    title: "Deadlift PR Attempt",
    category: "strength",
    exercises: [
      { name: "Conventional Deadlift", sets: 1, reps: 1, weightKg: 200, durationSec: 0 },
      { name: "Deficit Deadlift", sets: 3, reps: 5, weightKg: 140, durationSec: 0 },
    ],
    notes: "200kg single! New all-time PR. Back felt solid.",
    tags: ["strength", "deadlift", "PR"],
    durationMin: 80,
    daysAgo: 2,
    initialCheerCount: 41,
  },
  {
    authorIndex: 5,
    title: "60km Bike Ride",
    category: "cardio",
    exercises: [
      { name: "Road Cycling", sets: 1, reps: 0, weightKg: 0, durationSec: 7200 },
    ],
    notes: "Rolling hills, light tailwind on the way back. Averaged 28 km/h.",
    tags: ["cycling", "cardio", "endurance"],
    durationMin: 120,
    daysAgo: 3,
    initialCheerCount: 19,
  },
  {
    authorIndex: 6,
    title: "First Pull-Up Session",
    category: "strength",
    exercises: [
      { name: "Assisted Pull-Up", sets: 3, reps: 5, weightKg: 0, durationSec: 0 },
      { name: "Dead Hang", sets: 3, reps: 0, weightKg: 0, durationSec: 20 },
    ],
    notes: "Still using a band but making progress. Will get there!",
    tags: ["beginner", "strength", "calisthenics"],
    durationMin: 30,
    daysAgo: 1,
    initialCheerCount: 12,
  },
  {
    authorIndex: 7,
    title: "Calisthenics Flow",
    category: "strength",
    exercises: [
      { name: "Handstand Hold", sets: 5, reps: 0, weightKg: 0, durationSec: 10 },
      { name: "L-Sit", sets: 5, reps: 0, weightKg: 0, durationSec: 5 },
      { name: "Muscle-Up", sets: 3, reps: 4, weightKg: 0, durationSec: 0 },
    ],
    notes: "Finally hit 3 clean muscle-ups in a row.",
    tags: ["calisthenics", "skill", "gymnastics"],
    durationMin: 55,
    daysAgo: 2,
    initialCheerCount: 33,
  },
  {
    authorIndex: 7,
    title: "Ring Dips & Rows",
    category: "strength",
    exercises: [
      { name: "Ring Dips", sets: 4, reps: 8, weightKg: 0, durationSec: 0 },
      { name: "Ring Rows", sets: 4, reps: 10, weightKg: 0, durationSec: 0 },
    ],
    notes: "Rings are humbling. So much instability work.",
    tags: ["rings", "calisthenics", "push-pull"],
    durationMin: 40,
    daysAgo: 5,
    initialCheerCount: 11,
  },
  {
    authorIndex: 1,
    title: "Deep Hip Opener Flow",
    category: "mobility",
    exercises: [
      { name: "Deep Squat Hold", sets: 3, reps: 0, weightKg: 0, durationSec: 60 },
      { name: "Frog Stretch", sets: 2, reps: 0, weightKg: 0, durationSec: 90 },
      { name: "Couch Stretch", sets: 2, reps: 0, weightKg: 0, durationSec: 60 },
    ],
    notes: "Essential for anyone sitting at a desk all day.",
    tags: ["mobility", "hips", "desk worker"],
    durationMin: 30,
    daysAgo: 10,
    initialCheerCount: 8,
  },
  {
    authorIndex: 0,
    title: "Back Day — Pull Focus",
    category: "strength",
    exercises: [
      { name: "Pull-Ups", sets: 5, reps: 6, weightKg: 0, durationSec: 0 },
      { name: "Barbell Row", sets: 4, reps: 6, weightKg: 80, durationSec: 0 },
      { name: "Face Pulls", sets: 3, reps: 15, weightKg: 20, durationSec: 0 },
    ],
    notes: "Strict form on the rows — no cheat reps.",
    tags: ["strength", "back", "pull"],
    durationMin: 65,
    daysAgo: 12,
    initialCheerCount: 15,
  },
  {
    authorIndex: 4,
    title: "Squat Accessory Day",
    category: "strength",
    exercises: [
      { name: "Pause Squat", sets: 4, reps: 4, weightKg: 140, durationSec: 0 },
      { name: "Bulgarian Split Squat", sets: 3, reps: 8, weightKg: 50, durationSec: 0 },
    ],
    notes: "The pause squats are brutal. Necessary for depth.",
    tags: ["strength", "squat", "accessory"],
    durationMin: 55,
    daysAgo: 6,
    initialCheerCount: 10,
  },
  {
    authorIndex: 3,
    title: "AMRAP 20 Minutes",
    category: "hiit",
    exercises: [
      { name: "Box Jumps", sets: 0, reps: 10, weightKg: 0, durationSec: 0 },
      { name: "KB Swings", sets: 0, reps: 15, weightKg: 24, durationSec: 0 },
      { name: "Push-Ups", sets: 0, reps: 20, weightKg: 0, durationSec: 0 },
    ],
    notes: "AMRAP format. Got 8 full rounds. Heart rate maxed.",
    tags: ["hiit", "amrap", "functional"],
    durationMin: 20,
    daysAgo: 13,
    initialCheerCount: 6,
  },
];

const seedComments = [
  { workoutIndex: 0, authorIndex: 4, body: "120kg squat is no joke. What programme are you running?" },
  { workoutIndex: 0, authorIndex: 6, body: "Goals! Hoping to hit bodyweight squat by end of month." },
  { workoutIndex: 2, authorIndex: 3, body: "Adding this to my warm-up immediately." },
  { workoutIndex: 2, authorIndex: 6, body: "The 90/90 stretch changed my hip health!" },
  { workoutIndex: 9, authorIndex: 0, body: "200kg! Absolute beast mode. Congrats!" },
  { workoutIndex: 9, authorIndex: 7, body: "New PR energy is unmatched. Celebrate it!" },
  { workoutIndex: 7, authorIndex: 5, body: "Tabata is the fastest I've ever gotten gassed. Respect." },
  { workoutIndex: 12, authorIndex: 4, body: "Muscle-ups are next on my list. Any tips on transition?" },
  { workoutIndex: 12, authorIndex: 1, body: "Rings training = best for body control. Great session!" },
  { workoutIndex: 4, authorIndex: 2, body: "27 min 5K is solid! Keep chasing that sub-25." },
  { workoutIndex: 10, authorIndex: 0, body: "60km! The cycling community in here is elite." },
  { workoutIndex: 11, authorIndex: 5, body: "Beginner gains are the fastest gains. Keep it up!" },
  { workoutIndex: 1, authorIndex: 3, body: "Paused reps are so underrated for chest development." },
  { workoutIndex: 3, authorIndex: 2, body: "Hip flexibility is a superpower. Thank you for sharing." },
  { workoutIndex: 5, authorIndex: 4, body: "Late night track sessions hit different. Great intervals." },
];

async function main() {
  console.log("🌱 FitTrackr seed starting...\n");
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Workout.deleteMany({}),
    Comment.deleteMany({}),
    Cheer.deleteMany({}),
  ]);
  console.log("🗑️  Cleared collections");

  const userDocs = await Promise.all(
    seedUsers.map(async (u) => {
      const passwordHash = await bcrypt.hash(u.password, 10);
      return User.create({
        name: u.name,
        username: u.username,
        email: u.email,
        passwordHash,
        bio: u.bio,
        role: u.role,
        timezone: u.timezone,
      });
    }),
  );
  console.log(`👥 Created ${userDocs.length} users`);

  const now = Date.now();
  const workoutDocs = await Promise.all(
    seedWorkouts.map(async (w, i) => {
      const author = userDocs[w.authorIndex]!;
      let performedAt: Date;
      if (w.utcHour !== undefined) {
        // Create timestamp with specific UTC hour for L5-T2 reproduction
        const d = new Date(now - w.daysAgo * 86400000);
        d.setUTCHours(w.utcHour, 30, 0, 0);
        performedAt = d;
      } else {
        performedAt = new Date(now - w.daysAgo * 86400000);
      }
      return Workout.create({
        title: w.title,
        slug: `${slugify(w.title)}-${i}`,
        category: w.category,
        exercises: w.exercises,
        notes: w.notes,
        tags: w.tags,
        durationMin: w.durationMin,
        performedAt,
        authorId: author._id,
        cheerCount: w.initialCheerCount,
        createdAt: performedAt,
        updatedAt: performedAt,
      });
    }),
  );
  console.log(`🏋️  Created ${workoutDocs.length} workouts`);

  for (const c of seedComments) {
    const workout = workoutDocs[c.workoutIndex]!;
    const author = userDocs[c.authorIndex]!;
    await Comment.create({ workoutId: workout._id, authorId: author._id, body: c.body });
  }
  console.log(`💬 Created ${seedComments.length} comments`);

  // Seed cheers — mostly unique, but two DUPLICATE pairs intentionally to reproduce L5-T1.
  // Also, many workouts have initialCheerCount > real Cheer doc count (pre-fix state).
  const cheerPairs: { userIndex: number; workoutIndex: number }[] = [
    { userIndex: 1, workoutIndex: 0 },
    { userIndex: 3, workoutIndex: 0 },
    { userIndex: 4, workoutIndex: 0 },
    { userIndex: 2, workoutIndex: 1 },
    { userIndex: 5, workoutIndex: 1 },
    { userIndex: 0, workoutIndex: 2 },
    { userIndex: 3, workoutIndex: 2 },
    { userIndex: 6, workoutIndex: 2 },
    { userIndex: 4, workoutIndex: 9 },
    { userIndex: 0, workoutIndex: 9 },
    { userIndex: 7, workoutIndex: 9 },
    { userIndex: 1, workoutIndex: 7 },
    { userIndex: 5, workoutIndex: 7 },
    { userIndex: 2, workoutIndex: 12 },
    { userIndex: 6, workoutIndex: 12 },
    { userIndex: 3, workoutIndex: 4 },
    { userIndex: 0, workoutIndex: 10 },
    { userIndex: 5, workoutIndex: 10 },
    // L5-T1 reproduction: duplicate cheer docs (same user, same workout):
    { userIndex: 1, workoutIndex: 0 }, // DUPLICATE of first entry above
    { userIndex: 4, workoutIndex: 9 }, // DUPLICATE of entry above
  ];

  for (const c of cheerPairs) {
    await Cheer.create({
      userId: userDocs[c.userIndex]!._id,
      workoutId: workoutDocs[c.workoutIndex]!._id,
    });
  }
  console.log(`📣 Created ${cheerPairs.length} cheer docs (includes 2 intentional duplicates for L5-T1)`);

  console.log("\n✅ FitTrackr seed complete.");
  console.log(`   Login as any seeded user (password: password123)`);
  console.log(`   e.g. username: coachjules  password: password123`);
  console.log(`   tomh has timezone Asia/Manila — used to reproduce L5-T2 streak bug`);
  await disconnectDB();
}

main().catch(async (err) => {
  console.error("❌ Seed failed:", err);
  await disconnectDB();
  process.exit(1);
});
