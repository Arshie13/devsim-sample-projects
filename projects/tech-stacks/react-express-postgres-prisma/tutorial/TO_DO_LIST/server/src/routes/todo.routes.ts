import { Router } from "express";
import { createTodo, deleteTodo, getTodos, toggleTodo } from "../controllers/todo.controller.js";

const router = Router();

router.get("/", getTodos);
router.post("/", createTodo);
router.patch("/:id/toggle", toggleTodo);
router.delete("/:id", deleteTodo);

export default router;
