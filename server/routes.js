const express = require('express');
const router = express.Router();
const { Details } = require("./models/Users.js");
const { message } = require("./models/Messages.js");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const upload = require("./utils/multer");
const cloudinary = require("./utils/cloudinary");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
require('dotenv').config();

router.use(bodyParser.json());

router.use(express.json());

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 20, 
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.use(limiter);

router.get('/getUsers', async (req, res) => {
    try {
        let result = await Details.find({});
        res.json(result);   
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getUser/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        let result = await Details.findById(userId);
        res.json(result);   
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getUserByEmail/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await Details.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/SignUp', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await Details.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Details({ firstName, lastName, email, password: hashedPassword });

    await newUser.save();
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET);

    res.status(201).json({ message: "User signed up successfully", token });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } already exists`;
      return res.status(400).json({ message });
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post('/SignUp/Username', async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await Details.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingUserWithUsername = await Details.findOne({ username });
        if (existingUserWithUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    user.username = username;
    await user.save();
        res.cookie('username', username, { httpOnly: true });
        res.status(200).json({ message: 'Username added successfully' });
    } catch (error) {
        if (error.code === 11000) { 
            const field = Object.keys(error.keyValue)[0];
            const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
            return res.status(400).json({ message });
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Details.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const username = user.username;
    jwt.sign(
      { email: user.email, username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("Error signing JWT:", err);
          return res.status(500).json({ message: "Error generating token" });
        }
        res.status(200).json({ message: "Login successful", token, username });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/getMessages", async (req, res) => {
  try {
    let result = await message.find({}).sort({ timestamp: -1 });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/postMessage", upload.single("image"), async (req, res) => {
  try {
    const { message: messageContent, username } = req.body;

    // Validation for message and username
    if (!messageContent || messageContent.trim() === "") {
      return res
        .status(400)
        .json({ success: false, error: "Message content is required" });
    }
    if (!username || username.trim() === "") {
      return res
        .status(400)
        .json({ success: false, error: "Username is required" });
    }

    // Initialize image variables
    let imageUrl = null;
    let imagePublicId = null;

    // If an image is provided, upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path); // Upload image to Cloudinary
      imageUrl = result.secure_url; // Secure URL from Cloudinary response
      imagePublicId = result.public_id; // Public ID for future reference (delete/update)
    }

    // Create new message object
    const newMessage = new message({
      message: messageContent,
      username: username,
      imageUrl: imageUrl, // Add image URL to message if exists
      imagePublicId: imagePublicId, 
    });

    // Save to database
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message posted successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).json({ success: false, error: "Failed to post message" });
  }
});

router.post("/likeMessage", async (req, res) => {
  try {
    const { messageId, username } = req.body;

    if (!messageId || !username) {
      return res
        .status(400)
        .json({ message: "Message ID and username are required" });
    }

    const msg = await message.findById(messageId);
    const user = await Details.findOne({ username });

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.likedMessages.includes(messageId)) {
      user.likedMessages.push(messageId);
      msg.likes++;
      await user.save();
      await msg.save();
    }

    res.status(200).json({ message: "Likes incremented successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/unlikeMessage", async (req, res) => {
  try {
    const { messageId, username } = req.body;

    if (!messageId || !username) {
      return res
        .status(400)
        .json({ message: "Message ID and username are required" });
    }

    const msg = await message.findById(messageId);
    const user = await Details.findOne({ username });

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.likedMessages.includes(messageId)) {
      user.likedMessages = user.likedMessages.filter(id => id.toString() !== messageId);
      if (msg.likes > 0) {
        msg.likes--;
      }
      await user.save();
      await msg.save();
    }

    res.status(200).json({ message: 'Likes decremented successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/likedMessages', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await Details.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ likedMessages: user.likedMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put("/updateUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName } = req.body;

    // Check if firstName and lastName are provided
    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "First name and last name are required" });
    }

    // Try to update the user
    const updatedUser = await Details.findByIdAndUpdate(
      userId,
      { firstName, lastName },
      { new: true } // Returns the updated document
    );

    // If user not found, send a 404 response
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send successful response with updated user
    res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    // Handle specific error types if possible
    if (error.name === "CastError") {
      // If the userId is not a valid ObjectId
      return res.status(400).json({ message: "Invalid user ID format" });
    } else if (error.name === "ValidationError") {
      // If there's a validation error with the user data
      return res
        .status(400)
        .json({ message: `Validation error: ${error.message}` });
    } else {
      // Log the full error for debugging purposes
      console.error("Error updating user details:", error);

      // Send generic server error response to the client
      return res
        .status(500)
        .json({
          message:
            "An error occurred while updating user details. Please try again later.",
        });
    }
  }
});

router.post("/bookmarkMessage", async (req, res) => {
  try {
    const { messageId, username } = req.body;

    if (!messageId || !username) {
      return res
        .status(400)
        .json({ message: "Message ID and username are required" });
    }

    const msg = await message.findById(messageId); // Use lowercase "message"
    const user = await Details.findOne({ username });

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add to bookmarks if not already bookmarked
    if (!user.bookmarkedMessages.includes(messageId)) {
      user.bookmarkedMessages.push(messageId);
      await user.save();
    }

    res.status(200).json({ message: "Message bookmarked successfully" });
  } catch (error) {
    console.error("Error bookmarking message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Unbookmark a message
router.post("/unbookmarkMessage", async (req, res) => {
  try {
    const { messageId, username } = req.body;

    if (!messageId || !username) {
      return res
        .status(400)
        .json({ message: "Message ID and username are required" });
    }

    const user = await Details.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from bookmarks if it exists
    if (user.bookmarkedMessages.includes(messageId)) {
      user.bookmarkedMessages = user.bookmarkedMessages.filter(
        (id) => id.toString() !== messageId
      );
      await user.save();
    }

    res.status(200).json({ message: "Message unbookmarked successfully" });
  } catch (error) {
    console.error("Error unbookmarking message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Ensure populate uses the correct model name ("message" lowercase)
router.get("/bookmarkedMessages", async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await Details.findOne({ username }).populate('bookmarkedMessages', null, 'message'); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ bookmarkedMessages: user.bookmarkedMessages });
  } catch (error) {
    console.error("Error fetching bookmarked messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/removeBookmark", async (req, res) => {
  try {
    const { messageId, username } = req.body;

    if (!messageId || !username) {
      return res
        .status(400)
        .json({ message: "Message ID and username are required" });
    }

    const user = await Details.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from bookmarks if exists
    if (user.bookmarkedMessages.includes(messageId)) {
      user.bookmarkedMessages = user.bookmarkedMessages.filter(
        (id) => id.toString() !== messageId
      );
      await user.save();
    }

    res.status(200).json({ message: "Message removed from bookmarks" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/postMessage", upload.single("image"), async (req, res) => {
  try {
    const { message: messageContent, username } = req.body;

    if (!messageContent || validator.isEmpty(messageContent.trim())) {
      return res
        .status(400)
        .json({ success: false, error: "Message content is required" });
    }
    if (!username || validator.isEmpty(username.trim())) {
      return res
        .status(400)
        .json({ success: false, error: "Username is required" });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url; 
        imagePublicId = result.public_id; 
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete temp file:", unlinkErr);
          }
        });
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        if (req.file) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
              console.error(
                "Failed to delete temp file after upload failure:",
                unlinkErr
              );
            }
          });
        }

        return res.status(500).json({
          success: false,
          error: "Image upload failed. Please try again.",
        });
      }
    }

    const newMessage = new message({
      message: messageContent,
      username: username,
      imageUrl: imageUrl, 
      imagePublicId: imagePublicId, 
    });

    // Save to database
    try {
      await newMessage.save();
      res.status(201).json({
        success: true,
        message: "Message posted successfully",
        data: newMessage,
      });
    } catch (dbError) {
      console.error("Error saving message to database:", dbError);
      return res.status(500).json({
        success: false,
        error: "Failed to save message to the database. Please try again.",
      });
    }
  } catch (error) {
    console.error("Unexpected error occurred:", error);
    res.status(500).json({
      success: false,
      error: "An unexpected error occurred. Please try again.",
    });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post("/forgetpassword", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user by email
    const user = await Details.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP and set expiration time
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP and expiration in user document
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    const mailOptions = {
      from: {
        name: "AnonymX",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "OTP for password reset",
      text: `Your OTP for resetting the password is: ${otp}. This OTP is valid for 10 minutes.`,
    };

    // Send the OTP email
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.error("Error sending OTP email:", err);
        return res.status(500).json({ error: "Error sending OTP email" });
      }

      console.log("OTP email sent successfully");
      return res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (err) {
    console.error("Internal server error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
});

// reset password
router.put("/resetpassword", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // Validate inputs
    if (!email || !otp || !password) {
      return res
        .status(400)
        .json({ error: "Email, OTP, and new password are required" });
    }

    // Find user by email
    const user = await Details.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check OTP expiration
    if (user.otpExpiration <= Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Reset password, OTP, and OTP expiration
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiration = null;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Internal server error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
});

router.get("/userMessages/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await Details.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userMessages = await message
      .find({ username: user.username })
      .sort({ timestamp: -1 });

    res.status(200).json({ messages: userMessages });
  } catch (error) {
    console.error(
      "Error fetching user messages for email:",
      req.params.email,
      error
    );
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.delete("/deleteMessage/:messageId", async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userEmail = req.body.email;

    const messageToDelete = await message.findById(messageId);
    if (!messageToDelete) {
      return res.status(404).json({ message: "Message not found" });
    }

    const user = await Details.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (messageToDelete.username !== user.username) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this message" });
    }

    await message.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(
      "Error deleting message with ID:",
      req.params.messageId,
      error
    );
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.put("/messages/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { message: newMessage, email } = req.body || {};

  if (!newMessage) {
    return res.status(400).send({ error: "Message field is required." });
  }

  try {
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
      fs.unlinkSync(req.file.path);
    }

    const updatedMessage = await message.findByIdAndUpdate(
      id,
      {
        message: newMessage,
        imageUrl: imageUrl || req.body.imageUrl,
        imagePublicId: imagePublicId || req.body.imagePublicId,
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).send({ error: "Message not found" });
    }

    res.send(updatedMessage);
  } catch (error) {
    console.error("Error updating message with ID:", id, error);
    res
      .status(500)
      .send({ error: "Internal server error", error: error.message });
  }
});

module.exports = router;
     