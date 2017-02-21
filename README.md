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
The path "/" is routed to a post method in this controller file. 

* PUT requests are routed as follows:
The path "/:id" is routed to a put method in this controller file. 

* DELETE requests are routed as follows:
The path "/:id" is routed to a delete method in this controller file. 


* GET:
A get request is set to serve the base url '/'.  

##   Data: 



##   Views: 

* main.handlebars - this is the default template  and it lives in the views/layouts directory.

* index.handlebars - this is the main page and it is referenced by the  main.handlebars template. It lives in the views directory.


##   Other:

* node_modules                -	folder that contains relevant node modules
* package.json                - 	created when command ‘npm init’ is run.  Can be modified manually to include dependencies data or automatically when ‘npm install <library> --save’ is run e.g. ‘npm install inquirer --save’
* README.md                   - 	this file containing relevant operational information.


##  Integration with other libraries

The following libraries were used and those that are not native to node should be included in package.json.

### package.json should include:

#####`"dependencies": {`
#####`"inquirer": "^2.0.0"`
#####`}`


### body-parser

This library parses incoming request bodies in a middleware, available under the req.body property. Contains modules for JSON, text and URL encoded form.

### express

This is a web framework for node.js.

### express-handlebars
A Handlebars view engine for Express.

### method-override
Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.

### mysql  
A node.js driver for mysql. 



#  License
FriendFinder is released under the MIT license.
