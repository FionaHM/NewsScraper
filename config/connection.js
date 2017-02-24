var mongoose = require('mongoose');
// connect to the database
var connection = mongoose.connect(process.env.MONGODB_URI);
// export the connection
module.exports = connection;