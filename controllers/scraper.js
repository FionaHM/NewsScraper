var request = require('request');
// Scrapes our HTML
var cheerio = require('cheerio');
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');
var User = require('../models/user.js');
// Make a request call to grab the HTML body from the site of your choice
request("http://www.huffingtonpost.com/", function(error, response, html) {
console.log("running scraper.....");

 var $ = cheerio.load(html);
//   console.log(html);
  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//   var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var result = [];

//   // With cheerio, find each p-tag with the "title" class
//   // (i: iterator. element: the current element)
 $("div.card__content").each(function(i, element) {

    var title = $(element).children('div').eq(0).children('div').eq(1).text();
    var link = $(element).children('a').attr('href');
    var img  = $(element).children('a').eq(0).children('div').find('img').attr('src');
    var credit  = $(element).children('a').eq(0).children('div').text();

    // save to the Article Model in the database
    var newArticle = new Article({
        'title': title,
        'link': link,
        'img' : img,
        'credit': credit,
        'created_at': new Date(),
        'updated_at': new Date()
    }); 

    newArticle.save(function(err){
        // if (err) throw err;
        // console.log( err );

    })
  });

  // Log the result once cheerio analyzes each of its selected elements
//   console.log(result);



});