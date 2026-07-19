const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
const { normalizeUserPayload, validate } = require("../utils/validation");
const { isProduction } = require("../config/env");
const authRouter = express.Router();

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
  };
}

authRouter.post("/signup", async (req, res) => {
  try {
    const normalizedPayload = normalizeUserPayload(req.body);
    const { emailId, password } = normalizedPayload;

    validate(normalizedPayload);
    await User.validate(normalizedPayload);

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...normalizedPayload,
      password: passHash,
      _id: new mongoose.Types.ObjectId(),
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await user.getJwt();

    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
      ...getCookieOptions(),
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message || err,
    });
  }
});

module.exports = authRouter;
