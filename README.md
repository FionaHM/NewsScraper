#NewsScraper
GitHub: 
https://github.com/FionaHM/NewsScraper

## About this application


## Usage

The application is started on the commandline as follows:
######`> node server.js`


#  Files

## Application Entry:

### server.js 

This is the server side process. It is a node application, specifically express.js.  When this file is started up on the command line it starts an express.js server that listens on a predefined port for client connections. It then routes the connections based on the configuration data set in the controllers/apiController.js file.  This server file also contains middleware information, in the form of the library body-parser, that parses incoming data to the required format.

###  controller/apiController.js

This contains routing information for incoming url.

* POST requests are routed as follows: 
 
	// this put command deletes one Comment document from the Comment collection in the database
	app.post("/comment/one", function (req, res) {
		
	})

    // this removes saved Article from User in the database 
	app.post("/article/id/one", function (req, res) {

	})

    // this route removes a referenced Article from a User document in the User collection 
	app.post("/article/id/one", function (req, res) {	

    })


    // this route saves the object id of an Article to the articles field of a document in the User collection
	app.post("/article/id", function (req, res) {

    })

    // saves a new Comment document to the Comments collection in the database
	// also updates links in other referenced tables Article and User
	app.post("/comment", function (req, res) {

    })
    
    // finds an exising user or creates a new on in the User collection in the database
    app.post("/user", function (req, res) {

    })


* GET:
The path '/article/user/:username/:id' routes a user to their favourite saved news articles.  The username and id are passed as paramenters - this is to track user in the absence of any other implemented authentication.

app.get('/article/user/:username/:id', function(req, res){}

This path 'article/:username/:id' routes a user to a page with a link to update the news articles displayed. The database is updated with new news links when the user clicks a button, the results are displayed on the page along with any associated comments. 

app.get('/article/:username/:id', function(req, res){})


###  controller/scraper.js
This module performs the scraping using the npm request library and parses the html using the npm cheerio library. 

##   Data: 
There are three data models:
# User
Stores user related data.
# Article
Stores the scraped data.
# Comment
Stores user comments.



##   Views: 

* main.handlebars - this is the default template and it lives in the views/layouts directory.

* index.handlebars - this is the main page where the user enters their name and it is referenced by the main.handlebars template. It lives in the views directory.

* article.handlebars - this is where the news articles are displayed and where the user can add comments.  It lives in the views directory.

* favourite.handlebars - this is where the users saved articles and their related stored comments are displayed. It lives in the views directory.

##   Other:

* node_modules                -	folder that contains relevant node modules
* package.json                - 	created when command ‘npm init’ is run.  Can be modified manually to include dependencies data or automatically when ‘npm install <library> --save’ is run e.g. ‘npm install inquirer --save’
* README.md                   - 	this file containing relevant operational information.





#  License
FriendFinder is released under the MIT license.
