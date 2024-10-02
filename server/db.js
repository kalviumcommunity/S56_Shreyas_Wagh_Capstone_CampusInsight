const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Details } = require("./models/Users.js");

const loadEnv = async () => {
  try {
    await dotenv.config();
    console.log("Environment variables loaded successfully");
  } catch (error) {
    console.error("Error loading environment variables:", error);
  }
};

let connected = async () => {
  await loadEnv();
  try {
    console.log("Connecting to the database...");
    await mongoose.connect(process.env.database_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  isConnected,
  connected,
};