const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const loginRequired = require('../middlewares/auth');

router.get('/register', (req, res) => {
    const isAdmin = req.session.isAdmin;
    const LoggedIn = (req.session.user) ? true : false;
    res.render('register', {isAdmin, LoggedIn});
});

router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(500).render('error', {errorCode: 500, error: 'User already exists'});
        }
        const user = await User.create({username, email, password});
        req.session.user = user;
        res.status(201).redirect('/');
    } catch (error) {
        res.status(500).render('error', {errorCode: 500, error: 'Internal Server Error'});
    }
});

router.get('/login', (req, res) => {
    const isAdmin = req.session.isAdmin;
    const LoggedIn = (req.session.user) ? true : false;
    res.render('login', {isAdmin, LoggedIn});
});

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).render('error', {errorCode: 404, error: 'User not found'});
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).render('error', {errorCode: 401, error: 'Invalid email or password'})
        }
        req.session.user = user;
        req.session.isAdmin = (user.role == 'admin') ? true : false;
        console.log(req.session.isAdmin);
        res.redirect('/');
    } catch(error) {
        res.status(500).render('error', {errorCode: 500, error: 'Internal Server Error'});
    }
});

router.get('/logout', loginRequired, async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).render('error', {errorCode: 500, error: 'Internal Server Error'});
        }
        else {
            res.redirect('/');
        }
    });
});

module.exports = router;