exports.dao_help = function(evt, mysql_conn, params){
	var sql = "SELECT	`A`.`name`, `A`.`contents` ";
	sql += "FROM `help` AS `A` ";
	sql += "WHERE `A`.`use_flag` = 'Y' ";
	sql += "ORDER BY `A`.`order` ASC";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('help', err, rows);
	});
	return sql;
}