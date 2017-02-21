var mongoose = require('mongoose');
// connect to the database
mongoose.connect('mongodb://localhost:27017/newsscraperdb');

var Schema = mongoose.Schema;
// create a Schema
var newsSchema = new Schema({
    title: {type : String, required : true, unique : true},
    link: {type : String, required : true, unique : true},
    img: String,
    credit: String,
    created_at: Date,
    updated_at: Date
});

// create a model using this Schema
var Article = mongoose.model('Article', newsSchema);

// export the model
module.exports = Article;