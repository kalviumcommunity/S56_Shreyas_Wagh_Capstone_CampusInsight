const mongoose = require("mongoose");

const UserDetails = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    username: { type: String, unique: true }
},{ versionKey: false });
const Details=mongoose.model("user",UserDetails);

const username=new mongoose.Schema({
    username:String
});

const Username=mongoose.model("username",username);

module.exports = {
    Username,
    Details
}