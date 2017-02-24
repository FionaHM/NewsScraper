// var mongoose = require('mongoose');
// // connect to the database
// mongoose.connect('mongodb://localhost:27017/newsscraperdb');
var mongoose = require('../config/connection.js');

var Schema = mongoose.Schema;
// create a Schema
var userSchema = new Schema({
    // _id: Number,
    username: {type : String, required : true, unique : true},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    favorite: [{ type: Schema.Types.ObjectId, ref: 'Article'}],
    created_at: Date,
    updated_at: Date
});

// create a model using this Schema
var User = mongoose.model('User', userSchema);

// export the model
module.exports = User;