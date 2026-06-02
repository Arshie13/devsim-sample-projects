import mongoose, { Schema, Document, Types } from "mongoose";

export type StopCategory = "lodging" | "food" | "activity" | "transport" | "other";

export interface IStop extends Document {
  tripId: Types.ObjectId;
  title: string;
  category: StopCategory;
  location: string;
  notes: string;
  dayDate: Date;
  order: number;
  voteCount: number;
  suggestedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StopSchema = new Schema<IStop>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["lodging", "food", "activity", "transport", "other"],
      default: "activity",
    },
    location: { type: String, default: "" },
    notes: { type: String, default: "" },
    dayDate: { type: Date, required: true, index: true },
    order: { type: Number, default: 0 },
    voteCount: { type: Number, default: 0 },
    suggestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

StopSchema.index({ tripId: 1, dayDate: 1, order: 1 });

export const Stop = mongoose.model<IStop>("Stop", StopSchema);
