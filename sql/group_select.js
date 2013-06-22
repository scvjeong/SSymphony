// check_group_name
// params['group_name']
exports.dao_check_group_name = function(evt, mysql_conn, params){
	// group
	var sql = "SELECT	COUNT(*) AS `cnt` ";
	sql += "FROM `group` AS `A` ";
	sql += "WHERE `A`.`name` = '"+params['group_name']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('check_group_name', err, rows);
	});
	return sql;
}

// new_group
// params['group_name']
exports.dao_new_group = function(evt, mysql_conn, params){
	// group
	var sql = "INSERT INTO `group` ";
	sql += "SET `name` = '"+params['group_name']+"'";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('new_group', err, rows);
	});
	return sql;
}

// set_relation_user_group
// params['idx_group']
// params['idx_user']
exports.dao_set_relation_user_group = function(evt, mysql_conn, params){
	// group
	var sql = "INSERT INTO `relation_user_group` ";
	sql += "SET `idx_user` = '"+params['idx_user']+"', ";
	sql += "`idx_group` = '"+params['idx_group']+"' ";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('set_relation_user_group', err, rows);
	});
	return sql;
}

// group_select
// params['idx_user']
exports.dao_group_select = function(evt, mysql_conn, params){
	// group
	var sql_for_date;
	if( params['start_date'] && params['end_date'] )
		sql_for_date = "AND `C`.`date` BETWEEN '"+params['start_date']+"' AND '"+params['end_date']+"' ";
	else
		sql_for_date = "";
	var sql = "SELECT  ";
	sql += "`C`.`idx` AS `idx_meeting`, ";
	sql += "`C`.`subject`, ";
	sql += "`C`.`date`, ";
	sql += "`C`.`start_time`, ";
	sql += "`C`.`end_time`, ";
	sql += "`C`.`status`, ";
	sql += "`A`.`name` AS `group_name` ";
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
	sql += sql_for_date;
	sql += "GROUP BY `C`.`idx` ";
	sql += "ORDER BY `A`.`idx` ASC";
	/*
	var sql = "SELECT  ";
	sql += "`D`.`idx`, ";
	sql += "`D`.`subject`, ";
	sql += "`D`.`date`, ";
	sql += "`D`.`start_time`, ";
	sql += "`D`.`end_time`, ";
	sql += "`E`.`name` AS `group_name` ";
	sql += "FROM `user` AS `A` ";
	sql += "INNER JOIN `relation_user_group` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_user` ";
	sql += "INNER JOIN `relation_group_meeting` AS `C` ";
	sql += "ON `B`.`idx_group` = `C`.`idx_group` ";
	sql += "INNER JOIN `meeting_planning` AS `D` ";
	sql += "ON `C`.`idx_meeting` = `D`.`idx` ";
	sql += "AND `D`.`idx_owner_type` = 'user' ";
	sql += "INNER JOIN `group` AS `E` ";
	sql += "ON `B`.`idx_group` = `E`.`idx` ";
	sql += "WHERE `A`.`idx` = '"+params['idx_user']+"' ";
	sql += "AND `D`.`date` BETWEEN '"+params['start_date']+"' AND '"+params['end_date']+"' ";
	sql += "GROUP BY `D`.`idx` ";
	sql += "ORDER BY `A`.`idx` ASC";
	*/
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('group_select', err, rows);
	});
	return sql;
}

// group_info
// params['idx_user']
exports.dao_group_info = function(evt, mysql_conn, params){
	var sql = "SELECT  ";
	sql += "`A`.`id`, ";
	sql += "`A`.`first_name`, ";
	sql += "`A`.`last_name`, ";
	sql += "`C`.`idx`, ";
	sql += "`C`.`name` AS `group_name`, ";
	sql += "GROUP_CONCAT( DISTINCT CONCAT(`E`.`first_name`,  ' ',  `E`.`last_name`) ORDER BY `E`.`first_name` ASC SEPARATOR ',') AS `user_list` ";
	sql += "FROM `user` AS `A` ";
	sql += "INNER JOIN `relation_user_group` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_user` ";
	sql += "INNER JOIN `group` AS `C` ";
	sql += "ON `B`.`idx_group` = `C`.`idx` ";
	sql += "INNER JOIN `relation_user_group` AS `D` ";
	sql += "ON `D`.`idx_group` = `C`.`idx` ";
	sql += "INNER JOIN `user` AS `E` ";
	sql += "ON `D`.`idx_user` = `E`.`idx` ";
	sql += "WHERE `A`.`idx` = '"+params['idx_user']+"' ";
	sql += "GROUP BY `C`.`idx` ";
	sql += "ORDER BY `C`.`idx` ASC";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('group_info', err, rows);
	});
	return sql;
}