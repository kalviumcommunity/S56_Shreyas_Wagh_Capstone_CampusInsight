const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { Details } = require("./models/Users.js");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const express = require("express"); // Import Express
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const app = express(); // Create an Express application

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
    scheduleCronJobs();

    // Apollo Server setup
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      persistedQueries: true,
      cache: "bounded", // Set cache to bounded
    });

    await server.start();
    server.applyMiddleware({ app });

    // Start the Express server
    const PORT = process.env.PORT || 4001;
    app.listen(PORT, () => {
      console.log(
        `Server running at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

const scheduleCronJobs = () => {
  // Run every minute
  cron.schedule("* * * * *", () => {
    try {
      console.log("Running a task every minute");
    } catch (error) {
      console.error("Error in every-minute cron job:", error);
    }
  });

  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running daily tasks at midnight");
      console.log("Running a daily task at midnight");

      // Task 2: Deleting old OTP records
      console.log("Running cron job to delete old OTP records");
      const result = await Details.updateMany(
        { otpExpiration: { $lt: new Date() } }, // Find expired OTPs
        { $unset: { otp: "", otpExpiration: "" } } // Remove fields
      );
      console.log(`Cleared OTPs from ${result.modifiedCount} user records`);
    } catch (error) {
      console.error("Error in daily midnight cron job:", error);
    }
  });
};

module.exports = {
  isConnected,
  connected,
};