import mongoose, { Schema, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    role: { type: String, enum: ["member", "coach"], default: "member" },
    timezone: { type: String, default: "UTC" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const User = mongoose.models.User ?? mongoose.model("User", UserSchema);
