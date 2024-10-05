const mongoose = require("mongoose");
const dotenv = require("dotenv");
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
    const PORT = process.env.PORT || 4000;
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

module.exports = {
  isConnected,
  connected,
};