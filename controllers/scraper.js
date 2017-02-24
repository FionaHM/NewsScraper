var request = require('request');
// Scrapes our HTML
var cheerio = require('cheerio');
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');
var User = require('../models/user.js');

// Make a request call to grab the HTML body from the site of your choice
module.exports = 	function scraper(){

    return new Promise(function(resolve, reject){

      request("http://www.huffingtonpost.com/", function(error, response, html) {
          if (error) reject("Cannot Scrape News Articles.");

            loopHtml(response, html).then(function(count){
                 console.log("in resolving");
              resolve(count);
            }).catch(function(err){
                console.log(err);
                reject(err);
            })

          });
		}).catch(function(err){
        console.log(err);
        reject(err);
		})
}

function loopHtml(response, html){
   return new Promise(function(resolve, reject){
      var $ = cheerio.load(html);  
      var count = 0;
      $("div.card__content").each(function(i, element) {
            // loop thorough the scaped data
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

            // save to database
            newArticle.save(function(err, data, raw) {
              // count the number inserted
              if (data) {
                count++;
                // if we are on the last element then resolve the total added             
                if (i === $("div.card__content").length-1) {
                  resolve(count);
                } 
              } else if (data === undefined) {
                if (i === $("div.card__content").length-1) {
                  resolve(count);
                } 
              }
            })

              
        });
    }).catch(function(err){
        console.log(err);
        reject();
		})
}