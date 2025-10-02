import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db";
import reminderRoutes from "./routes/reminderRoutes";
import authRoutes from "./routes/authRoutes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000"
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

// 👉 Serve frontend build in production
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 8080;
connectDB();
app.listen(PORT, () => console.log(`🚀 Backend + Frontend running on port ${PORT}`));
