const express = require("express");
const SignUpRouter = express.Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

SignUpRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user._id,
      },
    };
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    // Set JWT cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

module.exports = SignUpRouter;
