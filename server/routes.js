const express = require('express');
const router = express.Router();
const { Details } = require("./models/Users.js");
const { message } = require("./models/Messages.js");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const upload = require("./utils/multer");
const cloudinary = require("./utils/cloudinary");
require('dotenv').config();

router.use(bodyParser.json());

router.use(express.json());

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

        res.status(201).json({ message: 'User signed up successfully', token });
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


router.post('/SignUp/Username', async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await Details.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingUserWithUsername = await Details.findOne({ username });
        if (existingUserWithUsername) {
            return res.status(400).json({ message: 'Username already exists' });
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
            return res.status(401).json({ message: 'Invalid password' });
        }

        const username = user.username;
        jwt.sign({ email: user.email, username }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('Error signing JWT:', err);
                return res.status(500).json({ message: 'Error generating token' });
            }
            res.status(200).json({ message: 'Login successful', token, username });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getMessages', async (req, res) => {
    try {
        let result = await message.find({}).sort({ timestamp: -1 });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
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
      imagePublicId: imagePublicId, // Add image public ID for management
    });

    // Save to database
    await newMessage.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Message posted successfully",
        data: newMessage,
      });
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).json({ success: false, error: "Failed to post message" });
  }
});

router.post('/likeMessage', async (req, res) => {
  try {
    const { messageId, username } = req.body;

    if (!messageId || !username) {
      return res.status(400).json({ message: 'Message ID and username are required' });
    }

    const msg = await message.findById(messageId);
    const user = await Details.findOne({ username });

    if (!msg) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.likedMessages.includes(messageId)) {
      user.likedMessages.push(messageId);
      msg.likes++;
      await user.save();
      await msg.save();
    }

    res.status(200).json({ message: 'Likes incremented successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/unlikeMessage', async (req, res) => {
  try {
    const { messageId, username } = req.body;

    if (!messageId || !username) {
      return res.status(400).json({ message: 'Message ID and username are required' });
    }

    const msg = await message.findById(messageId);
    const user = await Details.findOne({ username });

    if (!msg) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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

router.post("/upload", upload.single("image"), function (req, res) {
  cloudinary.uploader.upload(req.file.path, function (err, result) {
    if (err) {
      console.log("Image cannot be uploaed:", err);
      return res.status(500).json({
        success: false,
        message: "Error uploading image",
      });
    }

    res.status(200).json({
      success: true,
      message: "Uploaded!",
      data: result,
    });
  });
});

module.exports = router;
     