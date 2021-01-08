require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const bodyParser = require("body-parser");

const passport = require("passport");
const DiscordStrategy = require('passport-discord').Strategy;
const database = require("./database/database");
const userModel = require("./database/models/user");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'my-big-secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    userModel.findOne({ id: id }, (err, user) => {
        done(err, user);
    });
});

const passportCallback = require("./src/passportCallback");
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ["identify", "guilds", "connections"]
},
    (accessToken, refreshToken, profile, done) => passportCallback(accessToken, refreshToken, profile, done)));

// Home
app.get("/", (req, res) => res.render("home.ejs", { req: req, res: res }));

// Discord OAuth2
app.get("/auth/discord", passport.authenticate("discord"));
app.get("/auth/discord/secrets", passport.authenticate("discord", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/");
});
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// Servers
app.get("/servers", async (req, res) => {
    if(req.isAuthenticated()) {
        const servers = require("./src/scripts/servers");
        servers(req, res);
    }
    else return res.render("servers.ejs", { req: req, res: res, servers: "" });
});
// Steam Module
app.get("/steam", (req, res) => {
    res.render("steam.ejs", { req: req, res: res, steamInfo: "" });
});
app.post("/steam", (req, res) => {
    const steamModule = require("./src/steam/steam");
    steamModule(req, res);
});

// Get and post jokes
app.get("/joke", (req, res) => {
    res.render("joke.ejs", { req: req, res: res, joke: "" });
});
app.post("/joke", (req, res) => {
    const getJoke = require("./src/entertainment/joke");
    getJoke(req, res);
});

// Movie Search
const searchMovie = require("./src/entertainment/movie");
app.get("/movie", (req, res) => {
    searchMovie(req, res, req.query);
});
app.post("/movie", (req, res) => {
    searchMovie(req, res, req.query);
});


// Start Server.
app.listen(process.env.PORT, () => {
    console.log("Server is running on port : " + process.env.PORT);
});
// Connect to MongoDB.
database();