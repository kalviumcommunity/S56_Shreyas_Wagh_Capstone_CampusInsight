const mongoose = require("mongoose");
const UserDetails = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    password: String,
    username: { type: String, unique: true, required: true },
    likedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    bookmarkedMessages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    ],
    otp: { type: String }, 
    otpExpiration: { type: Date },
  },
  { versionKey: false }
);

UserDetails.index({ email: 1 }, { unique: true });
UserDetails.index({ username: 1 }, { unique: true });

const Details = mongoose.model("user", UserDetails);

module.exports = {
  Details,
};
