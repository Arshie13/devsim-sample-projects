import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SaveSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true, index: true },
    savedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false },
);

// L5-T1 BUG (intentional): no compound unique index on { userId, recipeId }.
// As a result, the same user can create multiple Save documents for the same recipe.
// Fix in Level 5 task 1 by adding:
//   SaveSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export type SaveDoc = InferSchemaType<typeof SaveSchema> & { _id: mongoose.Types.ObjectId };

export const Save = mongoose.models.Save ?? mongoose.model("Save", SaveSchema);
