const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment')
const moment = require('moment');
const mongoose = require("mongoose");


router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json({ success: true, posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.post('/create', async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { title, content, images, author } = req.body;
        if (!author) {
            return res.status(400).json({ success: false, error: "Author is required" });
        }
        if (!title || !content) {
            return res.status(400).json({ success: false, error: "Title and content are required" });
        }
        const imagePaths = Array.isArray(images) ? images : [];
        const newPost = new Post({ title, content, author, images: imagePaths });
        await newPost.save();
        res.status(201).json({ success: true, message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        res.json({ success: true, post });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.put('/update/:postId', async (req, res) => {
    try {
        const { title, content, images } = req.body;
        const postId = req.params.postId;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content, images: Array.isArray(images) ? images : [] },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        res.json({ success: true, message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.delete('/delete/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userPosts = await Post.find({ author: userId }).populate('author', 'username');
        res.json({ success: true, posts: userPosts });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

router.post("/:postId/comments", async (req, res) => {
    try {
        const { postId } = req.params;
        const { text, userId } = req.body;

        console.log("Incoming request body:", req.body); // Debugging

        // Validate postId format
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ success: false, error: "Invalid postId format" });
        }

        // Validate required fields
        if (!text || !userId) {
            return res.status(400).json({ success: false, error: "Text and userId are required" });
        }

        // Ensure the post exists
        const postExists = await Post.findById(postId);
        if (!postExists) {
            return res.status(404).json({ success: false, error: "Post not found" });
        }

        // Create new comment
        const newComment = new Comment({
            post: postId,
            user: userId,
            text,
        });

        await newComment.save();

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: {
                _id: newComment._id,
                text: newComment.text,
                user: newComment.user,
                createdAt: newComment.createdAt,
            },
        });

    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

router.get("/:postId/comments", async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ post: postId })
            .populate("user", "username") 
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            comments: comments.map(comment => ({
                _id: comment._id,
                text: comment.text,
                author: comment.user?.username || "Unknown",
                createdAt: comment.createdAt,
            })),
        });

    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router;