// var mongoose = require('mongoose');
// // connect to the database
// mongoose.connect('mongodb://localhost:27017/newsscraperdb');
var mongoose = require('../config/connection.js');
// CHANGE from 1.x: need to pass in mongoose instance
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Schema = mongoose.Schema;
// create a Schema
var newsSchema = new Schema({
    // _id: Number,
    title: {type : String, required : true, unique : true},
    link: {type : String, required : true, unique : true},
    img: String,
    credit: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    // users: [{ type: Schema.Types.ObjectId, ref: 'User'},{unique : true}],
    created_at: Date,
    updated_at: Date
});

// newsSchema.index({following: 1}, {unique: true, dropDups: true});


newsSchema.plugin(deepPopulate, {
  whitelist: [
    'comments._creator'
  ]
});
// create a model using this Schema
var Article = mongoose.model('Article', newsSchema);

// export the model
module.exports = Article;