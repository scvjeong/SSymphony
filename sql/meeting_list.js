// load_agenda
// params['idx_user']
// params['idx_group']
exports.dao_meeting_list = function(evt, mysql_conn, params){
	// group
	var sql = "SELECT	`A`.`idx`, `A`.`subject`, `A`.`goal`, `A`.`date`, `A`.`start_time`, `A`.`end_time`,  ";
	sql += "GROUP_CONCAT( DISTINCT `G`.`first_name` ORDER BY `G`.`first_name` ASC SEPARATOR ', ') AS `user_list` ";
	sql += "FROM `meeting_planning` AS `A` ";
	sql += "INNER JOIN `relation_user_meeting` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_meeting` ";
	sql += "INNER JOIN `user` AS `C` ";
	sql += "ON `B`.`idx_user` = `C`.`idx` ";
	sql += "INNER JOIN `relation_user_group` AS `D` ";
	sql += "ON `C`.`idx` = `D`.`idx_user` ";
	sql += "INNER JOIN `group` AS `E` ";
	sql += "ON `D`.`idx_user` = `E`.`idx` ";
	sql += "INNER JOIN `relation_user_meeting` AS `F` ";
	sql += "ON `A`.`idx` = `F`.`idx_meeting` ";
	sql += "INNER JOIN `user` AS `G` ";
	sql += "ON `F`.`idx_user` = `G`.`idx` ";
	sql += "WHERE `E`.`idx` = '"+params['idx_group']+"' ";
	sql += "AND `C`.`idx` = '"+params['idx_user']+"' ";
	sql += "AND `A`.`idx_owner_type` = 'user' ";
	sql += "GROUP BY `A`.`idx` ";
	sql += "ORDER BY `A`.`date` DESC";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('meeting_list', err, rows);
	});
	return sql;
}