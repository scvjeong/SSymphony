/*
 * GET select_meeting_template
 */
var mysql_conn = require('../sql/mysql_server').mysql_conn;

exports.quick_meeting = function(req, res){
	var model = require('../sql/quick_meeting');
	var sql = model.sql_quick_meeting(null,null);
	mysql_conn.query(sql, function(err, rows, fields) {
		if (err) throw err;
		res.render('quick_meeting', {result:rows} );
	});
};

