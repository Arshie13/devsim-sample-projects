import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SaveSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true, index: true },
    savedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false },
);

export type SaveDoc = InferSchemaType<typeof SaveSchema> & { _id: mongoose.Types.ObjectId };

export const Save = mongoose.models.Save ?? mongoose.model("Save", SaveSchema);
