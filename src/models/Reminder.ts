import mongoose, { Schema, Document } from "mongoose";

export interface IReminder extends Document {
  title: string;
  amount: number;          // Total amount due
  amountPaid: number;      // ✅ Just a number, not {type: Number}
  dueDate: Date;
  isPaid: boolean;         // ✅ Just a boolean
  userId: mongoose.Types.ObjectId;
}

const reminderSchema = new Schema<IReminder>({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },    // ✅ Schema options stay here
  dueDate: { type: Date, required: true },
  isPaid: { type: Boolean, default: false },   // ✅ Schema options stay here
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IReminder>("Reminder", reminderSchema);


