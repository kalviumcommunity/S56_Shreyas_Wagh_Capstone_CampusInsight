const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    bookmarks: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

const message = mongoose.model("message", messageSchema);

module.exports = {
  message,
};
