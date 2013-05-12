// get_meeting_result
// params['idx_meeting']
// params['idx_group']
exports.dao_get_meeting_result = function(evt, mysql_conn, params){
	params['idx_meeting'] = 60;
	params['idx_group'] = 1;
	
	var sql = "SELECT ";
	sql += "`A`.`idx`, ";
	sql += "`A`.`subject`, ";
	sql += "`A`.`goal`, ";
	sql += "`A`.`start_time`, ";
	sql += "`A`.`end_time`, ";
	sql += "`B`.`subject` AS `agenda_subject`, ";
	sql += "`B`.`goal` AS `agenda_goal`, ";
	sql += "`B`.`start_time` AS `agenda_start_time`, ";
	sql += "`B`.`end_time` AS `agenda_end_time`, ";
	sql += "`B`.`order`, ";
	sql += "`E`.`satisfaction`, ";
	sql += "`E`.`ft_appraisal`, ";
	sql += "`E`.`mvp`, ";
	sql += "GROUP_CONCAT( DISTINCT `D`.`name` ORDER BY `D`.`name` ASC SEPARATOR ', ') AS `user_list`, ";
	sql += "GROUP_CONCAT( `C`.`appraisal` ORDER BY `D`.`name` ASC SEPARATOR ', ') AS `user_appraisal` ";
	sql += "FROM `meeting_planning` AS `A` ";
	sql += "INNER JOIN `agenda` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_meeting_planning` ";
	sql += "INNER JOIN `relation_user_meeting` AS `C` ";
	sql += "ON `A`.`idx` = `C`.`idx_meeting` ";	
	sql += "INNER JOIN `user` AS `D` ";
	sql += "ON `C`.`idx_user` = `D`.`idx` ";
	sql += "INNER JOIN `meeting_appraisal` AS `E` ";
	sql += "ON `A`.`idx` = `E`.`idx_meeting` ";
	sql += "WHERE `A`.`idx` = '"+params['idx_meeting']+"' ";
	sql += "AND `A`.`idx_owner` = '"+params['idx_group']+"' ";
	sql += "GROUP BY `B`.`idx` ";
	sql += "ORDER BY `B`.`order` ASC";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('get_meeting_result', err, rows);
	});
	return sql;
}

// set_meeting_save_data
// params['idx_meeting']
// params['idx_group']
// params['idx_tool']
// params['delimiter']
// params['key']
// params['parent']
// params['value']
// params['type']
// params['client']
exports.dao_set_meeting_save_data = function(evt, mysql_conn, params){
	var sql = "INSERT INTO `tools_data` SET ";
	sql += "`idx_meeting` = '"+params['idx_meeting']+"', ";
	sql += "`idx_group` = '"+params['idx_group']+"', ";
	sql += "`idx_tool` = '"+params['idx_tool']+"', ";
	sql += "`delimiter` = '"+params['delimiter']+"', ";
	sql += "`key` = '"+params['key']+"', ";
	sql += "`parent` = '"+params['parent']+"', ";
	sql += "`value` = '"+params['value']+"', ";
	sql += "`type` = '"+params['type']+"', ";
	sql += "`client` = '"+params['client']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('set_meeting_save_data', err, rows);
	});

	return sql;
}

// set_meeting_save_options
// params['idx_meeting']
// params['idx_group']
// params['idx_tool']
// params['delimiter']
// params['key']
// params['parent']
// params['value']
// params['type']
// params['client']
exports.dao_set_meeting_save_options = function(evt, mysql_conn, params){
	var sql = "INSERT INTO `tools_data` SET ";
	sql += "`idx_meeting` = '"+params['idx_meeting']+"', ";
	sql += "`idx_group` = '"+params['idx_group']+"', ";
	sql += "`idx_tool` = '"+params['idx_tool']+"', ";
	sql += "`delimiter` = '"+params['delimiter']+"', ";
	sql += "`key` = '"+params['key']+"', ";
	sql += "`parent` = '"+params['parent']+"', ";
	sql += "`value` = '"+params['value']+"', ";
	sql += "`type` = '"+params['type']+"', ";
	sql += "`client` = '"+params['client']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('set_meeting_save_options', err, rows);
	});

	return sql;
}