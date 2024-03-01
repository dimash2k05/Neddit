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
        res.render("home", { posts, LoggedIn, isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).render("error", { errorCode: 500, error: "Internal Server Error" });
    }
});

router.get('/country', isAuthenticated, async (req, res) => {
    const isAdmin = req.session.isAdmin;
    const LoggedIn = req.session.user ? true : false;
    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
        "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
        "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
        "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
    ];
    const result = await axios.get("https://api.api-ninjas.com/v1/country", {
        params: {
            name: countries[Math.floor(Math.random() * countries.length)]
        },
        headers: {
            'X-Api-Key': 'PLTZf0U4hgA9wCYJkx5fbw==Fb1lDyLYBhRu2vxO'
        }
    });
    res.render('country', {LoggedIn, isAdmin, countryGuess: result.data});
});

router.get("/gpt", isAuthenticated, async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        const LoggedIn = req.session.user ? true : false;
        res.render("gpt", { LoggedIn, isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).render("error", { errorCode: 500, error: "Internal Server Error" });
    }
});

router.post("/gpt", isAuthenticated, async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        const LoggedIn = req.session.user ? true : false;
        const options = {
            method: 'POST',
            url: 'https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask',
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': '8f5ef08c9emshcfd8325fe186caap10eafcjsn0469ecef7688',
              'X-RapidAPI-Host': 'chatgpt-gpt4-ai-chatbot.p.rapidapi.com'
            },
            data: {
              query: req.body.query
            }
        };
        const response = await axios.request(options);
        const result = response.data.response;
        res.render("gptResult", { result, LoggedIn, isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).render("error", { errorCode: 500, error: "Internal Server Error" });
    }
})

module.exports = router;