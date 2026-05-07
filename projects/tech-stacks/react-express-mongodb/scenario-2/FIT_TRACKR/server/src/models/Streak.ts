import mongoose, { Schema, type InferSchemaType } from "mongoose";

const StreakSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastWorkoutDate: { type: String, default: null },
  },
  { timestamps: true },
);

export type StreakDoc = InferSchemaType<typeof StreakSchema> & { _id: mongoose.Types.ObjectId };

export const Streak = mongoose.models.Streak ?? mongoose.model("Streak", StreakSchema);
