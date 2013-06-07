// group_info
// params['idx_user']
// params['idx_group']
exports.dao_group_info = function(evt, mysql_conn, params){
	var sql = "SELECT  ";
	sql += "`C`.`name` ";
	sql += "FROM `user` AS `A` ";
	sql += "INNER JOIN `relation_user_group` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_user` ";
	sql += "INNER JOIN `group` AS `C` ";
	sql += "ON `B`.`idx_group` = `C`.`idx` ";
	sql += "WHERE `A`.`idx` = '"+params['idx_user']+"' ";
	sql += "AND `C`.`idx` = '"+params['idx_group']+"' ";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('group_info', err, rows);
	});
	return sql;
}
// meeting_list
// params['idx_user']
// params['idx_group']
exports.dao_meeting_list = function(evt, mysql_conn, params){
	var sql = "SELECT  ";
	sql += "`C`.`idx` AS `idx_meeting`, ";
	sql += "`C`.`subject`, ";
	sql += "`C`.`date`, ";
	sql += "`C`.`start_time`, ";
	sql += "`C`.`end_time`, ";
	sql += "`C`.`status` ";
	sql += "FROM `group` AS `A` ";
	sql += "INNER JOIN `relation_group_meeting` AS `B` ";
	sql += "ON `B`.`idx_group` = `A`.`idx` ";
	sql += "INNER JOIN `meeting_planning` AS `C` ";
	sql += "ON `B`.`idx_meeting` = `C`.`idx` ";
	sql += "INNER JOIN `relation_user_meeting` AS `D` ";
	sql += "ON `D`.`idx_meeting` = `C`.`idx` ";
	sql += "INNER JOIN `user` AS `E` ";
	sql += "ON `D`.`idx_user` = `E`.`idx` ";
	sql += "WHERE `E`.`idx` = '"+params['idx_user']+"' ";
	sql += "AND `A`.`idx` = '"+params['idx_group']+"' ";
	sql += "AND `C`.`date` BETWEEN '"+params['start_date']+"' AND '"+params['end_date']+"' ";
	sql += "GROUP BY `C`.`idx` ";
	sql += "ORDER BY `C`.`date` ASC";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('meeting_list', err, rows);
	});
	return sql;
}

exports.dao_meeting_user = function(evt, mysql_conn, params){
	var sql = "SELECT  ";
	sql += "`A`.`first_name`, ";
	sql += "`A`.`last_name`, ";
	sql += "`C`.`idx` AS `idx_meeting` ";
	sql += "FROM `user` AS `A` ";
	sql += "INNER JOIN `relation_user_meeting` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_user` ";
	sql += "INNER JOIN `meeting_planning` AS `C` ";
	sql += "ON `B`.`idx_meeting` = `C`.`idx` ";
	sql += "WHERE `C`.`idx` = '"+params['idx_meeting']+"' ";
	sql += "AND `C`.`date` BETWEEN '"+params['start_date']+"' AND '"+params['end_date']+"' ";
	sql += "ORDER BY `A`.`first_name` DESC";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('meeting_user', err, rows);
	});
	return sql;
}

exports.dao_search_user = function(evt, mysql_conn, params){
	var sql = "SELECT  ";
	sql += "`A`.`idx`, ";
	sql += "`A`.`id`, ";
	sql += "`A`.`first_name`, ";
	sql += "`A`.`last_name` ";
	sql += "FROM `user` AS `A` ";
	sql += "WHERE `A`.`id` like '%"+params['user_id']+"%' ";
	sql += "ORDER BY `A`.`first_name` DESC ";
	sql += "LIMIT 15";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('search_user', err, rows);
	});
	return sql;
}

exports.dao_add_user = function(evt, mysql_conn, params){
	var sql = "INSERT INTO `relation_user_group` ";
	sql += "SET `idx_user` = '"+params['idx_user']+"', ";
	sql += "`idx_group` = '"+params['idx_group']+"' ";
	console.log(sql);
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('add_user', err, rows);
	});
	return sql;
}
