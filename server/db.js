const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { Details } = require("./models/Users.js");
const { ChatMessage } = require("./models/ChatMessage.js"); // Use ChatMessage model instead of "message"
const express = require("express"); // Import Express
const http = require("http"); // Needed for Socket.io
const { Server } = require("socket.io"); // Import Socket.io
const cookieParser = require("cookie-parser"); // Import cookie-parser to handle cookies

// Create an Express application
const app = express();
app.use(cookieParser()); // Add cookie-parser to extract cookies
const server = http.createServer(app); // Create an HTTP server for Socket.io

// Initialize Socket.io
const allowedOrigins = [
  "https://client-blush-five.vercel.app", // Your production origin
  "http://localhost:5173", // Your local development origin
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true, // Include credentials if needed
  },
});

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

    // Start listening to the Socket.io connections
    io.on("connection", (socket) => {
      console.log("New user connected:", socket.id);

      socket.on("chatMessage", async (data) => {
        const { messageText, username } = data; // Extract username from the message data

        // Save the message in the database
        const newMessage = new ChatMessage({
          message: messageText,
          username: username, // Use the username from the message data
        });

        await newMessage.save();

        // Broadcast the message to all clients
        io.emit("newMessage", newMessage); // Emit to all connected users
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    // Start the Express server with Socket.io
    const PORT = process.env.PORT || 4000; // Use 3000 for both
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
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
