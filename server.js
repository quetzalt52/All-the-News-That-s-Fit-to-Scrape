// Dependencies
var path = require("path");
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser")
var logger = require("morgan");
var mongoose = require("mongoose");
// Require mongoose and mongodb objectid
var ObjectId = require("mongojs").ObjectID;


// Requiring our Newsfeed and Headlines models
var Note = require("./models/Newsfeed.js");
var Article = require("./models/Headlines.js");

// Our scraping tools
var request = require('request');
var cheerio = require('cheerio');

// Require handlebars
var exphbs = require("express-handlebars");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();
// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Set up a static folder (public) for our web app
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration
mongoose.connect("mongodb://localhost/");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


//ROUTES

// Scrape data when app starts

app.get("/scrape", function(req, res) {

  request("http://www.eastbaytimes.com/", function(error, response,html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "new-content-block" class
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title =  $(this).children("a").text();
      result.summary = $(this).children("div").text();
      result.articleURL = $(this).children("a").attr("href");
      result.imgURL = $a.children("img").attr("src");

      //we need to use the newsfeed to create an entry
      var entry = new Newsfeed(result);

      // saving the entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB
app.get("/article", function(req, res) {
  Newsfeed.find({}, function(error, doc) {
    if (error){
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });

});
    // This will grab an article by it's ObjectId
app.get("/article/:id", function(req, res) {
  // route to find one article using req.params
  Newsfeed.findOne({"_id": req.params.id})
  //populate method
  .populate("feeds")
  //if there is an error send to 
  .exec(function(error, doc) {
  //logs if there are any errors
    if(error) {
      console.log(error);
    }
    //otherwise send the doc to the browser as a json object
    // then responds with the newsfeed
    else {
      res.json(doc);
    }
  });
});

// Create or replace an existing newsfeed
app.post("/article/:id", function(req, res) {

  var newHeadlines = new Headlines(req.body);
  
  newHeadlines.save(function(error, doc){
    if (error) {
      console.log(error);
    }
    else {
      Newsfeed.findOneAndUpdate({"_id": req.params.id}, {"feeds": doc._id})
      .exec(function(err, doc) {
          //log any errors
          if (err) {
            console.log(err);
          }
          else {
            res.send(doc);
          }
        });
      }
    });
  });
  // Listen on port 3000
  app.listen(3000, function() {
  console.log("App running on port 3000!");
  });
  /*};
    // Save the div and a tag
      var $a = $(this).children('a');
      var $div = $(this).children('div');
      // Save the article url
      var articleURL = $a.attr('href');
      // Save the img url of each element
      var imgURL = $a.children('img').attr('src');
      // Save the title text
      var title = $div.children('h4').text();
      // Save the synopsis text
      var summary = $div.children('p').text();
      // Create mongoose model
      var scrapedData = new ScrapedData({
        title: title,
        summary: summary,
        articleURL: articleURL,
        imgURL: imgURL
      });
      // Save data
      scrapedData.save(function(err) {
        if (err) {
          //console.log(err);
        }
        //console.log('Saved');
      });
    });
  
 
  // Main route send main page
app.get('/', function(req, res) {
  scrapedData
    .findOne()
    .exec(function(err,data) {
      if (err) return console.error(err);
      // If successful render first data
      res.render('index', {

        title: data.title,
        summary: data.summary,
        _id: data._id,
        articleURL: data.articleURL,
        imgURL: data.imgURL
      });
    })
});

*/