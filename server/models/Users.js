const mongoose = require("mongoose");

const UserDetails = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    username: { type: String, unique: true },
    likedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    bookmarkedMessages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    ], 
  },
  { versionKey: false }
);

const Details = mongoose.model("user", UserDetails);

module.exports = {
  Details,
};