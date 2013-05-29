// group_select
// params['idx_user']
exports.dao_group_select = function(evt, mysql_conn, params){
	// group
	var sql = "SELECT  ";
	sql += "`C`.`idx`, ";
	sql += "`C`.`subject`, ";
	sql += "`C`.`date`, ";
	sql += "`C`.`start_time`, ";
	sql += "`C`.`end_time`, ";
	sql += "`E`.`name` AS `group_name` ";
	sql += "FROM `user` AS `A` ";
	sql += "LEFT OUTER JOIN `relation_user_meeting` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_user` ";
	sql += "LEFT OUTER JOIN `meeting_planning` AS `C` ";
	sql += "ON `B`.`idx_meeting` = `C`.`idx` ";
	sql += "AND `C`.`idx_owner_type` = 'user' ";
	sql += "LEFT OUTER JOIN `relation_group_meeting` AS `D` ";
	sql += "ON `C`.`idx` = `D`.`idx_meeting` ";
	sql += "LEFT OUTER JOIN `group` AS `E` ";
	sql += "ON `D`.`idx_group` = `E`.`idx` ";
	sql += "WHERE `A`.`idx` = '"+params['idx_user']+"' ";
	sql += "GROUP BY `C`.`idx` ";
	sql += "ORDER BY `E`.`idx` DESC";
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
	sql += "LEFT OUTER JOIN `relation_user_group` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_user` ";
	sql += "LEFT OUTER JOIN `group` AS `C` ";
	sql += "ON `B`.`idx_group` = `C`.`idx` ";
	sql += "LEFT OUTER JOIN `relation_user_group` AS `D` ";
	sql += "ON `D`.`idx_group` = `C`.`idx` ";
	sql += "LEFT OUTER JOIN `user` AS `E` ";
	sql += "ON `D`.`idx_user` = `E`.`idx` ";
	sql += "WHERE `A`.`idx` = '"+params['idx_user']+"' ";
	sql += "GROUP BY `C`.`idx` ";
	sql += "ORDER BY `C`.`idx` DESC";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('group_info', err, rows);
	});
	return sql;
}