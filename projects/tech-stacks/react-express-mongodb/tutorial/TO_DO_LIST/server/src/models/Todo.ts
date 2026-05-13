import mongoose, { Schema, type InferSchemaType } from "mongoose";

const TodoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type TodoDoc = InferSchemaType<typeof TodoSchema> & { _id: mongoose.Types.ObjectId };

export const Todo = mongoose.models.Todo ?? mongoose.model("Todo", TodoSchema);
