// load_agenda
// params['id']
// params['pw']
exports.dao_login = function(evt, mysql_conn, params){
	// group
	var sql = "SELECT	`A`.`idx`, `A`.`id`, `A`.`pw`, `A`.`name`, `A`.`position`, `C`.`name` AS `group_name` ";
	sql += "FROM `user` AS `A` ";
	sql += "LEFT OUTER JOIN `relation_user_group` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_user` ";
	sql += "LEFT OUTER JOIN `group` AS `C` ";
	sql += "ON `C`.`idx` = `B`.`idx_group` ";
	sql += "WHERE `A`.`id` = '"+params['id']+"' ";
	sql += "AND `A`.`pw` = md5('"+params['pw']+"') ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('login', err, rows);
	});
	return sql;
}