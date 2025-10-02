import express from "express";
import Reminder from "../models/Reminder";
import authMiddleware from "../middleware/authMiddleware";


const router = express.Router();


// Get reminders
router.get("/", authMiddleware, async (req: any, res) => {
const reminders = await Reminder.find({ userId: req.user.id });
res.json(reminders);
});


// Add reminder
router.post("/", authMiddleware, async (req: any, res) => {
const { title, amount, dueDate } = req.body;
const reminder = new Reminder({ title, amount, dueDate, userId: req.user.id });
await reminder.save();
res.status(201).json(reminder);
});


export default router;
