var express = require("express");
var mongoose = require("mongoose"); 


//  // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


//Scraping tools 
var axios = require("axios");
var cheerio = require("cheerio"); 

// Set the port of our application
var PORT = process.env.PORT || 8000; 

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

//route for getting all recipes from db
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
    
            // $(".fixed-recipe-card__h3 a").each(function(i, element) {
            //     var result = {}; 
                
            //     result.title = $(this).children("span").text(); 
            //     result.link = $(this).attr("href");

                $("article").each(function(i, element) {
                var result = {}; 
                
                result.title = $(this).children(".fixed-recipe-card__info").children("h3").children("a").children("span").text();
                result.link = $(this).children(".fixed-recipe-card__info").children("h3").children("a").attr("href");
                result.image = $(this).children(".grid-card-image-container").children("a").children("img").attr("data-original-src"); 

                console.log(result);
    //this transfers our data into mongodb
            if (result.title && result.link && result.image) {
               db.Recipe.create(result).then(function(dbRecipe){
                   console.log(dbRecipe);
               }).catch(function(err){
                   console.log(err);
                   console.log("results");
                   console.log(result);
               });
              }
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
//get=read
app.get("/saved", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  // Grab every document in the Articles collection
  db.Recipe.find({ saved: true})
  .populate("note")
//   .populate("note")
  // can put filtering in find({saved:false})
    .then(function(dbRecipe) {
      // If we were able to successfully find Articles, send them back to the client
      // res.json(dbRecipe);
      res.render("saved", {
        recipes: dbRecipe
      })
      // console.log(dbRecipe)
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      //res.json(err);
      console.log("err", err);
    });
});

// just added this in for our save button update
//put=update
app.put("/recipe/:id", function(req,res){
    db.Recipe.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(function(response){
      res.json(true)
      console.log(response);
    })
    .catch(function(err){
      console.log(err);
    })
  })

  //Route for grabbing a specific recipe by id, populate it with it's note
  //post=create
app.post("/recipe/:id/note", function(req, res) {
  console.log(req.body);
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Note.create(req.body)
    // ..and populate all of the notes associated with it
    .then(function(dbNote) {
      console.log("------note id-----");
      console.log(dbNote._id);
      console.log("------article id-----");
      console.log( req.params.id);

      return db.Recipe.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new:true});
      // If we were able to successfully find an recipe with the given id, send it back to the client
    }).then(function(dbRecipe){
      res.json(dbRecipe);

    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//Route for grabbing a specific note by id, deleting it
//get=read
app.delete("/recipe/:id/note", function(req, res) {
  db.Note.findOneAndRemove({_id:req.params.id}, function (err, data) {
    console.log(req.body);
    console.log("param id");
    console.log(req.params.id);
    if (err) {
        console.log(err);
    } else {
    }
    console.log("ddata")
    console.log(data);
    res.json(data);

});
});

//starting server
app.listen(PORT, function() {
    console.log("Listening on http://localhost:" + PORT)
})