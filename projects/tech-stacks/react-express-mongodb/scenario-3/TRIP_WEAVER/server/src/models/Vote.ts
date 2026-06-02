import mongoose, { Schema, Document, Types } from "mongoose";

export interface IVote extends Document {
  stopId: Types.ObjectId;
  userId: Types.ObjectId;
  votedAt: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    stopId: { type: Schema.Types.ObjectId, ref: "Stop", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    votedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
);

// L5-T1 BUG (intentional): no compound unique index on { userId, stopId }.
// Without this index, concurrent POST /vote requests from the same user can
// both pass the findOne check and both insert — creating duplicate Vote docs
// and inflating voteCount.
//
// Fix: add the following line below and run Vote.syncIndexes():
//   VoteSchema.index({ userId: 1, stopId: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>("Vote", VoteSchema);
