// var mongoose = require('mongoose');
// // connect to the database
// mongoose.connect('mongodb://localhost:27017/newsscraperdb');
var mongoose = require('../config/connection.js');

var Schema = mongoose.Schema;
// create a Schema
var commentSchema = new Schema({
    // _id: Number,
    comment: {type : String, required : true, unique : false},
    article: [{type : Schema.Types.ObjectId, ref: 'Article'}],
    _creator: {type : Schema.Types.ObjectId, ref: 'User'},  // ref id in user
    created_at: Date,
    updated_at: Date
});

// create a model using this Schema
var Comment = mongoose.model('Comment', commentSchema);

// export the model
module.exports = Comment;