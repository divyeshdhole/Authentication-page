require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { stringify } = require("querystring");
const { StringDecoder } = require("string_decoder");
const encrypt = require("mongoose-encryption");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://localhost:27017/usersDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
const secret = "abcdefghijk";
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});
const User = mongoose.model("User", userSchema);



app.get("/home", function(req, res) {
    res.render("home");
})

app.get("/register", function(req, res) {
    res.render("register");
})

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
    .then(function() {
        res.render("secrets");
    })
    .catch(function(err) {
        res.render(err);
    });
})


app.get("/login", function(req, res) {
    res.render("login");
})

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then(function(user) {
            if(user.password == password) {
                // console.log("Rendering!");
                res.render("secrets");
            }
            else {
                res.send("Not Match!");
        }
        
    })
    .catch(function(err) {
        res.send(err);
    })
})

app.listen(3000, function() {
    console.log("Server listening on port 3000...")
})