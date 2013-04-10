exports.dao_begin_work = function(evt, mysql_conn){
	var sql = "BEGIN WORK;";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('begin_work', err, rows);
	});
	return sql;
}

exports.dao_commit = function(evt, mysql_conn){
	var sql = "COMMIT;";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('commit', err, rows);
	});
	return sql;
}

exports.dao_rollback = function(evt, mysql_conn){
	var sql = "ROLLBACK;";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('rollback', err, rows);
	});
	return sql;
}