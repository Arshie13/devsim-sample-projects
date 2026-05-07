import mongoose, { Schema, type InferSchemaType } from "mongoose";

const RatingSchema = new Schema(
  {
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true },
);

RatingSchema.index({ recipeId: 1, userId: 1 }, { unique: true });

export type RatingDoc = InferSchemaType<typeof RatingSchema> & { _id: mongoose.Types.ObjectId };

export const Rating = mongoose.models.Rating ?? mongoose.model("Rating", RatingSchema);
