var mongoose = require('mongoose');
// connect to the database
var connection = mongoose.connect('mongodb://localhost:27017/newsscraperdb');
// export the connection
module.exports = connection;