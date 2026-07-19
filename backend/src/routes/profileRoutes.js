const express = require("express");
const profileRouter = express.Router();
const authMiddleware = require("../middlewares/auth");
const User = require("../models/User");
const {
  normalizeUserPayload,
  validateProfileData,
} = require("../utils/validation");

profileRouter.get("/profile", authMiddleware, (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      message: "profile fetched successfully",
      user: user,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "something went wrong",
      Error: err || err.message,
    });
  }
});

profileRouter.patch("/profile/edit", authMiddleware, async (req, res) => {
  try {
    if (!validateProfileData(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    const updates = normalizeUserPayload(req.body);
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: "something went wrong",
      Error: err || err.message,
    });
  }
});

module.exports = profileRouter;
