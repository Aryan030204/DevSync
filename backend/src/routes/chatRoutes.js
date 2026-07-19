const express = require("express");
const mongoose = require("mongoose");
const authVerification = require("../middlewares/auth");
const Chat = require("../models/Chat");
const ConnectionReq = require("../models/ConnectionRequests");

const chatRouter = express.Router();

function getParticipantIds(userId, targetId) {
  return [userId.toString(), targetId.toString()].sort();
}

chatRouter.get("/chat/:targetId", authVerification, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { targetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target user",
      });
    }

    const connection = await ConnectionReq.findOne({
      status: "accepted",
      $or: [
        { fromUserId: loggedInUserId, toUserId: targetId },
        { fromUserId: targetId, toUserId: loggedInUserId },
      ],
    });

    if (!connection) {
      return res.status(403).json({
        success: false,
        message: "You can only chat with accepted connections",
      });
    }

    const participants = getParticipantIds(loggedInUserId, targetId);
    const chat = await Chat.findOne({ participants }).populate(
      "messages.senderId",
      ["firstName", "lastName", "photoUrl"]
    );

    res.status(200).json({
      success: true,
      data: chat ? chat.messages : [],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || err,
    });
  }
});

module.exports = chatRouter;
