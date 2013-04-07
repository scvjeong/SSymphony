/*
 * GET select_meeting_template
 */
var mysql_conn = require('../sql/mysql_server').mysql_conn;

exports.meeting_template = function(req, res){
	var model = require('../sql/meeting_planning');
	var sql = model.sql_meeting_template(null,null);
	mysql_conn.query(sql, function(err, rows, fields) {
		if (err) throw err;
		res.render('select_meeting_template', {result:rows} );
	});
};

exports.setting_agenda = function(req, res){
	var model = require('../sql/meeting_planning');
	var sql = model.sql_load_agenda(null,null, 1);
	mysql_conn.query(sql, function(err, rows, fields) {
		if (err) throw err;
		console.log(rows);
		res.render('setting_agenda', {result:rows} );
	});
};

exports.setting_agenda_step = function(req, res){
	res.render('setting_agenda_step');
};

