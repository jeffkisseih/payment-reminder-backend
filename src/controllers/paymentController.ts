import { Request, Response } from "express";
import mongoose from "mongoose";
import Reminder from "../models/Reminder";
import Payment from "../models/Payment";

export const makePayment = async (req: any, res: Response) => {
  try {
    const { reminderId, amount } = req.body;

    // ✅ Validate input
    if (!reminderId || !amount) {
      return res.status(400).json({ error: "Reminder ID and amount are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(reminderId)) {
      return res.status(400).json({ error: "Invalid reminder ID format" });
    }

    const paymentAmount = Number(amount);
    if (paymentAmount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    // ✅ Find reminder
    const reminder = await Reminder.findOne({ _id: reminderId, userId: req.user.id });
    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    // ✅ Create payment record
    const payment = new Payment({
      reminderId,
      userId: req.user.id,
      amount: paymentAmount,
      date: new Date(),
    });
    await payment.save();

    // ✅ Update reminder progress
    reminder.amountPaid = (reminder.amountPaid || 0) + paymentAmount;

    // If fully paid, mark as paid
    if (reminder.amountPaid >= reminder.amount) {
      reminder.isPaid = true;
    }

    await reminder.save();

    return res.status(201).json({
      message: reminder.isPaid
        ? "✅ Payment successful — reminder fully paid!"
        : `💳 Payment successful — Remaining: $${reminder.amount - reminder.amountPaid}`,
      payment,
      reminder,
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPaymentSummary = async (req: any, res: Response) => {
  const userId = req.user.id;

  const payments = await Payment.find({ userId });
  const reminders = await Reminder.find({ userId });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const paymentsCount = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  const remindersToday = reminders.filter(r => new Date(r.dueDate) >= startOfDay).length;
  const remindersThisWeek = reminders.filter(r => new Date(r.dueDate) >= startOfWeek).length;
  const remindersThisMonth = reminders.filter(r => new Date(r.dueDate) >= startOfMonth).length;

  res.json({ paymentsCount, remindersToday, remindersThisWeek, remindersThisMonth, totalAmount });
};


export const getPayments = async (req: any, res: Response) => {
  try {
    const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    res.status(500).json({ message: "Server error fetching payments" });
  }
};


