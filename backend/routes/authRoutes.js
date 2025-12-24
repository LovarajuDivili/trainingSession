const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const auth = require("../middleware/auth");
const logActivity = require("../utils/logActivity");

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "devSecret";

router.post("/register", async (req, res) => {
  const { name, email, password, image } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      await logActivity(null, "login", "Failed", { email });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await logActivity(user._id, "login", "Failed");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await logActivity(user._id, "login", "Success");

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email, 
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    await logActivity(req.user.userId, "logout", "Success");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    await logActivity(req.user.userId, "logout", "Failed");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    await user.save();

    await sendMail(
      email,
      "Password Reset Code",
      `<p>Your password reset code is <b>${resetCode}</b></p>`
    );

    res.json({ message: "Reset code sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, resetCode });
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid reset code or email" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
