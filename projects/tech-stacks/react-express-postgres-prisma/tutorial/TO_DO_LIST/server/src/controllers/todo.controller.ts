import type { Request, Response } from "express";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import type { ApiResponse } from "../types/api.js";
import { prisma } from "../utils/prisma.js";

export const getTodos = asyncHandler(async (_req: Request, res: Response) => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });

  const response: ApiResponse = {
    success: true,
    data: todos,
  };

  res.json(response);
});

export const createTodo = asyncHandler(async (req: Request, res: Response) => {
  const title = String(req.body?.title ?? "").trim();

  if (!title) {
    throw new AppError("Title is required.", 400);
  }

  if (title.length > 200) {
    throw new AppError("Title must be 200 characters or less.", 400);
  }

  const todo = await prisma.todo.create({
    data: { title },
  });

  const response: ApiResponse = {
    success: true,
    data: todo,
    message: "Todo created.",
  };

  res.status(201).json(response);
});

export const toggleTodo = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid todo id.", 400);
  }

  const existingTodo = await prisma.todo.findUnique({ where: { id } });

  if (!existingTodo) {
    throw new AppError("Todo not found.", 404);
  }

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { completed: !existingTodo.completed },
  });

  const response: ApiResponse = {
    success: true,
    data: updatedTodo,
    message: "Todo updated.",
  };

  res.json(response);
});

export const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new AppError("Invalid todo id.", 400);
  }

  const existingTodo = await prisma.todo.findUnique({ where: { id } });

  if (!existingTodo) {
    throw new AppError("Todo not found.", 404);
  }

  await prisma.todo.delete({ where: { id } });

  const response: ApiResponse = {
    success: true,
    message: "Todo deleted.",
  };

  res.json(response);
});
