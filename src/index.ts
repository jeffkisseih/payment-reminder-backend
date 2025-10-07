import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173", // Vite local dev
  "http://localhost:3000", // Next.js local dev
  "https://payment-reminder-frontend.vercel.app", // Deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ API Routes
app.use("/api/reminders", reminderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Backend API is running" });
});

// ✅ MongoDB Connection
async function startServer() {
  try {
    await connectDB(); // Your connectDB() handles URI + connection
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 8080;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // ✅ Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        mongoose.connection.close(false);
        console.log("💤 MongoDB connection closed");
        process.exit(0);
      });
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Failed to start server:", error.message);
    } else {
      console.error("❌ Failed to start server:", error);
    }
    setTimeout(startServer, 5000); // retry every 5s
  }
}

startServer();

// ✅ Global error handler to catch unhandled exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
