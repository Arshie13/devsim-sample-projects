import type { Recipe } from "../types/recipe";

export const mockRecipes: Recipe[] = [
  {
    _id: "rec_lemon_tart",
    slug: "lemon-tart",
    title: "Lemon Tart",
    description: "Bright, zesty, and perfectly tart.",
    ingredients: [
      { name: "lemon juice", qty: "1/2", unit: "cup" },
      { name: "sugar", qty: "3/4", unit: "cup" },
    ],
    steps: [
      { order: 0, text: "Whisk eggs and sugar." },
      { order: 1, text: "Add lemon juice." },
    ],
    tags: ["dessert", "lemon"],
    coverImageUrl: "/recipe-nest-logo.svg",
    authorId: "u_chefa",
    author: { _id: "u_chefa", username: "chefa", name: "Chef Alex", avatarUrl: "" },
    viewCount: 0,
    savedCount: 12,
    avgRating: 4.6,
    ratingsCount: 8,
    commentCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
