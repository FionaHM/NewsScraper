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
		// save to database
		// get the user id - to be saved with the comment
		console.log("req.body.username", req.body.username);
		User.findOne({ username: req.body.username}, function(err, user){
			if (err) {
				console.log("err", err);
			} else if ( user === null ) {
				// create user
				User.create({username: req.body.username}, function(err, newuser) {
					res.json(newuser);
				})
			} else {
				res.json({user});
			}	
		})
		// .populate('comments'); //populate comments not really needed here
	})

	app.post("/comment", function (req, res) {		
		var newComment = new Comment({comment: req.body.comment,
			article: req.body.articleid,
			_creator: req.body.userid});
			console.log("comment:", {comment: req.body.comment,
			article: req.body.articleid,
			_creator: req.body.userid});
		//save coment to newsscraperdb
		newComment.save({}, function(err, newcomment) {
			console.log(newcomment, "newcomment");
			// push to article
			Article.update({ _id: req.body.articleid},
			{ $push: {comments: newcomment._id } }	
			, function(err, numberAffected, raw) {
				console.log("numberAffected", numberAffected)
			})
			// push to user
			User.update({ _id: req.body.userid},
			{ $push: {comments: newcomment._id } }	
			, function(err, numberAffected, raw) {
				console.log("numberAffected", numberAffected)

			})
			var userObj = {username: req.body.username, id: req.body.userid}
			res.redirect('/'+JSON.stringify(userObj));  // reload the page passing the current user data
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


	app.get('/:data', function(req, res){
		// pull in latest articles when user gets
		// console.log(req.params.data._id)
		if (req.params.data){
			// var userArr = req.params.data.split(",");
			var jsonDataObj = (JSON.parse(req.params.data));
			var username = jsonDataObj.username;
			var id = jsonDataObj.id;
			console.log(username, id);
	
			if ((username) && (id)){
				require("./scraper.js");
				// find all the articles and load them on the main page 
				// put most recent articles first -- sort created_at -1
				Article.find({}, function(err, doc){}).sort({created_at: -1})
				.populate('comments')
				.deepPopulate('comments._creator')   //to get the username from _creator field
				.limit(20)
				.exec(function(error, articles){
					res.render("article", {articleObj: articles, userObj: jsonDataObj});
				});
			} else {
				// maybe pass error message object for display
				res.render("index", {});
			}

		} else {
			// maybe pass error message object for display
			res.render("index", {});
		}
	})

	app.use(function(req, res){
		res.render("index", {});

	})

	app.get('/article/:id', function(req, res){
		// pull in latest articles when user gets
		console.log(req.params.id)
		res.end();
	})
}

module.exports = router;