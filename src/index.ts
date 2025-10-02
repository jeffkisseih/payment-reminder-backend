import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import reminderRoutes from "./routes/reminderRoutes";
import authRoutes from "./routes/authRoutes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173", // Vite local dev
  "http://localhost:3000", // Next.js local dev
  "https://payment-reminder-frontend.vercel.app", // ✅ Replace with Vercel frontend URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// API Routes
app.use("/api/reminders", reminderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// Health check route (optional but helpful)
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running 🚀" });
});

// Start server
const PORT = process.env.PORT || 8080;
connectDB();
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

