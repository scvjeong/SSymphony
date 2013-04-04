var mysql      = require('mysql');
var mysql_conn = mysql.createConnection({
	host     : 'localhost',
	user     : 'lyd',
	password : 'lydlyd123',
	database: 'lyd'
});

module.exports = {
  mysql_conn: mysql_conn
}

/*
	mysql_conn.connect(function(err){
		if(!err)
			console.log("You are connected to the database.");
		else
			throw err;
	});
*/

/*
	mysql_conn.end(function(err){
		if(!err)
			console.log("Mysql connection is terminated.")
		else
			throw err;
	});
*/