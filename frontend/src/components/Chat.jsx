import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatError, setChatError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user?._id || !targetId) {
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setChatError("");
        const res = await axios.get(`${BASE_URL}/chat/${targetId}`, {
          withCredentials: true,
        });
        setMessages(res.data.data || []);
      } catch (error) {
        setChatError(
          error.response?.data?.message || "Unable to load this chat"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [targetId, user?._id]);

  useEffect(() => {
    if (!user?._id || !targetId) {
      return;
    }

    const socket = createSocketConnection();
    socket.emit("joinChat", { userId: user._id, targetId });

    const handleIncomingMessage = (message) => {
      setMessages((currentMessages) => [...currentMessages, message]);
    };

    const handleChatError = (message) => {
      setChatError(message);
    };

    socket.on("messageReceived", handleIncomingMessage);
    socket.on("chatError", handleChatError);

    return () => {
      socket.off("messageReceived", handleIncomingMessage);
      socket.off("chatError", handleChatError);
    };
  }, [targetId, user?._id]);

  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || !user?._id) {
      return;
    }

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      userId: user._id,
      targetId,
      text: trimmedMessage,
    });
    setNewMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex justify-center my-4 px-4">
      <div className="flex h-[70vh] w-full max-w-4xl flex-col rounded-xl bg-gray-700 p-4 text-white shadow-xl">
        <h1 className="border-b border-gray-500 pb-3 text-2xl font-semibold">
          Chat
        </h1>

        <div className="mt-4 flex-1 overflow-y-auto rounded-lg bg-slate-800 p-4">
          {isLoading ? (
            <p>Loading messages...</p>
          ) : chatError ? (
            <p className="text-red-300">{chatError}</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-300">No messages yet. Start the conversation.</p>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId?._id === user?._id;
              const senderName = isOwnMessage
                ? "You"
                : `${message.senderId?.firstName || ""} ${
                    message.senderId?.lastName || ""
                  }`.trim() || "Connection";

              return (
                <div
                  className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
                  key={message._id}
                >
                  <div className="chat-header mb-1 text-xs text-gray-300">
                    {senderName}
                  </div>
                  <div className="chat-bubble break-words">{message.text}</div>
                  <div className="chat-footer mt-1 text-xs text-gray-400">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex gap-3 rounded-lg bg-slate-800 p-4">
          <input
            type="text"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message"
            className="flex-1 rounded-lg bg-gray-700 p-3 text-white outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
