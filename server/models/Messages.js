const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  username: {
    type: String,
    required: true,
    index: true // Adding an index on the username field
  }
},{ versionKey: false });

const message = mongoose.model("message", messageSchema);

module.exports = {
    message
}