require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//C:\Users\DiabolusGX\AppData\Roaming\npm

app.get("/", (req, res)=> {
    res.render("home");
});

app.get("/login", (req, res)=> {
    res.render("login");
});

app.get("/register", (req, res)=> {
    res.render("register");
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