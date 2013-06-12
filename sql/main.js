// login
// params['id']
// params['pw']
exports.dao_login = function(evt, mysql_conn, params){
	// group
	var sql = "SELECT	`A`.`idx`, `A`.`id`, `A`.`pw`, `A`.`first_name`, `A`.`last_name`, `A`.`position`, `C`.`name` AS `group_name` ";
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

// check_email
// params['id']
exports.dao_check_email = function(evt, mysql_conn, params){
	// group
	var sql = "SELECT	COUNT(*) AS `cnt` ";
	sql += "FROM `user` AS `A` ";
	sql += "WHERE `A`.`id` = '"+params['id']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('check_email', err, rows);
	});
	return sql;
}

// sign_up
// params['id']
// params['pw']
// params['first_name']
// params['last_name']
exports.dao_sign_up = function(evt, mysql_conn, params){
	// group
	var sql = "INSERT INTO `user` ";
	sql += "SET `id` = '"+params['id']+"', ";
	sql += "`pw` = md5('"+params['pw']+"'), ";
	sql += "`first_name` = '"+params['first_name']+"', ";
	sql += "`last_name` = '"+params['last_name']+"', ";
	sql += "`type` = '"+params['type']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('sign_up', err, rows);
	});
	return sql;
}