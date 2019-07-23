//  // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI);

var express = require("express");
var mongoose = require("mongoose"); 

//Scraping tools 
var axios = require("axios");
var cheerio = require("cheerio"); 

// Set the port of our application
var PORT = 8000; 

//start express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended:true }));
app.use(express.json());

// need folder for public
app.use(express.static("public"));

//handlebars
var exphbs = require("express-handlebars"); 
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// folder for models
var db = require("./models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/recipes", { useNewUrlParser: true });


//routes for delish.com
//GET route to scrape the website first and save to db
// app.get("/scrape", function(req,res){

//     axios.get("https://www.delish.com/food-news").then(function(response) {
       
//         var $ = cheerio.load(response.data); 

//     //make sure your results are in [], instead of {}!!! 
//         var cards = [];
//         $(".full-item-content").each(function(i, element) {
//             var result = []; 
            
//             result.title = $(this).children("a").text(); 
//             result.link = $(this).children("a").attr("href");
   

//            cards.push(result.title); 
//            cards.push(result.link);

//             });        console.log(cards);
//         }); res.send("Scrape Complete"); 
        
//     });

app.get("/", function(req, res) {
    db.Recipe.find({}).then(function(dbRecipe){
        res.render("home", {
            recipes: dbRecipe
        });
    }).catch(function(err){
        console.log(err);
    });
});
//route for allrecipes
app.get("/scrape", function(req,res){

        axios.get("https://www.allrecipes.com/recipes/17562/dinner/").then(function(response) {
           
            var $ = cheerio.load(response.data); 
    
            $(".fixed-recipe-card__h3 a").each(function(i, element) {
                var result = {}; 
                
                result.title = $(this).children("span").text(); 
                result.link = $(this).attr("href");
                
    //this transfers our data into mongodb
               db.Recipe.create(result).then(function(dbRecipe){
                   console.log(dbRecipe);
               }).catch(function(err){
                   console.log(err);
               });
            }); 

            //     var imageArr = []; 
            //     // // var i = 0;
            // $(".grid-card-image-container a").each(function(i, element){

            //     var image  = $(this).children("img").attr("data-original-src");
                
            //     imageArr.push(image);
            //     // imageArr.push(cards[i] + '  ' +image );
            //     // i++;

            //  }); console.log(imageArr);
        }); res.json("Scrape Complete"); 
            
    });

//GET route to get saved data from db

//starting server
app.listen(PORT, function() {
    console.log("Listening on http://localhost:" + PORT)
})