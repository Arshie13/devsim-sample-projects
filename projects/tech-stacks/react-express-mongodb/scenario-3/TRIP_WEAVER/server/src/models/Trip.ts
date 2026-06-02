import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITrip extends Document {
  title: string;
  slug: string;
  ownerId: Types.ObjectId;
  collaboratorIds: Types.ObjectId[];
  destination: string;
  destinationTimezone: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  coverUrl: string;
  notes: string;
  stopCount: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    collaboratorIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    destination: { type: String, required: true, trim: true },
    destinationTimezone: { type: String, default: "UTC" },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },
    coverUrl: { type: String, default: "" },
    notes: { type: String, default: "" },
    stopCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TripSchema.index({ slug: 1 }, { unique: true });
TripSchema.index({ ownerId: 1 });
TripSchema.index({ collaboratorIds: 1 });

export const Trip = mongoose.model<ITrip>("Trip", TripSchema);
