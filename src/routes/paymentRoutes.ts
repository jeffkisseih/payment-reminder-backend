import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { makePayment, getPaymentSummary, getPayments } from "../controllers/paymentController";

const router = express.Router();

// 🔹 Get all payments for the logged-in user
router.get("/", authMiddleware, getPayments);

// 🔹 Get payment summary (today, week, month, totals)
router.get("/summary", authMiddleware, getPaymentSummary);

// 🔹 Record a new payment
router.post("/", authMiddleware, makePayment);

export default router;

