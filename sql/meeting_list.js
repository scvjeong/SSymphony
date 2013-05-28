// meeting_list
// params['idx_user']
// params['idx_group']
exports.dao_meeting_list = function(evt, mysql_conn, params){
	var sql = "SELECT  ";
	sql += "`E`.`idx` AS `idx_meeting`, ";
	sql += "`E`.`subject`, ";
	sql += "`E`.`date`, ";
	sql += "`E`.`start_time`, ";
	sql += "`E`.`end_time` ";
	sql += "FROM `user` AS `A` ";
	sql += "INNER JOIN `relation_user_group` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_user` ";
	sql += "INNER JOIN `group` AS `C` ";
	sql += "ON `B`.`idx_group` = `C`.`idx` ";
	sql += "INNER JOIN `relation_group_meeting` AS `D` ";
	sql += "ON `D`.`idx_group` = `C`.`idx` ";
	sql += "INNER JOIN `meeting_planning` AS `E` ";
	sql += "ON `D`.`idx_meeting` = `E`.`idx` ";
	sql += "WHERE `A`.`idx` = '"+params['idx_user']+"' ";
	sql += "AND `C`.`idx` = '"+params['idx_group']+"' ";
	sql += "AND `E`.`date` BETWEEN '"+params['start_date']+"' AND '"+params['end_date']+"' ";
	sql += "GROUP BY `E`.`idx` ";
	sql += "ORDER BY `E`.`date` DESC";
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