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

// ✅ Allowed Origins (Update these to match your frontend URLs)
const allowedOrigins = [
  "http://localhost:5173", // Vite local dev
  "http://localhost:3000", // Next.js local dev
  "https://payment-reminder-frontend.vercel.app",
  "https://payment-reminder-frontend-git-main-jeffkisseihs-projects.vercel.app",
  "https://payment-reminder-frontend-l800pj1ck-jeffkisseihs-projects.vercel.app",
  // Deployed frontend

];

// ✅ Dynamic CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("🚫 Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ API Routes
app.use("/api/reminders", reminderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Backend API is running smoothly." });
});

// ✅ MongoDB + Server Startup
async function startServer() {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 8080;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // ✅ Graceful shutdown for Railway / Vercel
    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        mongoose.connection.close();
        console.log("💤 MongoDB connection closed");
        process.exit(0);
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Failed to start server:", error.message);
    } else {
      console.error("❌ Unknown error while starting server:", error);
    }

    // Retry after 5 seconds
    console.log("⏳ Retrying MongoDB connection in 5s...");
    setTimeout(startServer, 5000);
  }
}

startServer();

// ✅ Global error handlers (catch unhandled issues)
process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});
