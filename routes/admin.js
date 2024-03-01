const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Post = require('../models/post');

router.get('/', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        const LoggedIn = (req.session.user) ? true : false;
        const users = await User.find();
        res.render('adminPage', {users, isAdmin, LoggedIn});
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {errorCode: 500, error: 'Internal Server Error'});
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { errorCode: 404, error: 'User not found' });
        }
        await Post.deleteMany({author: user});
        await user.deleteOne();
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {errorCode: 500, error: 'Internal Server Error'});
    }
});

router.get('/update/:id', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        const LoggedIn = (req.session.user) ? true : false;
        const user = await User.findById(req.params.id);

        res.render('userUpdate', {user, isAdmin, LoggedIn});
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {errorCode: 500, error: 'Internal Server Error'});
    }
})

router.post('/update/:id', async (req, res) => {
    try {
        const {username, email, password, role} = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).render('error', { errorCode: 404, error: 'User not found' });
        }

        user.username = username;
        user.email = email;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.role = role;
        await user.save();
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', {errorCode: 500, error: 'Internal Server Error'});
    }
})

module.exports = router;