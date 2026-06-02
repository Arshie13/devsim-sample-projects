import mongoose, { Schema, type InferSchemaType } from "mongoose";

const IngredientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    qty: { type: String, required: true, trim: true },
    unit: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const StepSchema = new Schema(
  {
    order: { type: Number, required: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const RecipeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    description: { type: String, default: "" },
    ingredients: { type: [IngredientSchema], default: [] },
    steps: { type: [StepSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    coverImageUrl: { type: String, default: "" },
    viewCount: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type RecipeDoc = InferSchemaType<typeof RecipeSchema> & { _id: mongoose.Types.ObjectId };

export const Recipe = mongoose.models.Recipe ?? mongoose.model("Recipe", RecipeSchema);
