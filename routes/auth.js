const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const loginRequired = require('../middlewares/auth');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

        req.session.user = user;
        req.session.isAdmin = user.role === 'admin';

        res.status(201).json({ success: true, message: 'User registered', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        req.session.user = user;
        req.session.isAdmin = user.role === 'admin';

        res.json({ success: true, message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.post('/logout', loginRequired, async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

router.get('/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, isAdmin: req.session.isAdmin, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;
