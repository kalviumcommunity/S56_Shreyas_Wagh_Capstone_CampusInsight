const express = require('express');
const router = express.Router();
const { Details } = require("./models/Users.js");
const { message } = require("./models/Messages.js");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.use(bodyParser.json());

router.get('/getUsers', async (req, res) => {
    try {
        let result = await Details.find({});
        res.json(result);   
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/SignUp', async (req, res) => {
    try {
        const {firstName,lastName, email, password } = req.body;
        const existingUser = await Details.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Details({firstName,lastName, email, password: hashedPassword });
        await newUser.save();
         const token = jwt.sign({ email: newUser.email }, 'JWT_SECRET'); 
        res.status(201).json({ message: 'User signed up successfully', token });
    } catch (error) {
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
        let result = await message.find({});
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/postMessage', async (req, res) => {
    try {
        const { message: messageContent, username } = req.body; 
        if (!messageContent || messageContent.trim() === '') {
            return res.status(400).json({ success: false, error: 'Message content is required' });
        }
        if (!username || username.trim() === '') {
            return res.status(400).json({ success: false, error: 'Username is required' });
        }
        const newMessage = new message({
            message: messageContent,
            username: username 
        });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Message posted successfully' });
    } catch (error) {
        console.error('Error posting message:', error);
        res.status(500).json({ success: false, error: 'Failed to post message' });
    }
});

router.post('/likeMessage', async (req, res) => {
    try {
        const messageId = req.body.messageId;
        const msg = await message.findById(messageId);
        if (!msg) {
            return res.status(404).json({ message: 'Message not found' });
        }
        msg.likes++;
        await msg.save();
        res.status(200).json({ message: 'Likes incremented successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/unlikeMessage', async (req, res) => {
    try {
        const messageId = req.body.messageId;
        const msg = await message.findById(messageId);
        if (!msg) {
            return res.status(404).json({ message: 'Message not found' });
        }
        if (msg.likes > 0) {
            msg.likes--;
            await msg.save();
        }
        res.status(200).json({ message: 'Likes decremented successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
