var exprhbs = require('express-handlebars'); 
var Article = require('../models/article.js');
var Comment = require('../models/comment.js');
var User = require('../models/user.js');
var scraper = require("./scraper.js");
// var methodOverride = require("method-override");

// I pass the app in as a parameter - this means i dont need to require express above
function router(app){
	// this tells express what template engine to use and the default template lives (main)
	app.engine('handlebars', exprhbs({defaultLayout: 'main'}));
	// this sets the view engine to handlebars
	app.set('view engine', 'handlebars');
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
	})

	// saves a new comment document to the comments collection in the database
	// also updates links in other referenced tables Article and User
	app.post("/comment", function (req, res) {	
		// capture incoming req data
		var username =  req.body.username;
		var id = req.body.userid;	
		if (req.body.comment !== ""){
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
				res.redirect('/article/'+username+"/"+id);  // reload the page passing the current user data
			})
		}
		

	})	

	// this saves the object id of an article to the articles field of a document in the user collection
	app.post("/article/id", function (req, res) {
		console.log(req.body);
		var articleId = req.body.article;
		var username = req.body.username;
		var userid = req.body.userid;
	
		// find user and verify article not already saved 
		User.findOne({ _id: userid}, function(err, user){
			if (user.articles.indexOf(articleId) > -1){
				// if there already don't push
				res.json("already saved");
			} else {
				User.findOneAndUpdate({ _id: userid},  { $push: {articles: articleId } } ,function(err, user){
					console.log(user);
					res.json("saved");
				});
			}	
		});

	})


    // this route removes a referenced article from a user document in the user collection 
	app.post("/article/id/one", function (req, res) {
		var articleId = req.body.article;
		var username = req.body.username;
		var userid = req.body.userid;	
		// find user and verify if article already saved to user table
		User.findOne({ _id: userid}, function(err, user){
			// if found then delete from the array using pull command
			if (user.articles.indexOf(articleId) > -1){
				User.findOneAndUpdate({ _id: userid}, {$pull :{articles: articleId } },function(err, user){
					res.json("removed");
				});
			} else {
				res.json("already removed");
			}
		});
	})


    // this route removes a referenced article from a user document in the user collection 
	app.post("/article/id/favorite", function (req, res) {
		var articleId = req.body.article;
		var username = req.body.username;
		var userid = req.body.userid;	
		// find user and verify if article already saved to user table
		User.findOne({ _id: userid}, function(err, user){
			// if found then delete from the array using pull command
			if (user.articles.indexOf(articleId) > -1){
				User.findOneAndUpdate({ _id: userid}, {$pull :{articles: articleId } },function(err, user){
					// console.log("/userarticle/"+username+"/"+userid);
					res.json({username: username, userid: userid});
				});
			} 
		});
	})
	// this put command deletes one comment document from the database collection
	// already verified on client side that user == creator
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
				{ $pull: {comments: commentId } }	
				, function(err, numberAffected, raw) {
					console.log("Article Model numberAffected", numberAffected)
				})
				// push to user
				User.update({ _id: comment._creator},
				{ $pull: {comments: commentId } }	
				, function(err, numberAffected, raw) {
					console.log("User model numberAffected", numberAffected)

				})
			});
			// I send back the user obj as there is no other way to keep track of current user since this
			// doesnt implement user authentication etc. 
			var userObj = {username: username, id: userid};
			res.json(userObj);  // reload the page passing the current user data
	})

	// this route gets all articles from the scraped website, saves new ones and updates the page
	app.get('/article/:username/:id', function(req, res){
		// pull in latest articles when user gets
		if (req.params.username){
			// parse the object passed as a string in the req param
			var username = req.params.username;
			var id = req.params.id;
			var jsonDataObj = { username: username, id: id};
			// verify that both username and id were captured
			if ((username) && (id)){
				// scrapes and saves documents
				scraper().then(function(count){
					var newArticles = count;
					Article.find({}, function(err, doc){}).sort({created_at: -1})
						.populate('comments')
						// .populate('users')
						.deepPopulate('comments._creator')   //to get the username from _creator field
						// .limit(20)s
						.exec(function(error, articles){
							// send the data back for display
							var outputObj = {"articleObj": articles, "userObj": jsonDataObj,"newArticles" : newArticles};
							res.render("article", outputObj);
					});

				}).catch(function(err){
					console.log(err);
				})

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

	// This route gets the users stored articles along with all the associated comments
	app.get('/userarticle/:username/:id', function(req, res){
		if (req.params.username){
			// parse the object passed as a string in the req param
			var username = req.params.username;
			var id = req.params.id;
			var jsonDataObj = { username: username, id: id};
			// verify that both username and id were captured before proceeding.
			if ((username) && (id)){	
				// find user saved articles - most recent first
				User.find({_id: id}, function(err, user){}).sort({created_at: -1})
					.exec(function(error, user){			
						// get all user saved articles in the results array by querying the articles model
						Article.find({ _id: { $in: user[0].articles } }, function(error, article){

						}).populate('comments')
						.deepPopulate('comments._creator')   //to get the username from _creator field
						// .limit(20)s
						.exec(function(error, articles){
							var outputObj = {"articleObj": articles, "userObj": jsonDataObj};
							res.render("favourite", outputObj);
					});

						
				}).catch(function(err){
					console.log(err);
				})

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