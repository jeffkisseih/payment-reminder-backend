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

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://payment-reminder-frontend.vercel.app",
  "https://payment-reminder-frontend-git-main-jeffkisseihs-projects.vercel.app",
  "https://payment-reminder-frontend-l800pj1ck-jeffkisseihs-projects.vercel.app",
];

// ✅ Dynamic CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else {
        console.warn("🚫 Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/reminders", reminderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// ✅ Debug & health-check routes
app.get("/", (_, res) => res.status(200).json({ message: "✅ Backend API is running smoothly." }));

app.get("/api/test", async (_, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const jwtSecret = process.env.JWT_SECRET ? "✅ Present" : "❌ Missing";
    res.json({
      status: "ok",
      dbState,
      jwtSecret,
    });
  } catch (err) {
    res.status(500).json({ error: "Test route failed", details: err });
  }
});

// ✅ MongoDB connection + startup
async function startServer() {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 8080;
    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );

    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received. Shutting down...");
      server.close(() => {
        mongoose.connection.close();
        console.log("💤 MongoDB closed.");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    console.log("⏳ Retrying in 5s...");
    setTimeout(startServer, 5000);
  }
}

startServer();

// ✅ Global error handlers
process.on("unhandledRejection", (reason) => {
  console.error("🚨 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});
