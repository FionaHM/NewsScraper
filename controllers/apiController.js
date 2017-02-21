var exprhbs = require('express-handlebars'); 
var methodOverride = require("method-override");

// I pass the app in as a parameter - this means i dont need to require express above
function router(app){
	// this tells express what template engine to use and the default template lives (main)
	app.engine('handlebars', exprhbs({defaultLayout: 'main'}));
	// this sets the view engine to handlebars
	app.set('view engine', 'handlebars');

	// Override with POST having ?_method=PUT or DELETE
	app.use(methodOverride("_method"));

	// adds a new item to the database
	app.post("/", function (req, res) {

	})
	// this put command updates an item in the database 
	app.put("/:id", function (req, res) {
		// id is captured from the url as a parameter

	})
	// this delete command removes an item from the database 
	app.delete("/:id", function (req, res) {
		// id is captured from the url as a parameter
	})

	app.get('/', function(req, res){
	})
}

module.exports = router;