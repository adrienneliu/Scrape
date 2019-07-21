//  // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI);

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
app.use(express.static("public"));

// folder for models
var db = require("./models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/recipes", { useNewUrlParser: true });


//routes
//GET route to scrape the website first and save to db
app.get("/scrape", function(req,res){
    axios.get("https://www.allrecipes.com/").then(function(response) {
        var $ = cheerio.load(response.data); 
    })
})
//GET route to get saved data from db

//starting server
app.listen(PORT, function() {
    console.log("Listening on http://localhost:" + PORT);
})