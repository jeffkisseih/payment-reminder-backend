import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    reminderId: { type: mongoose.Schema.Types.ObjectId, ref: "Reminder", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
