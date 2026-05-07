import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CheerSchema = new Schema(
  {
    workoutId: { type: Schema.Types.ObjectId, ref: "Workout", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    cheeredAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false },
);

// L5-T1 BUG (intentional): no compound unique index on { userId, workoutId }.
// As a result, the same user can create multiple Cheer documents for the same workout.
// This causes cheerCount to inflate beyond the real number of distinct users who cheered.
// Fix in Level 5 task 1 by adding:
//   CheerSchema.index({ userId: 1, workoutId: 1 }, { unique: true });

export type CheerDoc = InferSchemaType<typeof CheerSchema> & { _id: mongoose.Types.ObjectId };

export const Cheer = mongoose.models.Cheer ?? mongoose.model("Cheer", CheerSchema);
