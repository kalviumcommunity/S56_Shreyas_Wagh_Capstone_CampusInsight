const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
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
    console.log(process.env.database_URI);
    await mongoose.connect(process.env.database_URI);
    console.log("Database connected successfully");
    scheduleCronJobs();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

const scheduleCronJobs = () => {
  cron.schedule("* * * * *", () => {
    console.log("Running a task every minute");
  });

  cron.schedule("0 0 * * *", () => {
    console.log("Running a daily task at midnight");
  });

  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running cron job to delete old OTP records");
      const result = await Details.updateMany(
        { otpExpiration: { $lt: new Date() } }, 
        { $unset: { otp: "", otpExpiration: "" } } 
      );

      console.log(`Cleared OTPs from ${result.modifiedCount} user records`);
    } catch (error) {
      console.error("Error running cron job:", error);
    }
  });
};

module.exports = {
  isConnected,
  connected,
};