//Key Package Requirements
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();


//Mongoose Related
const mongoose = require('mongoose');
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');

const uri = "mongodb+srv://vjkarthik2987:9Feb2014@cluster0.k8jiadi.mongodb.net/?retryWrites=true&w=majority";

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(uri, connectionParams)
    .then(() => {
        console.log('Connected to the database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    });

const client = new MongoClient(uri);

//Setting up the app
app.use(express.static("public"));
app.set("view engine", "ejs");

//Other variables
const chapters = require("./chapters");
const themes = require("./themes");
const areas = require("./areas");

//Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/examples", (req, res) => {
    res.render("examples", {trends: themes});
});

app.get("/examples/:theme", (req, res) =>{
    const theme = req.params.theme;
    const trend = themes[theme][0];
    
    const database = client.db('theMainDB');
    const examples = database.collection('examples');
    
    examples.find({trend: trend}).sort({"sl":-1}).toArray(function(err, examples) {
        res.render("trendexamples", {examples: examples, trend: trend});
    });
});

app.get("/allExamples", (req, res) => {
    const database = client.db('theMainDB');
    const examples = database.collection('examples');
    examples.find({}).sort({"sl":-1}).toArray(function(err, examples) {
        res.render("allExamples", {examples: examples});
    });
});


app.get("/themes", (req, res) => {
    res.render("themes", {themes: themes});
});

app.get("/themes/:theme", (req, res) => {
    res.render("themepage", {themes: themes});
})

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/document", (req, res) => {
    res.render("document", {
        chapters: chapters
    });
});

app.get("/resources", (req, res) => {
    res.render("resources");
});

app.get("/surveys", (req, res) => {
    res.render("surveys", {areas:areas});
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/share", (req, res) => {
    res.render("share");
});

app.get("/blogs", (req, res) => {
    res.render("blogs");
});

app.get("/services", (req, res) => {
    res.render("services");
});


//App Listen
app.listen(3000, () => {
    console.log("Server started successfully");
});
