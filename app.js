require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

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
    password: { type: String }
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res)=> {
    res.render("home");
});
app.get("/login", (req, res)=> {
    res.render("login");
});
app.get("/register", (req, res)=> {
    res.render("register");
});
app.get("/secrets", (req, res) => {
    if(req.isAuthenticated()) res.render("secrets");
    else res.redirect("/login");
});
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

app.post("/register", (req, res) => {
    User.register({username: req.body.username, email: req.body.email}, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
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
        if(err) console.log(err);
        else passport.authenticate("local")(req, res, () => {
            res.redirect("/secrets");
        });
    });
});

// Start Server.
app.listen(process.env.PORT, ()=> {
    console.log("Server is running on port : " + process.env.PORT);
});
// Connect to MongoDB.
mongoose.connect(process.env.MONGO_URL, { dbName:"express", useNewUrlParser: true, useUnifiedTopology: true })
.then( ()=>{
    console.log("Connected to MongoDB");
});