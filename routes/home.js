const express = require("express");
const router = express.Router();
const axios = require("axios");
const Post = require("../models/post");
const isAuthenticated = require("../middlewares/auth");

router.get("/", async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        const LoggedIn = req.session.user ? true : false;
        const posts = await Post.find().populate("author");
        res.json({posts, LoggedIn, isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;