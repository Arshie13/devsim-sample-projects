import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ExerciseSchema = new Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, default: 1 },
    reps: { type: Number, default: 0 },
    weightKg: { type: Number, default: 0 },
    durationSec: { type: Number, default: 0 },
  },
  { _id: false },
);

const WorkoutSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: {
      type: String,
      enum: ["strength", "cardio", "mobility", "hiit"],
      required: true,
    },
    exercises: { type: [ExerciseSchema], default: [] },
    notes: { type: String, default: "" },
    tags: { type: [String], default: [], index: true },
    performedAt: { type: Date, required: true, index: true },
    durationMin: { type: Number, default: 0 },
    cheerCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type WorkoutDoc = InferSchemaType<typeof WorkoutSchema> & { _id: mongoose.Types.ObjectId };

export const Workout = mongoose.models.Workout ?? mongoose.model("Workout", WorkoutSchema);
