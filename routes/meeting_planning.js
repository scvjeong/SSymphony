/*
 * GET select_meeting_template
 */
var mysql_conn = require('../sql/mysql_server').mysql_conn;

exports.select_meeting_template = function(req, res){
	var model = require('../sql/meeting_planning');
	var sql = model.sql_select_meeting_template(null,null);
	mysql_conn.query(sql, function(err, rows, fields) {
		if (err) throw err;
		result = rows;
		console.log(result);
		res.render('select_meeting_template', { result: result });
	});
};