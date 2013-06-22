// group_info
// params['idx_user']
exports.dao_user_info = function(evt, mysql_conn, params){
	var sql = "SELECT  ";
	sql += "`A`.`id`, ";
	sql += "`A`.`first_name`, ";
	sql += "`A`.`last_name` ";
	sql += "FROM `user` AS `A` ";
	sql += "WHERE `A`.`idx` = '"+params['idx_user']+"' ";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('user_info', err, rows);
	});
	return sql;
}