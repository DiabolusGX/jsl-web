require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cd5 = require("md5");
const md5 = require("md5");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String }
});
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=> {
    res.render("home");
});
app.get("/login", (req, res)=> {
    res.render("login");
});
app.get("/register", (req, res)=> {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password)
    });
    newUser.save( (err) => {
        if(err) console.log(err);
        else res.render("secrets");
    });
});
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({ username: username }, (err, user) => {
        if(err) console.log(err);
        else if(user && user.password === password) res.render("secrets");
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