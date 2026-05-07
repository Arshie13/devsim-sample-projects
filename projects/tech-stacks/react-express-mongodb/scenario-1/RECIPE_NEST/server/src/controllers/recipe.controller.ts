import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Recipe } from "../models/Recipe.js";
import { Save } from "../models/Save.js";
import { User } from "../models/User.js";
import { HttpError } from "../middleware/errorHandler.js";
import { slugify } from "../utils/slug.js";

// COMPLETE — list all recipes (newest first)
export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .populate("authorId", "username name avatarUrl")
      .lean();

    const data = recipes.map((r: any) => ({
      ...r,
      author: r.authorId,
      authorId: r.authorId?._id ?? r.authorId,
    }));

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// COMPLETE — get a single recipe by id
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid recipe id");

    const recipe = await Recipe.findById(id)
      .populate("authorId", "username name avatarUrl")
      .lean();
    if (!recipe) throw new HttpError(404, "Recipe not found");

    res.status(200).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
}

// COMPLETE — create a recipe (authenticated)
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Authentication required");

    const { title, description, ingredients, steps, tags, coverImageUrl } = req.body;
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const recipe = await Recipe.create({
      title,
      slug,
      description,
      ingredients,
      steps,
      tags,
      coverImageUrl,
      authorId: req.user.userId,
    });

    res.status(201).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
}

// L3-T1 BUG (intentional):
//   - $lookup runs before $match, so the date filter happens on documents
//     that have already been hydrated with a (potentially huge) saves array.
//   - There is no $addFields stage to compute savedCount from the looked-up array,
//     so $sort: { savedCount: -1 } sorts on a path that doesn't exist on most docs.
//   - There is no $limit stage, so this can return the entire collection.
//   - The looked-up `saves` array is also never $project-ed away.
//
// L3-T2 BUG (intentional, in the same function):
//   - The function is not strongly typed (no NextFunction, no try/catch wiring).
//   - Calls res.send(...) with no explicit status code and no { success, data } envelope.
//   - Does not validate any query parameters (no `limit` support).
//
// Students must rewrite this function in Level 3.
export async function getTrending(req: any, res: any) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const trending = await Recipe.aggregate([
    {
      $lookup: {
        from: "saves",
        localField: "_id",
        foreignField: "recipeId",
        as: "saves",
      },
    },
    { $match: { createdAt: { $gt: oneWeekAgo } } },
    { $sort: { savedCount: -1 } },
  ]);
  res.send(trending);
}

// L4-T1 BUG (intentional): not implemented yet.
// Students must implement an authenticated upsert-style save endpoint that:
//   - creates a Save document for (userId, recipeId) if one does not exist
//   - returns 201 on first save, 200 on idempotent re-save
//   - increments recipe.savedCount by exactly 1 on first save only
//   - returns { success: true, data: { saved: true, savedCount } }
export async function save(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(501, "save: not implemented yet (Level 4 task 1)"));
}

// L4-T2 BUG (intentional): not implemented yet.
// Students must implement an authenticated GET that returns the current
// user's saved recipes, sorted by savedAt descending, populated with author info.
export async function getSaved(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(501, "getSaved: not implemented yet (Level 4 task 2)"));
}

// L4-T2 BUG (intentional): not implemented yet.
// Students must implement an authenticated DELETE that removes the Save document
// for (userId, recipeId) and decrements recipe.savedCount, clamped at 0.
export async function unsave(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(501, "unsave: not implemented yet (Level 4 task 2)"));
}

// Helper used by Profile page — kept simple and complete.
export async function listByAuthor(req: Request, res: Response, next: NextFunction) {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) throw new HttpError(404, "User not found");

    const recipes = await Recipe.find({ authorId: user._id }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: recipes });
  } catch (err) {
    next(err);
  }
}
