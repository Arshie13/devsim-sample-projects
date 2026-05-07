import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  bio: string;
  homeCity: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    homeCity: { type: String, default: "" },
    timezone: { type: String, default: "UTC" },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
