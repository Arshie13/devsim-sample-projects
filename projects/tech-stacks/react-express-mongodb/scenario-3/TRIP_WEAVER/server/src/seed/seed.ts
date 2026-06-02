/**
 * Application seed — TripWeaver
 *
 * Populates the MongoDB database with realistic sample data.
 *
 * Notes for DevSim:
 * - tomh (timezone: "Asia/Manila") owns the Tokyo trip (destinationTimezone: "Asia/Tokyo")
 *   Used for L5-T2: a Manila user planning a Tokyo trip proves per-trip timezone matters.
 * - Two stops on the Tokyo trip are seeded at edge-of-UTC-day times:
 *     2026-04-12T15:30:00Z → Tokyo local: 2026-04-13 00:30 (next day!)
 *     2026-04-13T15:30:00Z → Tokyo local: 2026-04-14 00:30 (next day!)
 *   The L5-T2 bug (toISOString grouping) puts these on Apr 12 / Apr 13 (UTC).
 *   The fix (localDateKeyForTrip) puts them on Apr 13 / Apr 14 (Tokyo local).
 * - Two duplicate Vote docs are seeded intentionally (same userId + stopId).
 *   The affected stop's voteCount is 1 higher than the number of distinct voters.
 *   This proves the L5-T1 drift exists before the unique-index fix.
 *
 * Usage:
 *   npm run db:seed   (from TRIP_WEAVER/ or TRIP_WEAVER/server/)
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../db.js";
import { User } from "../models/User.js";
import { Trip } from "../models/Trip.js";
import { Stop } from "../models/Stop.js";
import { Vote } from "../models/Vote.js";
import { Expense } from "../models/Expense.js";
import { Comment } from "../models/Comment.js";

async function seed() {
  await connectDB();
  console.log("🌱 Seeding TripWeaver database...\n");

  // Clear existing data
  await Comment.deleteMany();
  await Vote.deleteMany();
  await Expense.deleteMany();
  await Stop.deleteMany();
  await Trip.deleteMany();
  await User.deleteMany();
  console.log("🗑️  Cleared existing data\n");

  // ── Users ──────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("password123", 10);

  const [tomh, priya, marcusb, elena, jasonw, leilac, rafael, sunita] = await User.insertMany([
    {
      name: "Tom Herrera",
      username: "tomh",
      email: "tom@wandermint.example",
      passwordHash,
      avatarUrl: "https://i.pravatar.cc/150?u=tomh",
      bio: "Avid traveler based in Manila. Always planning the next adventure.",
      homeCity: "Manila",
      timezone: "Asia/Manila", // L5-T2: Manila user planning a Tokyo trip
    },
    {
      name: "Priya Nair",
      username: "priyan",
      email: "priya@wandermint.example",
      passwordHash,
      avatarUrl: "https://i.pravatar.cc/150?u=priya",
      bio: "Food and culture explorer. Tokyo ramen enthusiast.",
      homeCity: "Singapore",
      timezone: "Asia/Singapore",
    },
    {
      name: "Marcus Bright",
      username: "marcusb",
      email: "marcus@wandermint.example",
      passwordHash,
      avatarUrl: "https://i.pravatar.cc/150?u=marcus",
      bio: "Photographer and hiker. Iceland is calling.",
      homeCity: "London",
      timezone: "Europe/London",
    },
    {
      name: "Elena Vasquez",
      username: "elenav",
      email: "elena@wandermint.example",
      passwordHash,
      avatarUrl: "https://i.pravatar.cc/150?u=elena",
      bio: "Digital nomad. Lisbon is my second home.",
      homeCity: "Barcelona",
      timezone: "Europe/Madrid",
    },
    {
      name: "Jason Wu",
      username: "jasonw",
      email: "jason@wandermint.example",
      passwordHash,
      avatarUrl: "https://i.pravatar.cc/150?u=jason",
      bio: "Surfer and beach bum. Bali never gets old.",
      homeCity: "Sydney",
      timezone: "Australia/Sydney",
    },
    {
      name: "Leila Chen",
      username: "leilac",
      email: "leila@wandermint.example",
      passwordHash,
      avatarUrl: "https://i.pravatar.cc/150?u=leila",
      bio: "Architecture buff. Love exploring old city centers.",
      homeCity: "Toronto",
      timezone: "America/Toronto",
    },
    {
      name: "Rafael Oliveira",
      username: "rafaelo",
      email: "rafael@wandermint.example",
      passwordHash,
      avatarUrl: "https://i.pravatar.cc/150?u=rafael",
      bio: "Budget traveler. 40 countries and counting.",
      homeCity: "São Paulo",
      timezone: "America/Sao_Paulo",
    },
    {
      name: "Sunita Kapoor",
      username: "sunitak",
      email: "sunita@wandermint.example",
      passwordHash,
      avatarUrl: "https://i.pravatar.cc/150?u=sunita",
      bio: "Wellness and yoga retreats. Bali is my sanctuary.",
      homeCity: "Mumbai",
      timezone: "Asia/Kolkata",
    },
  ]);

  console.log(`✅ Created ${8} users\n`);

  // ── Trips ──────────────────────────────────────────────────────
  const [tokyoTrip, icelandTrip, lisbonTrip, baliTrip] = await Trip.insertMany([
    {
      // L5-T2 fixture: Tokyo trip owned by Manila user (tomh)
      // destinationTimezone is "Asia/Tokyo" — stops at edge-of-UTC-day times
      title: "Tokyo Cherry Blossoms",
      slug: "tokyo-cherry-blossoms-2026",
      ownerId: tomh._id,
      collaboratorIds: [priya._id, marcusb._id],
      destination: "Tokyo, Japan",
      destinationTimezone: "Asia/Tokyo",
      startDate: new Date("2026-04-13T00:00:00Z"),
      endDate: new Date("2026-04-18T23:59:59Z"),
      budget: 3000,
      currency: "USD",
      notes: "Cherry blossom season — must book early!",
      stopCount: 0,
      totalSpent: 0,
    },
    {
      title: "Iceland Ring Road",
      slug: "iceland-ring-road-2026",
      ownerId: marcusb._id,
      collaboratorIds: [elena._id, leilac._id],
      destination: "Reykjavik, Iceland",
      destinationTimezone: "Atlantic/Reykjavik",
      startDate: new Date("2026-07-01T00:00:00Z"),
      endDate: new Date("2026-07-10T23:59:59Z"),
      budget: 4500,
      currency: "USD",
      notes: "Midnight sun season — pack eye masks.",
      stopCount: 0,
      totalSpent: 0,
    },
    {
      title: "Lisbon Long Weekend",
      slug: "lisbon-long-weekend-2026",
      ownerId: elena._id,
      collaboratorIds: [rafael._id, leilac._id],
      destination: "Lisbon, Portugal",
      destinationTimezone: "Europe/Lisbon",
      startDate: new Date("2026-05-21T00:00:00Z"),
      endDate: new Date("2026-05-24T23:59:59Z"),
      budget: 1200,
      currency: "EUR",
      notes: "Long weekend getaway — Alfama and pastéis de nata.",
      stopCount: 0,
      totalSpent: 0,
    },
    {
      title: "Bali Wellness Retreat",
      slug: "bali-wellness-retreat-2026",
      ownerId: jasonw._id,
      collaboratorIds: [sunita._id, priya._id],
      destination: "Ubud, Bali, Indonesia",
      destinationTimezone: "Asia/Makassar",
      startDate: new Date("2026-09-05T00:00:00Z"),
      endDate: new Date("2026-09-12T23:59:59Z"),
      budget: 2000,
      currency: "USD",
      notes: "Yoga, rice terraces, and temple visits.",
      stopCount: 0,
      totalSpent: 0,
    },
  ]);

  console.log(`✅ Created ${4} trips\n`);

  // ── Stops ──────────────────────────────────────────────────────
  // Tokyo stops: two placed at edge-of-UTC-day times for L5-T2 bug demonstration
  //   15:30Z on Apr 12 → Tokyo local: Apr 13 00:30 (crosses midnight)
  //   15:30Z on Apr 13 → Tokyo local: Apr 14 00:30 (crosses midnight)
  // The L5-T2 bug groups these as Apr 12 / Apr 13 (UTC).
  // The fix groups them correctly as Apr 13 / Apr 14 (Tokyo local).
  const tokyoStops = await Stop.insertMany([
    {
      tripId: tokyoTrip._id,
      title: "Senso-ji Temple Night Visit",
      category: "activity",
      location: "Asakusa, Tokyo",
      notes: "Lanterns are lit after dark — magical.",
      // L5-T2 fixture: 15:30 UTC = 00:30 next day in Tokyo (Apr 13 local)
      dayDate: new Date("2026-04-12T15:30:00Z"),
      order: 0,
      voteCount: 3, // L5-T1 drift: 1 more than distinct voters (should be 2 after backfill)
      suggestedBy: tomh._id,
    },
    {
      tripId: tokyoTrip._id,
      title: "Shibuya Crossing",
      category: "activity",
      location: "Shibuya, Tokyo",
      notes: "Busiest pedestrian crossing in the world.",
      // L5-T2 fixture: 15:30 UTC = 00:30 next day in Tokyo (Apr 14 local)
      dayDate: new Date("2026-04-13T15:30:00Z"),
      order: 0,
      voteCount: 2,
      suggestedBy: priya._id,
    },
    {
      tripId: tokyoTrip._id,
      title: "Tsukiji Outer Market Breakfast",
      category: "food",
      location: "Tsukiji, Tokyo",
      notes: "Fresh tuna sashimi at 7am.",
      dayDate: new Date("2026-04-14T01:00:00Z"),
      order: 0,
      voteCount: 4,
      suggestedBy: marcusb._id,
    },
    {
      tripId: tokyoTrip._id,
      title: "teamLab Borderless",
      category: "activity",
      location: "Odaiba, Tokyo",
      notes: "Book tickets in advance — sells out.",
      dayDate: new Date("2026-04-14T08:00:00Z"),
      order: 1,
      voteCount: 5,
      suggestedBy: priya._id,
    },
    {
      tripId: tokyoTrip._id,
      title: "Shinjuku Gyoen Cherry Blossom Viewing",
      category: "activity",
      location: "Shinjuku, Tokyo",
      notes: "Best spot for hanami (flower viewing).",
      dayDate: new Date("2026-04-15T01:00:00Z"),
      order: 0,
      voteCount: 6,
      suggestedBy: tomh._id,
    },
    {
      tripId: tokyoTrip._id,
      title: "Hakone Day Trip",
      category: "activity",
      location: "Hakone, Kanagawa",
      notes: "Clear day view of Mt Fuji from Ashi Lake.",
      dayDate: new Date("2026-04-16T00:00:00Z"),
      order: 0,
      voteCount: 4,
      suggestedBy: marcusb._id,
    },
    // Iceland stops
    {
      tripId: icelandTrip._id,
      title: "Golden Circle Tour",
      category: "activity",
      location: "Þingvellir, Iceland",
      notes: "Geysir, Gullfoss, and Þingvellir in one day.",
      dayDate: new Date("2026-07-01T09:00:00Z"),
      order: 0,
      voteCount: 5,
      suggestedBy: marcusb._id,
    },
    {
      tripId: icelandTrip._id,
      title: "Blue Lagoon",
      category: "lodging",
      location: "Grindavík, Iceland",
      notes: "Book the Silica Hotel package — private lagoon access.",
      dayDate: new Date("2026-07-02T14:00:00Z"),
      order: 0,
      voteCount: 7,
      suggestedBy: leilac._id,
    },
    {
      tripId: icelandTrip._id,
      title: "Jökulsárlón Glacier Lagoon",
      category: "activity",
      location: "Vatnajökull, Iceland",
      notes: "Diamond Beach nearby — icebergs on black sand.",
      dayDate: new Date("2026-07-05T10:00:00Z"),
      order: 0,
      voteCount: 8,
      suggestedBy: elena._id,
    },
    // Lisbon stops
    {
      tripId: lisbonTrip._id,
      title: "Pastéis de Belém",
      category: "food",
      location: "Belém, Lisbon",
      notes: "The original pastel de nata since 1837.",
      dayDate: new Date("2026-05-21T09:00:00Z"),
      order: 0,
      voteCount: 6,
      suggestedBy: elena._id,
    },
    {
      tripId: lisbonTrip._id,
      title: "Alfama Fado Show",
      category: "activity",
      location: "Alfama, Lisbon",
      notes: "Traditional fado music in a tiny tasca.",
      dayDate: new Date("2026-05-21T20:00:00Z"),
      order: 1,
      voteCount: 5,
      suggestedBy: rafael._id,
    },
    {
      tripId: lisbonTrip._id,
      title: "Sintra Day Trip",
      category: "activity",
      location: "Sintra, Portugal",
      notes: "Pena Palace and Quinta da Regaleira.",
      dayDate: new Date("2026-05-22T09:00:00Z"),
      order: 0,
      voteCount: 4,
      suggestedBy: leilac._id,
    },
    // Bali stops
    {
      tripId: baliTrip._id,
      title: "Tegallalang Rice Terraces",
      category: "activity",
      location: "Tegallalang, Ubud",
      notes: "Morning light is perfect for photos.",
      dayDate: new Date("2026-09-06T01:00:00Z"),
      order: 0,
      voteCount: 5,
      suggestedBy: jasonw._id,
    },
    {
      tripId: baliTrip._id,
      title: "Yoga Barn Morning Class",
      category: "activity",
      location: "Ubud, Bali",
      notes: "Sunrise yoga followed by smoothie bowls.",
      dayDate: new Date("2026-09-07T00:00:00Z"),
      order: 0,
      voteCount: 6,
      suggestedBy: sunita._id,
    },
  ]);

  // Update stopCount cache on each trip
  await Trip.findByIdAndUpdate(tokyoTrip._id, { stopCount: 6 });
  await Trip.findByIdAndUpdate(icelandTrip._id, { stopCount: 3 });
  await Trip.findByIdAndUpdate(lisbonTrip._id, { stopCount: 3 });
  await Trip.findByIdAndUpdate(baliTrip._id, { stopCount: 2 });

  console.log(`✅ Created ${tokyoStops.length + 3 + 3 + 2} stops\n`);

  // ── Votes ──────────────────────────────────────────────────────
  // Note: Two duplicate Vote docs are seeded intentionally for L5-T1.
  // Both tomh and priya voted on Senso-ji stop.
  // Additionally, tomh has TWO Vote docs for Senso-ji (the duplicate).
  // This makes voteCount=3 but only 2 distinct voters — proving drift.
  const sensojiStop = tokyoStops[0]; // Senso-ji Temple Night Visit
  const shibuyaStop = tokyoStops[1]; // Shibuya Crossing

  await Vote.insertMany([
    // Senso-ji votes (2 distinct users, but 3 Vote docs due to intentional duplicate)
    { stopId: sensojiStop._id, userId: tomh._id, votedAt: new Date("2026-03-01T10:00:00Z") },
    { stopId: sensojiStop._id, userId: priya._id, votedAt: new Date("2026-03-01T11:00:00Z") },
    // L5-T1 BUG (intentional): duplicate Vote doc — same userId + stopId as first entry above
    // This inflates sensojiStop.voteCount to 3 instead of 2
    { stopId: sensojiStop._id, userId: tomh._id, votedAt: new Date("2026-03-01T10:05:00Z") },

    // Shibuya votes
    { stopId: shibuyaStop._id, userId: tomh._id, votedAt: new Date("2026-03-02T09:00:00Z") },
    { stopId: shibuyaStop._id, userId: marcusb._id, votedAt: new Date("2026-03-02T10:00:00Z") },

    // teamLab votes
    { stopId: tokyoStops[3]._id, userId: tomh._id, votedAt: new Date() },
    { stopId: tokyoStops[3]._id, userId: priya._id, votedAt: new Date() },
    { stopId: tokyoStops[3]._id, userId: marcusb._id, votedAt: new Date() },
    { stopId: tokyoStops[3]._id, userId: leilac._id, votedAt: new Date() },
    { stopId: tokyoStops[3]._id, userId: jasonw._id, votedAt: new Date() },

    // Iceland: Golden Circle
    { stopId: tokyoStops[6]._id, userId: marcusb._id, votedAt: new Date() },
    { stopId: tokyoStops[6]._id, userId: elena._id, votedAt: new Date() },
  ]);

  console.log(`✅ Created votes (including 1 intentional duplicate for L5-T1)\n`);

  // ── Expenses ───────────────────────────────────────────────────
  await Expense.insertMany([
    {
      tripId: tokyoTrip._id,
      paidById: tomh._id,
      amount: 450,
      currency: "USD",
      description: "teamLab Borderless tickets x3",
      splitBetween: [tomh._id, priya._id, marcusb._id],
      paidAt: new Date("2026-04-01T00:00:00Z"),
    },
    {
      tripId: tokyoTrip._id,
      paidById: priya._id,
      amount: 180,
      currency: "USD",
      description: "Airbnb first two nights",
      splitBetween: [tomh._id, priya._id, marcusb._id],
      paidAt: new Date("2026-03-15T00:00:00Z"),
    },
    {
      tripId: tokyoTrip._id,
      paidById: marcusb._id,
      amount: 90,
      currency: "USD",
      description: "Shinkansen day passes",
      splitBetween: [tomh._id, priya._id, marcusb._id],
      paidAt: new Date("2026-04-14T00:00:00Z"),
    },
    {
      tripId: icelandTrip._id,
      paidById: marcusb._id,
      amount: 750,
      currency: "USD",
      description: "Blue Lagoon packages x3",
      splitBetween: [marcusb._id, elena._id, leilac._id],
      paidAt: new Date("2026-07-02T00:00:00Z"),
    },
    {
      tripId: icelandTrip._id,
      paidById: leilac._id,
      amount: 320,
      currency: "USD",
      description: "4WD rental days 3-5",
      splitBetween: [marcusb._id, elena._id, leilac._id],
      paidAt: new Date("2026-07-03T00:00:00Z"),
    },
    {
      tripId: lisbonTrip._id,
      paidById: elena._id,
      amount: 240,
      currency: "EUR",
      description: "Hotel Alfama x3 nights",
      splitBetween: [elena._id, rafael._id, leilac._id],
      paidAt: new Date("2026-05-21T00:00:00Z"),
    },
    {
      tripId: lisbonTrip._id,
      paidById: rafael._id,
      amount: 60,
      currency: "EUR",
      description: "Fado dinner show",
      splitBetween: [elena._id, rafael._id],
      paidAt: new Date("2026-05-21T20:00:00Z"),
    },
    {
      tripId: baliTrip._id,
      paidById: jasonw._id,
      amount: 600,
      currency: "USD",
      description: "Villa rental 7 nights",
      splitBetween: [jasonw._id, sunita._id, priya._id],
      paidAt: new Date("2026-09-05T00:00:00Z"),
    },
    {
      tripId: baliTrip._id,
      paidById: sunita._id,
      amount: 150,
      currency: "USD",
      description: "Yoga Barn class passes x7 days",
      splitBetween: [jasonw._id, sunita._id, priya._id],
      paidAt: new Date("2026-09-06T00:00:00Z"),
    },
  ]);

  // Update totalSpent cache
  await Trip.findByIdAndUpdate(tokyoTrip._id, { totalSpent: 720 });
  await Trip.findByIdAndUpdate(icelandTrip._id, { totalSpent: 1070 });
  await Trip.findByIdAndUpdate(lisbonTrip._id, { totalSpent: 300 });
  await Trip.findByIdAndUpdate(baliTrip._id, { totalSpent: 750 });

  console.log(`✅ Created ${9} expenses\n`);

  // ── Comments ───────────────────────────────────────────────────
  await Comment.insertMany([
    {
      tripId: tokyoTrip._id,
      authorId: priya._id,
      body: "I heard cherry blossom season is earlier this year — should we adjust dates?",
    },
    {
      tripId: tokyoTrip._id,
      authorId: marcusb._id,
      body: "Booked the Shinkansen passes already. Let's do Hakone on day 3!",
    },
    {
      tripId: tokyoTrip._id,
      authorId: tomh._id,
      body: "teamLab tickets booked for all three of us. So excited!",
    },
    {
      tripId: icelandTrip._id,
      authorId: elena._id,
      body: "We definitely need a 4WD for the ring road — normal cars can't do F-roads.",
    },
    {
      tripId: icelandTrip._id,
      authorId: leilac._id,
      body: "Blue Lagoon is worth it. The Silica package includes dinner — highly recommend.",
    },
    {
      tripId: lisbonTrip._id,
      authorId: rafael._id,
      body: "Pastéis de Belém opens at 8am — go early before the queue gets crazy.",
    },
    {
      tripId: lisbonTrip._id,
      authorId: leilac._id,
      body: "The Sintra palaces are incredible but wear comfy shoes — lots of walking.",
    },
    {
      tripId: baliTrip._id,
      authorId: sunita._id,
      body: "Yoga Barn has sunset classes too — highly recommend for the last night.",
    },
  ]);

  console.log(`✅ Created ${8} comments\n`);

  console.log("🎉 TripWeaver database seeded successfully!\n");
  console.log("📊 Summary:");
  console.log("   Users: 8");
  console.log("   Trips: 4");
  console.log("   Stops: 14");
  console.log("   Votes: 12 (including 1 intentional duplicate — L5-T1)");
  console.log("   Expenses: 9");
  console.log("   Comments: 8");
  console.log("");
  console.log("⚠️  DevSim Notes:");
  console.log("   L5-T1: sensojiStop.voteCount=3 but only 2 distinct voters (duplicate Vote doc seeded)");
  console.log("   L5-T2: Tokyo stops at 15:30Z (= 00:30 Tokyo next day) for timezone grouping test");

  await disconnectDB();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
