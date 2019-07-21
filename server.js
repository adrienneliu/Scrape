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

var exphbs = require("express-handlebars"); 
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// folder for models
var db = require("./models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/recipes", { useNewUrlParser: true });


//routes
//GET route to scrape the website first and save to db
app.get("/scrape", function(req,res){

    axios.get("https://www.delish.com/food-news").then(function(response) {
       
        var $ = cheerio.load(response.data); 
        var cards = [];
        $(".full-item-content").each(function(i, element) {
            var result = []; 
            
            result.title = $(this).children("a").text(); 
            result.link = $(this).children("a").attr("href");

           cards.push(result.title); 
           cards.push(result.link);
            });        console.log(cards);
        }); res.send("Scrape Complete"); 
        
    });

//GET route to get saved data from db

//starting server
app.listen(PORT, function() {
    console.log("Listening on http://localhost:" + PORT);
})