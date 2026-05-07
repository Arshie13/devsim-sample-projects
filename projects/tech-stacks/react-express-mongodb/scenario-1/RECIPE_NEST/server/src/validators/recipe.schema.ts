import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1).max(80),
  qty: z.string().min(1).max(20),
  unit: z.string().max(20).default(""),
});

export const stepSchema = z.object({
  order: z.number().int().nonnegative(),
  text: z.string().min(1).max(1000),
});

export const createRecipeSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(2000).default(""),
  ingredients: z.array(ingredientSchema).min(1),
  steps: z.array(stepSchema).min(1),
  tags: z.array(z.string().min(1).max(30)).max(10).default([]),
  coverImageUrl: z.string().url().or(z.literal("")).default(""),
});

export const recipeIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid recipe id"),
});

// L3-T2 BUG (intentional): trendingQuerySchema is missing.
// Students should add a Zod schema validating an optional `limit` query parameter
// (1..50, default 10) and wire it into the /trending route via validateRequest.
//
// Example fix:
//
// export const trendingQuerySchema = z.object({
//   limit: z.coerce.number().int().min(1).max(50).default(10),
// });
