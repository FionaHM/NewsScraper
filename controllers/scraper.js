var request = require('request');
// Scrapes our HTML
var cheerio = require('cheerio');

// Make a request call to grab the HTML body from the site of your choice
request("http://www.huffingtonpost.com/", function(error, response, html) {


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


//     // Save these results in an object that we'll push into the result array we defined earlier
    result.push({
      'link': link,
      'text': title,
      'img' : img,
      'credit': credit
    });

  });

  // Log the result once cheerio analyzes each of its selected elements
  console.log(result);
});