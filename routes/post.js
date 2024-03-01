const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/post');
const User = require('../models/user');
const loginRequired = require('../middlewares/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

router.use(loginRequired);

router.get('/create', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        const LoggedIn = (req.session.user) ? true : false;
        const users = await User.find(); 
        res.render('createPost', {users, isAdmin, LoggedIn}); 
    } catch (error) {
        res.status(500).render('error', {errorCode: 500, error: 'Internal Server Error'});
    }
});

router.post('/create', upload.fields([{name: 'image1'}, {name: 'image2'}, {name: 'image3'}]), async (req, res) => {
    try {
        const {title_en, title_ru, content_en, content_ru} = req.body;
        const author = req.session.user;

        const imageUrl1 = req.files['image1'][0].path.substring(7);
        const imageUrl2 = req.files['image2'][0].path.substring(7);
        const imageUrl3 = req.files['image3'][0].path.substring(7);
        
        const newPost = new Post({
            title: {en: title_en, ru: title_ru}, 
            content: {en: content_en, ru: content_ru},
            author,
            imageUrl1,
            imageUrl2,
            imageUrl3
        });
        await newPost.save();
        res.redirect(`/post/${newPost._id}`);
    } catch (error) {
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        const LoggedIn = (req.session.user) ? true : false;
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).render('error', {errorCode: 404, error: 'Post not found'});
        }
        console.log(post);
        const author = await User.findById(post.author);
        res.render('viewPost', {post, author, isAdmin, LoggedIn});
    } catch (error) {
        res.status(500).render('error', {errorCode: 500, error: 'Internal Server Error'});
    }
});

router.post('/update/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const {title_en, title_ru, content_en, content_ru} = req.body;
        const title = {en: title_en, ru: content_ru};
        const content = {en: content_en, ru: content_ru};
        const updatedPost = await Post.findByIdAndUpdate(postId, {title, content}, { new: true });
        if (!updatedPost) {
            return res.status(404).render('error', { errorCode: 404, error: 'Post not found' });
        }
        res.redirect(`/post/${updatedPost._id}`);
    } catch (error) {
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

router.post('/delete/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).render('error', { errorCode: 404, error: 'Post not found' });
        }
        res.redirect('/');
    } catch (error) {
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

module.exports = router;