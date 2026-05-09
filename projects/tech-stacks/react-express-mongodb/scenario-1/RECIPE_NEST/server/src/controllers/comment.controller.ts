import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Recipe } from "../models/Recipe.js";
import { Comment } from "../models/Comment.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function listComments(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid recipe id");

    const comments = await Comment.find({ recipeId: id })
      .sort({ createdAt: -1 })
      .populate("authorId", "username name avatarUrl")
      .lean();

    res.status(200).json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
}

export async function postComment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError(401, "Authentication required");
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid recipe id");

    const recipe = await Recipe.findById(id);
    if (!recipe) throw new HttpError(404, "Recipe not found");

    const comment = await Comment.create({
      recipeId: id,
      authorId: req.user.userId,
      body: req.body.body,
    });

    recipe.commentCount = (recipe.commentCount ?? 0) + 1;
    await recipe.save();

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
}
