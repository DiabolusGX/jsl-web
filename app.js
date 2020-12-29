require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const https = require("https");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'My Big Secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    picture: { type: String },
    password: { type: String },
    googleId: { type: String },
    steamId: { type: String }
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/secrets"
    },
    (_accessToken, _refreshToken, profile, cb) => {
        let picture = "";
        if(profile.photos[0]) picture = profile.photos[0].value;
        User.findOrCreate({
            googleId: profile.id,
            email: profile.emails[0].value,
            picture: picture
        }, (err, user) => {
            return cb(err, user);
        });
    }
));

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/secrets", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/secrets");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) res.render("secrets");
    else res.redirect("/login");
});
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// Get and post jokes
app.get("/joke", (req, res) =>{
    res.render("joke.ejs", { joke: "" });
});
app.post("/joke", (req, res) => {
    let joke = "", bans = "";
    if(req.body.flag){
        if(typeof(req.body.flag) === "string") bans = req.body.flag;
        else if(typeof(req.body.flag) === "object") bans = req.body.flag.join(",");
    }
    const url = "https://sv443.net/jokeapi/v2/joke/"+ req.body.jokeType + "?blacklistFlags=" + bans;
    https.get(url, (response) => {
        response.on("data", (data) => {
            const jokeData = JSON.parse(data);
            if(jokeData.type === "twopart") joke += jokeData.setup + "<br>" + jokeData.delivery;
            else if(jokeData.type === "single") joke = jokeData.joke;
            res.render("joke.ejs", { joke: joke });
        });
    });
});

app.post("/register", (req, res) => {
    User.register({ username: req.body.username, email: req.body.email }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        }
    });
});
app.post("/login", (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    req.login(newUser, (err) => {
        if (err) console.log(err);
        else passport.authenticate("local")(req, res, () => {
            res.redirect("/secrets");
        });
    });
});

// Start Server.
app.listen(process.env.PORT, () => {
    console.log("Server is running on port : " + process.env.PORT);
});
// Connect to MongoDB.
mongoose.connect(process.env.MONGO_URL, { dbName: "express", useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    });