import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = new User({ email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
