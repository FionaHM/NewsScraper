var mysql      = require('mysql');
var connection;

if (process.env.JAWSDB_URL){
	connection = mysql.createConnection(process.env.JAWSDB_URL)
} else {
	connection =mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'burgers_db'
	});
}
// connect to the database
connection.connect();
// test the connection
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
});
// share the connection with other modules
module.exports = connection;