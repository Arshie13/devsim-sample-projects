import type { Request, Response } from "express";
import mongoose from "mongoose";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import { Todo } from "../models/Todo.js";
import type { ApiResponse } from "../types/api.js";

function toClient(doc: any) {
  const { _id, title, completed, createdAt, updatedAt } = doc;
  return { id: String(_id), title, completed, createdAt, updatedAt };
}

export const getTodos = asyncHandler(async (_req: Request, res: Response) => {
  const todos = await Todo.find().sort({ createdAt: -1 }).lean();

  const response: ApiResponse = { success: true, data: todos.map(toClient) };
  res.json(response);
});

export const createTodo = asyncHandler(async (req: Request, res: Response) => {
  const title = String(req.body?.title ?? "").trim();

  if (!title) throw new AppError("Title is required.", 400);
  if (title.length > 200) throw new AppError("Title must be 200 characters or less.", 400);

  const todo = await Todo.create({ title });

  const response: ApiResponse = {
    success: true,
    data: toClient(todo.toObject()),
    message: "Todo created.",
  };
  res.status(201).json(response);
});

export const toggleTodo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) throw new AppError("Invalid todo id.", 400);

  const existing = await Todo.findById(id);
  if (!existing) throw new AppError("Todo not found.", 404);

  existing.completed = !existing.completed;
  await existing.save();

  const response: ApiResponse = {
    success: true,
    data: toClient(existing.toObject()),
    message: "Todo updated.",
  };
  res.json(response);
});

export const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) throw new AppError("Invalid todo id.", 400);

  const existing = await Todo.findByIdAndDelete(id);
  if (!existing) throw new AppError("Todo not found.", 404);

  const response: ApiResponse = { success: true, message: "Todo deleted." };
  res.json(response);
});
