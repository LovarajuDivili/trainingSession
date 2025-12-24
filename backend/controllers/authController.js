const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const logActivity = require("../utils/logActivity"); 

const jwtSecret = process.env.JWT_SECRET || "devSecret";

async function registerUser(req, res) {
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

    await logActivity(newUser._id, "register", "Success");

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUser(req, res) {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });

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
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutUser(req, res) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Invalid token" });

    await logActivity(user.userId, "logout", "Success");

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const resetCode = crypto.randomInt(100000, 999999).toString();
    user.resetCode = resetCode;

    await user.save();

    const html = `<p>Your password reset code is <b>${resetCode}</b>.</p>`;
    await sendMail(email, "Password Reset Code", html);

    await logActivity(user._id, "forgot_password", "Success");

    res.json({ message: "Reset code sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function resetPassword(req, res) {
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

    await logActivity(user._id, "reset_password", "Success");

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
