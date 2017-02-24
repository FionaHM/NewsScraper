var mongoose = require('mongoose');
// connect to the database
var connection = mongoose.connect('mongodb://heroku_00mfc8pt:igaafs3qlh1cu1nsrfptgkclqn@ds157549.mlab.com:57549/heroku_00mfc8pt');
// export the connection
module.exports = connection;