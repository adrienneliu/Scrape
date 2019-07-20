 // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

var express = require("express");
var mongoose = require("mongoose"); 

//Scraping tools 
var axios = require("axios");
var cheerio = require("cheerio"); 

var PORT = 8000; 

var app = express();

app.use(express.urlencoded({ extended:true }));
app.use(express.json());

// need folder for public
// need folder for models

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });


//routes
//GET route to scrape the website first and save to db

//GET route to get saved data from db

//starting server
app.listen(PORT, function() {
    console.log("Listening on http://localhost:" + PORT);
})