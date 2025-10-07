import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { signupUser, loginUser } from "../controllers/authController";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as any).code === 11000 // MongoDB duplicate key error
    ) {
      res.status(400).json({ error: "User already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("🟢 Login request body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.error("❌ Missing email or password in request body");
      return res.status(400).json({ error: "Missing credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error("❌ User not found for email:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("❌ Password mismatch for:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const jwtSecret = process.env.JWT_SECRET || "dev_secret_key";
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1d" });

    console.log("✅ Login successful for:", email);
    res.status(200).json({ token });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
