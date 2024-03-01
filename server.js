const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const dbConnection = require('./config/db');
const adminRequired = require('./middlewares/authAdmin');

const app = express();

app.use(session({
    secret: 'I am the best',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

dbConnection();

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const homeRoute = require('./routes/home');
app.use('/', homeRoute);

const postRoutes = require('./routes/post');
app.use('/post', postRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRequired, adminRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})