var exprhbs = require('express-handlebars'); 
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');
var User = require('../models/user.js');
// var methodOverride = require("method-override");
// var mongoose = require('mongoose');

// connect to the database
// mongoose.connect('mongodb://localhost:27017/newsscraperdb');
// I pass the app in as a parameter - this means i dont need to require express above
function router(app){
	// this tells express what template engine to use and the default template lives (main)
	app.engine('handlebars', exprhbs({defaultLayout: 'main'}));
	// this sets the view engine to handlebars
	app.set('view engine', 'handlebars');

	// Override with POST having ?_method=PUT or DELETE
	// app.use(methodOverride("_method"));

	// check if new or existing user
	app.post("/user", function (req, res) {
		// console.log(req.body.comment);
		// save to database

		// get the user id - to be saved with the comment
		User.findOne({ username: req.body.username}, function(err, user){
			if (err) {
				console.log("err", err);
			} else if ( user === null ) {
				// create user
				// var newuser = new User({name: req.body.username});
				console.log(req.body.username);
				User.create({username: req.body.username}, function(err, newuser) {
					// var userObj = {
					// 	"id": newuser.id,
					// 	"username": newuser.username
					// }
					// console.log(err);
					console.log("newuser", newuser);
					res.json(newuser);

				})
			} else {
				console.log(user);
				// var userObj = {
				// 	"id": user.id,
				// 	"username": user.username
				// }
				res.json({
					"id": user._id,
					"username": user.username
				});
			}
	
		})
	})

	app.post("/comment", function (req, res) {
		console.log(req.body.userid,"userid");
		//save coment to newsscraperdb
		Comment.create({
			comment: req.body.comment,
			article: req.body.articleid,
			_creator: req.body.userid}, function(err, newcomment) {
						console.log(newcomment, "newcomment");
					    Article.update({ _id: req.body.articleid},
						{ $push: {comments: newcomment._id } }
							
						, function(err, numberAffected, raw) {
							console.log("numberAffected", numberAffected)

						})
	
					// console.log("newcomment", newcomment);
					// res.redirect(/);
					console.log(err);

			})

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
		// pull in latest articles when user gets
		require("./scraper.js");
		// find all the articles and load them on the main page 
		// put most recent articles first -- sort created_at -1
		Article.find({}, function(err, doc){
			console.log(doc);
			res.render("index", {articleObj: doc});
		}).sort({created_at: -1})
		.populate('comments')
		.limit(20);

	})

	app.get('/article/:id', function(req, res){
		// pull in latest articles when user gets
		console.log(req.params.id)
		res.end();
		// require("./scraper.js");
		// // find all the articles and load them on the main page 
		// // put most recent articles first -- sort created_at -1
		// Article.find({}, function(err, doc){
		// 	res.render("index", {articleObj: doc});
		// }).sort({created_at: -1})
		// .limit(20);

	})
}

module.exports = router;