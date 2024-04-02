let mongoose = require("mongoose")
require("dotenv").config()

let connected = async() => {
    try{
        console.log(process.env.database_URI)
        await mongoose.connect(process.env.database_URI);
        console.log("Database connected successfully")
    }catch(error){
        console.log(error)
    }
}
const isConnected = () => {
    return mongoose.connection.readyState === 1;
}

module.exports = {
    isConnected,
    connected
}