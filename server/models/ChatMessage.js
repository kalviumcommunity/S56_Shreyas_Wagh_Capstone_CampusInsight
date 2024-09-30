const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      index: true, // Index for faster querying by username
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = {
  ChatMessage,
};
