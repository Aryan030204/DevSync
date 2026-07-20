const socket = require("socket.io");
const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const ConnectionReq = require("../models/ConnectionRequests");
const User = require("../models/User");
const { allowedOrigins, isAllowedOrigin } = require("../config/env");

function getRoomId(userId, targetId) {
  return [userId.toString(), targetId.toString()].sort().join("_");
}

async function canUsersChat(userId, targetId) {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(targetId)
  ) {
    return false;
  }

  const [user, targetUser, connection] = await Promise.all([
    User.findById(userId).select("_id"),
    User.findById(targetId).select("_id"),
    ConnectionReq.findOne({
      status: "accepted",
      $or: [
        { fromUserId: userId, toUserId: targetId },
        { fromUserId: targetId, toUserId: userId },
      ],
    }).select("_id"),
  ]);

  return Boolean(user && targetUser && connection);
}

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          return callback(null, true);
        }

        console.error(
          "Blocked Socket.IO origin:",
          origin,
          "Allowed origins:",
          allowedOrigins
        );
        return callback(new Error("Origin not allowed by Socket.IO CORS"));
      },
      credentials: true,
    },
  });

  io.on("connection", (client) => {
    client.on("joinChat", async ({ userId, targetId }) => {
      try {
        const allowed = await canUsersChat(userId, targetId);
        if (!allowed) {
          client.emit("chatError", "Chat is not available for this user");
          return;
        }

        client.join(getRoomId(userId, targetId));
      } catch (error) {
        client.emit("chatError", error.message || "Unable to join chat");
      }
    });

    client.on("sendMessage", async ({ userId, targetId, text }) => {
      try {
        const trimmedText = typeof text === "string" ? text.trim() : "";
        if (!trimmedText) {
          return;
        }

        const allowed = await canUsersChat(userId, targetId);
        if (!allowed) {
          client.emit("chatError", "Chat is not available for this user");
          return;
        }

        const participants = [userId.toString(), targetId.toString()].sort();
        const chat = await Chat.findOneAndUpdate(
          { participants },
          {
            $setOnInsert: { participants },
            $push: {
              messages: {
                senderId: userId,
                text: trimmedText,
              },
            },
          },
          {
            new: true,
            upsert: true,
          }
        ).populate("messages.senderId", ["firstName", "lastName", "photoUrl"]);

        const message = chat.messages[chat.messages.length - 1];
        io.to(getRoomId(userId, targetId)).emit("messageReceived", message);
      } catch (error) {
        client.emit("chatError", error.message || "Unable to send message");
      }
    });
  });
};

module.exports = initializeSocket;
