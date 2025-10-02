import { Request, Response } from "express";
import  Reminder  from "../models/Reminder.js";

export const createReminder = async (req: Request, res: Response) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(400).json({ error: errorMessage });
  }
};

// reminderController.ts
export const getReminders = async (req: any, res: Response) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id });

    const updated = reminders.map((r) => {
      // ✅ Explicitly cast values to numbers for TypeScript
      const amountPaid = Number(r.amountPaid);
      const amount = Number(r.amount);

      const isPaid: boolean = amountPaid >= amount;
      return { ...r.toObject(), isPaid };
    });

    res.json(updated);
  } catch (err) {
    console.error("Error fetching reminders:", err);
    res.status(500).json({ error: "Server error" });
  }
}


