const express = require('express');
const router = express.Router();
const { Details } = require("./models/Users.js");
const { Username } = require("./models/Users.js");
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
        const { email, password } = req.body;
        const existingUser = await Details.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Details({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User signed up successfully' });
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
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET , { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/username', async (req, res) => {
    try {
        const { username } = req.body;
        const existingUsername = await Username.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const newUsername = new Username({ username });
        await newUsername.save();
        res.status(201).json({ message: 'Username added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getUsername', async (req, res) => {
    try {
        let result = await Username.find({});
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
