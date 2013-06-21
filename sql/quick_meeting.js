exports.dao_quick_meeting = function(evt, mysql_conn, params){
	var sql = "SELECT `idx`, `name` FROM `tools` WHERE `use_flag` = 'Y'";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('quick_meeting', err, rows);
	});
	return sql;
}