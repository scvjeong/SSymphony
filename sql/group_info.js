// load_agenda
// params['idx_owner']
// params['idx_owner_type']
// params['idx_meeting_planning']
// params['idx_group']
exports.dao_group_info_member = function(evt, mysql_conn, params){
	// group
	var sql = "SELECT	`C`.`name`, `C`.`idx`, `C`.`position` ";
	sql += "FROM `group` AS `A` INNER JOIN `relation_user_group` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_group` ";
	sql += "INNER JOIN `user` AS `C` ";
	sql += "ON `B`.`idx_user` = `C`.`idx` ";
	sql += "WHERE `A`.`idx` = '"+params['idx_group']+"' ";
	sql += "ORDER BY `C`.`name` ASC";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('group_info_member', err, rows);
	});
	return sql;
}