const mongoose = require("mongoose");

const UserDetails = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    username: { type: String, unique: true }
},{ versionKey: false });

const Details=mongoose.model("user",UserDetails);

module.exports = {
    Details
}