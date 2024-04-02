const mongoose = require("mongoose");

const UserDetails = new mongoose.Schema({
    email:String,
    password:String
});
const Details=mongoose.model("user",UserDetails);

const username=new mongoose.Schema({
    username:String
});

const Username=mongoose.model("username",username);

module.exports = {
    Username,
    Details
}