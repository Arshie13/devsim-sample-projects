/**
 * RecipeNest application database seed.
 *
 * Inserts sample users, recipes, comments, and saves into MongoDB so that
 * a freshly-cloned dev environment shows realistic content as soon as
 * the client starts.
 *
 * Run with:
 *   npm run db:seed   (from the server/ directory)
 */
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../db.js";
import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";
import { Comment } from "../models/Comment.js";
import { Save } from "../models/Save.js";
import { Rating } from "../models/Rating.js";
import { slugify } from "../utils/slug.js";

interface SeedUser {
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
}

const seedUsers: SeedUser[] = [
  { name: "Alex Rivera", username: "chefa", email: "alex@recipenest.dev", password: "password123", bio: "Pastry-obsessed home cook." },
  { name: "Bea Tanaka", username: "beat", email: "bea@recipenest.dev", password: "password123", bio: "One-pot weeknight champion." },
  { name: "Carlos Mendez", username: "carlosm", email: "carlos@recipenest.dev", password: "password123", bio: "BBQ + smoker fanatic." },
  { name: "Dani Park", username: "danip", email: "dani@recipenest.dev", password: "password123", bio: "Plant-forward and proud." },
  { name: "Eli Okafor", username: "elio", email: "eli@recipenest.dev", password: "password123", bio: "Comfort food with a twist." },
  { name: "Fatima Khan", username: "fatk", email: "fatima@recipenest.dev", password: "password123", bio: "Grandma's recipes, modernized." },
  { name: "Gus Lindqvist", username: "gusl", email: "gus@recipenest.dev", password: "password123", bio: "Sourdough every Sunday." },
  { name: "Hana Brooks", username: "hanab", email: "hana@recipenest.dev", password: "password123", bio: "Spicy noodle enthusiast." },
];

interface SeedRecipe {
  authorIndex: number;
  title: string;
  description: string;
  tags: string[];
  ingredients: { name: string; qty: string; unit: string }[];
  steps: string[];
  daysAgo: number;
  initialSavedCount: number;
  initialAvgRating: number;
  initialRatingsCount: number;
}

const seedRecipes: SeedRecipe[] = [
  {
    authorIndex: 0,
    title: "Lemon Tart",
    description: "Bright, zesty, and perfectly tart with a crumbly shortbread shell.",
    tags: ["dessert", "lemon", "tart"],
    ingredients: [
      { name: "lemon juice", qty: "1/2", unit: "cup" },
      { name: "sugar", qty: "3/4", unit: "cup" },
      { name: "eggs", qty: "3", unit: "" },
      { name: "butter", qty: "1/2", unit: "cup" },
    ],
    steps: ["Whisk eggs and sugar.", "Add lemon juice and melted butter.", "Bake in a tart shell at 350°F for 25 min."],
    daysAgo: 1,
    initialSavedCount: 12,
    initialAvgRating: 4.6,
    initialRatingsCount: 8,
  },
  {
    authorIndex: 1,
    title: "Sheet-Pan Chicken Pasta",
    description: "A weeknight savior — everything roasts on one pan.",
    tags: ["dinner", "pasta", "chicken", "weeknight"],
    ingredients: [
      { name: "chicken thighs", qty: "1", unit: "lb" },
      { name: "penne", qty: "1/2", unit: "lb" },
      { name: "cherry tomatoes", qty: "1", unit: "pint" },
    ],
    steps: ["Preheat oven to 425°F.", "Toss everything on a sheet pan.", "Roast 25 minutes, stirring once."],
    daysAgo: 2,
    initialSavedCount: 28,
    initialAvgRating: 4.4,
    initialRatingsCount: 15,
  },
  {
    authorIndex: 2,
    title: "Smoked Brisket Rub",
    description: "Coffee + cocoa + paprika — the rub that put my brisket on the map.",
    tags: ["bbq", "smoker", "beef"],
    ingredients: [
      { name: "ground coffee", qty: "2", unit: "tbsp" },
      { name: "cocoa", qty: "1", unit: "tbsp" },
      { name: "paprika", qty: "3", unit: "tbsp" },
    ],
    steps: ["Combine all spices.", "Pat brisket dry, coat liberally.", "Rest overnight before smoking."],
    daysAgo: 3,
    initialSavedCount: 19,
    initialAvgRating: 4.8,
    initialRatingsCount: 11,
  },
  {
    authorIndex: 3,
    title: "Chickpea Tikka Masala",
    description: "All the comfort, none of the meat.",
    tags: ["vegetarian", "indian", "weeknight", "dinner"],
    ingredients: [
      { name: "chickpeas", qty: "2", unit: "cans" },
      { name: "tomato puree", qty: "1", unit: "cup" },
      { name: "garam masala", qty: "1", unit: "tbsp" },
    ],
    steps: ["Bloom spices in butter.", "Add tomato puree and chickpeas.", "Simmer 20 minutes; finish with cream."],
    daysAgo: 4,
    initialSavedCount: 22,
    initialAvgRating: 4.5,
    initialRatingsCount: 9,
  },
  {
    authorIndex: 4,
    title: "Mac & Cheese with a Crispy Top",
    description: "Three cheeses, one perfect crust.",
    tags: ["comfort", "pasta", "cheese"],
    ingredients: [
      { name: "elbow pasta", qty: "1", unit: "lb" },
      { name: "cheddar", qty: "8", unit: "oz" },
      { name: "gruyere", qty: "4", unit: "oz" },
    ],
    steps: ["Boil pasta al dente.", "Make a roux, add cheeses.", "Top with breadcrumbs, broil 3 min."],
    daysAgo: 5,
    initialSavedCount: 33,
    initialAvgRating: 4.7,
    initialRatingsCount: 18,
  },
  {
    authorIndex: 5,
    title: "Aloo Paratha",
    description: "Spiced potato-stuffed flatbread, just like Nani used to make.",
    tags: ["breakfast", "indian", "vegetarian"],
    ingredients: [
      { name: "wheat flour", qty: "2", unit: "cup" },
      { name: "potato", qty: "3", unit: "" },
      { name: "ginger", qty: "1", unit: "tbsp" },
    ],
    steps: ["Knead a soft dough.", "Stuff with spiced mashed potato.", "Roll thin and pan-fry with ghee."],
    daysAgo: 6,
    initialSavedCount: 16,
    initialAvgRating: 4.9,
    initialRatingsCount: 7,
  },
  {
    authorIndex: 6,
    title: "Sourdough Country Loaf",
    description: "Open crumb, crackly crust, no commercial yeast.",
    tags: ["bread", "sourdough", "baking"],
    ingredients: [
      { name: "bread flour", qty: "500", unit: "g" },
      { name: "water", qty: "375", unit: "g" },
      { name: "active starter", qty: "100", unit: "g" },
      { name: "salt", qty: "10", unit: "g" },
    ],
    steps: ["Autolyse 30 min.", "Bulk ferment with stretch and folds.", "Shape, cold-proof overnight, bake in dutch oven."],
    daysAgo: 6,
    initialSavedCount: 41,
    initialAvgRating: 4.7,
    initialRatingsCount: 22,
  },
  {
    authorIndex: 7,
    title: "Spicy Sesame Noodles",
    description: "Five minutes, one bowl, all the umami.",
    tags: ["noodles", "spicy", "quick", "asian"],
    ingredients: [
      { name: "ramen noodles", qty: "2", unit: "packs" },
      { name: "soy sauce", qty: "2", unit: "tbsp" },
      { name: "chili crisp", qty: "1", unit: "tbsp" },
      { name: "sesame oil", qty: "1", unit: "tsp" },
    ],
    steps: ["Boil noodles 3 min.", "Toss with sauces while hot.", "Top with scallions."],
    daysAgo: 0,
    initialSavedCount: 9,
    initialAvgRating: 4.3,
    initialRatingsCount: 4,
  },
  {
    authorIndex: 0,
    title: "Cinnamon Roll Sticks",
    description: "All the gooey goodness, in handheld form.",
    tags: ["dessert", "breakfast", "sweet"],
    ingredients: [
      { name: "puff pastry", qty: "1", unit: "sheet" },
      { name: "cinnamon", qty: "1", unit: "tbsp" },
      { name: "brown sugar", qty: "1/3", unit: "cup" },
    ],
    steps: ["Sprinkle pastry with cinnamon-sugar.", "Cut into strips, twist.", "Bake at 400°F for 14 min."],
    daysAgo: 10,
    initialSavedCount: 24,
    initialAvgRating: 4.5,
    initialRatingsCount: 12,
  },
  {
    authorIndex: 2,
    title: "Charred Salsa Verde",
    description: "Bright, smoky, and ready in 15 minutes under the broiler.",
    tags: ["sauce", "mexican", "salsa"],
    ingredients: [
      { name: "tomatillos", qty: "1", unit: "lb" },
      { name: "jalapeño", qty: "2", unit: "" },
      { name: "lime", qty: "1", unit: "" },
    ],
    steps: ["Broil tomatillos and jalapeños.", "Blend with cilantro and lime.", "Season with salt."],
    daysAgo: 12,
    initialSavedCount: 14,
    initialAvgRating: 4.6,
    initialRatingsCount: 8,
  },
  {
    authorIndex: 3,
    title: "Crispy Tofu Bowls",
    description: "Cornstarch is the secret to that shatter-crisp tofu.",
    tags: ["vegan", "bowls", "tofu"],
    ingredients: [
      { name: "extra-firm tofu", qty: "14", unit: "oz" },
      { name: "cornstarch", qty: "3", unit: "tbsp" },
      { name: "soy sauce", qty: "2", unit: "tbsp" },
    ],
    steps: ["Press tofu, cube, and toss with cornstarch.", "Pan-fry until golden.", "Glaze with soy-honey sauce."],
    daysAgo: 0,
    initialSavedCount: 6,
    initialAvgRating: 4.2,
    initialRatingsCount: 3,
  },
  {
    authorIndex: 4,
    title: "Late-Night Grilled Cheese",
    description: "Mayo on the outside, sharp cheddar inside, dill pickle alongside.",
    tags: ["sandwich", "comfort", "snack"],
    ingredients: [
      { name: "sourdough", qty: "2", unit: "slices" },
      { name: "cheddar", qty: "2", unit: "slices" },
      { name: "mayo", qty: "1", unit: "tbsp" },
    ],
    steps: ["Spread mayo on the outside of each bread slice.", "Stack with cheese.", "Pan-fry until golden on both sides."],
    daysAgo: 14,
    initialSavedCount: 11,
    initialAvgRating: 4.4,
    initialRatingsCount: 6,
  },
];

const seedComments: { recipeIndex: number; authorIndex: number; body: string }[] = [
  { recipeIndex: 0, authorIndex: 1, body: "Made this for a dinner party — gone in five minutes!" },
  { recipeIndex: 0, authorIndex: 3, body: "Could you sub in lime?" },
  { recipeIndex: 1, authorIndex: 2, body: "Adding olives next time. So good." },
  { recipeIndex: 1, authorIndex: 5, body: "My family's new favorite weeknight dinner." },
  { recipeIndex: 2, authorIndex: 6, body: "The cocoa is wild — and works." },
  { recipeIndex: 3, authorIndex: 0, body: "Nailed it. The bloom step matters." },
  { recipeIndex: 4, authorIndex: 7, body: "Crispy top is mandatory and I will fight you on it." },
  { recipeIndex: 5, authorIndex: 0, body: "These were perfect with chai!" },
  { recipeIndex: 6, authorIndex: 4, body: "Best loaf I've baked yet." },
  { recipeIndex: 7, authorIndex: 1, body: "Five minutes ✨" },
];

async function main() {
  console.log("🌱 RecipeNest seed starting...\n");
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Recipe.deleteMany({}),
    Comment.deleteMany({}),
    Save.deleteMany({}),
    Rating.deleteMany({}),
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
      });
    }),
  );
  console.log(`👥 Created ${userDocs.length} users`);

  const now = Date.now();
  const recipeDocs = await Promise.all(
    seedRecipes.map(async (r, i) => {
      const author = userDocs[r.authorIndex]!;
      const createdAt = new Date(now - r.daysAgo * 86400000);
      return Recipe.create({
        title: r.title,
        slug: `${slugify(r.title)}-${i}`,
        description: r.description,
        ingredients: r.ingredients,
        steps: r.steps.map((text, idx) => ({ order: idx, text })),
        tags: r.tags,
        coverImageUrl: "",
        authorId: author._id,
        savedCount: r.initialSavedCount,
        avgRating: r.initialAvgRating,
        ratingsCount: r.initialRatingsCount,
        createdAt,
        updatedAt: createdAt,
      });
    }),
  );
  console.log(`🍳 Created ${recipeDocs.length} recipes`);

  for (const c of seedComments) {
    const recipe = recipeDocs[c.recipeIndex]!;
    const author = userDocs[c.authorIndex]!;
    await Comment.create({ recipeId: recipe._id, authorId: author._id, body: c.body });
  }
  console.log(`💬 Created ${seedComments.length} comments`);

  // A handful of saves so the trending pipeline has something to work with
  // once L3 is fixed. Note: we deliberately let the count drift slightly
  // from the per-recipe `savedCount` field — in production this is part of
  // the L5-T1 reproduction case (counter drift).
  const initialSaves: { userIndex: number; recipeIndex: number }[] = [
    { userIndex: 0, recipeIndex: 4 },
    { userIndex: 1, recipeIndex: 4 },
    { userIndex: 2, recipeIndex: 4 },
    { userIndex: 3, recipeIndex: 6 },
    { userIndex: 4, recipeIndex: 6 },
    { userIndex: 5, recipeIndex: 1 },
    { userIndex: 6, recipeIndex: 1 },
    { userIndex: 7, recipeIndex: 2 },
    { userIndex: 0, recipeIndex: 3 },
    { userIndex: 1, recipeIndex: 7 },
  ];
  for (const s of initialSaves) {
    await Save.create({
      userId: userDocs[s.userIndex]!._id,
      recipeId: recipeDocs[s.recipeIndex]!._id,
    });
  }
  console.log(`🔖 Created ${initialSaves.length} saves`);

  console.log("\n✅ RecipeNest seed complete.");
  console.log(`   Login as any seeded user (password: password123)`);
  console.log(`   e.g. username: chefa  password: password123`);
  await disconnectDB();
}

main().catch(async (err) => {
  console.error("❌ Seed failed:", err);
  await disconnectDB();
  process.exit(1);
});
