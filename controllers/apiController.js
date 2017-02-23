var exprhbs = require('express-handlebars'); 
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');
var User = require('../models/user.js');
var methodOverride = require("method-override");

// I pass the app in as a parameter - this means i dont need to require express above
function router(app){
	// this tells express what template engine to use and the default template lives (main)
	app.engine('handlebars', exprhbs({defaultLayout: 'main'}));
	// this sets the view engine to handlebars
	app.set('view engine', 'handlebars');

	// Override with POST having ?_method=PUT or DELETE
	app.use(methodOverride("_method"));

	// check if new or existing user
	app.post("/user", function (req, res) {
		// save to database
		// get the user id - to be saved with the comment
		// console.log("req.body.username", req.body.username);
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
				console.log("Article Model numberAffected", numberAffected)
			})
			// push to user
			User.update({ _id: req.body.userid},
			{ $push: {comments: newcomment._id } }	
			, function(err, numberAffected, raw) {
				console.log("User model numberAffected", numberAffected)

			})
			var userObj = {username: req.body.username, id: req.body.userid}
			res.redirect('/'+JSON.stringify(userObj));  // reload the page passing the current user data
		})

	})	

	// this put command updates an item in the database 
	app.post("/comment/one", function (req, res) {
		var commentId = req.body.commentId;
		var creatorId = req.body.creatorId;
		var username = req.body.username;
		var userid = req.body.userid;
		// console.log(commentId, creatorId, "comment and crator" );
		// delete one comment
		//  Comment.find({ _id: commentId });
			// 	var newComment = new Comment({comment: req.body.comment,
			// article: req.body.articleid,
			// _creator: req.body.userid});
		Comment.findOneAndRemove({ _id: commentId }, function(err, comment){
			// console.log(comment, "comment");
			// findComment.remove(function(err, result) {
				// ActionCtrl.saveRemove(result, callback);
		    //    console.log("result", result);
			// push to ref in other collections
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

			console.log("userObj comment del", userObj);
			var userObj = {username: username, id: userid};
			res.json(userObj);  // reload the page passing the current user data
	})

var x = 0;
	app.get('/:data', function(req, res){
		// pull in latest articles when user gets
		// console.log(req.params.data._id)
		if (req.params.data){
			// var userArr = req.params.data.split(",");
			var jsonDataObj = (JSON.parse(decodeURI(req.params.data)));
			// var jsonDataObj = JSON.parse(decodeURI(req.params.data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"'))
			var username = jsonDataObj.username;
			var id = jsonDataObj.id;
			x++;
			console.log("this one", username, id, "x" , x);
	
			if ((username) && (id)){
				require("./scraper.js");
				// find all the articles and load them on the main page 
				// put most recent articles first -- sort created_at -1
				Article.find({}, function(err, doc){}).sort({created_at: -1})
				.populate('comments')
				.deepPopulate('comments._creator')   //to get the username from _creator field
				.limit(20)
				.exec(function(error, articles){
					
					var outputObj = {"articleObj": articles, "userObj": jsonDataObj};
					// console.log("outputObj", outputObj.userObj.id);
					res.render("article", outputObj);
				});
			} else {
				// maybe pass error message object for display
				var errorMsg = "Something went wrong - please try again.";
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

	// app.get('/article/:id', function(req, res){
	// 	// console.log(req.params.id)
	// 	res.end();
	// })
}

module.exports = router;