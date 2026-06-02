import mongoose, { Schema, type InferSchemaType } from "mongoose";

const CommentSchema = new Schema(
  {
    workoutId: { type: Schema.Types.ObjectId, ref: "Workout", required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true },
);

export type CommentDoc = InferSchemaType<typeof CommentSchema> & { _id: mongoose.Types.ObjectId };

export const Comment = mongoose.models.Comment ?? mongoose.model("Comment", CommentSchema);
