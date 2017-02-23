var exprhbs = require('express-handlebars'); 
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');
var User = require('../models/user.js');
// var methodOverride = require("method-override");

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
		User.findOne({ username: req.body.username}, function(err, user){
			if (err) {
				console.log("err", err);
			} else if ( user === null ) {
				// create user
				User.create({username: req.body.username}, function(err, newuser) {
					res.json(newuser);
				})
			} else {
				res.json(user);
			}	
		})
		// .populate('comments'); //populate comments not really needed here
	})

	app.post("/comment", function (req, res) {	
		// capture incoming req data
		var username =  req.body.username;
		var id = req.body.userid;	
		var newComment = new Comment({comment: req.body.comment,
			article: req.body.articleid,
			_creator: req.body.userid});
		//save coment to newsscraperdb
		newComment.save({}, function(err, newcomment) {
			// push to article
			Article.update({ _id: req.body.articleid},
			{ $push: {comments: newcomment._id } }	
			, function(err, numberAffected, raw) {
				console.log("Article Model numberAffected", numberAffected)
			})
			// push to user
			User.update({ _id: req.body.userid},
			{ $push: {comments: newcomment._id } }	
			, function(err, numberAffected, raw) {
				console.log("User model numberAffected", numberAffected)
			})
	
			res.redirect('/'+username+"/"+id);  // reload the page passing the current user data
		})

	})	

	// this put command updates an item in the database 
	app.post("/comment/one", function (req, res) {
		var commentId = req.body.commentId;
		var creatorId = req.body.creatorId;
		var username = req.body.username;
		var userid = req.body.userid;
		// find comment and remove it
		Comment.findOneAndRemove({ _id: commentId }, function(err, comment){
			// push remove to other linked collections
			// push to Article
				Article.update({ _id: comment.article},
				{ $push: {comments: commentId } }	
				, function(err, numberAffected, raw) {
					console.log("Article Model numberAffected", numberAffected)
				})
				// push to user
				User.update({ _id: comment._creator},
				{ $push: {comments: commentId } }	
				, function(err, numberAffected, raw) {
					console.log("User model numberAffected", numberAffected)

				})
			});
			// I send back the user obj as there is no other way to keep track of current user since this
			// doesnt implement user authentication etc. 
			var userObj = {username: username, id: userid};
			res.json(userObj);  // reload the page passing the current user data
	})

	app.get('/:username/:id', function(req, res){
		// pull in latest articles when user gets
		if (req.params.username){
			// parse the object passed as a string in the req param
			var username = req.params.username;
			var id = req.params.id;
			var jsonDataObj = { username: username, id: id};
			// verify that both username and id were captured
			if ((username) && (id)){
				require("./scraper.js");
				// find all the articles and load them on the main page 
				// put most recent articles first -- sort created_at -1
				Article.find({}, function(err, doc){}).sort({created_at: -1})
				.populate('comments')
				.deepPopulate('comments._creator')   //to get the username from _creator field
				.limit(20)
				.exec(function(error, articles){
					// send the data back for display
					var outputObj = {"articleObj": articles, "userObj": jsonDataObj};
					res.render("article", outputObj);
				});
			} else {
				// maybe pass error message object for display
				var errorMsg = {msg: "Something went wrong - please try again."};
				res.render("index", { errorObj: errorMsg});
			}

		} else {
			// maybe pass error message object for display
			var errorMsg = "Something went wrong - please try again.";
			res.render("index", { errorObj: errorMsg});
		}
	})

	app.use(function(req, res){
		res.render("index", {});
	})


}

module.exports = router;