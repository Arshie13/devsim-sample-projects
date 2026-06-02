import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
  tripId?: Types.ObjectId;
  stopId?: Types.ObjectId;
  authorId: Types.ObjectId;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", index: true },
    stopId: { type: Schema.Types.ObjectId, ref: "Stop", index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    body: { type: String, required: true, maxlength: 5000, trim: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
