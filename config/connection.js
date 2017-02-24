var mongoose = require('mongoose');
// connect to the database
var connection = mongoose.connect('MONGODB_URI');
// export the connection
module.exports = connection;