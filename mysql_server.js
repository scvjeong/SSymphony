var mysql      = require('mysql');
var mysql_conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'lyd',
  password : 'lydlyd123',
});

var connect = mysql_conn.connect(function(err){
  if(!err)
        console.log("You are connected to the database.");
  else
        throw err;
});

var end = mysql_conn.end(function(err){
  if(!err)
        console.log("Mysql connection is terminated.")
  else
        throw err;
});

module.exports = {
  connect: connect,
  mysql_conn: mysql_conn,
  end: end,
}

/*
mysql_conn.connect(function(err){
	if (err) throw err;
});

mysql_conn.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});

mysql_conn.end(function(err){
	if (err) throw err;
});
*/