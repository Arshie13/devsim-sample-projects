import mongoose, { Schema, Document, Types } from "mongoose";

export interface IExpense extends Document {
  tripId: Types.ObjectId;
  paidById: Types.ObjectId;
  amount: number;
  currency: string;
  description: string;
  splitBetween: Types.ObjectId[];
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
    paidById: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    description: { type: String, default: "" },
    splitBetween: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    paidAt: { type: Date, default: () => new Date(), index: true },
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
