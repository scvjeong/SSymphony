// get_meeting
// params['idx_meeting']
exports.dao_get_meeting = function(evt, mysql_conn, params){
	var sql = "SELECT `idx`, `reg_time`, ";
	sql += "`start_time`, ";
	sql += "`end_time` ";
	sql += "FROM `meeting_planning` ";
	sql += "WHERE `idx` = '"+params['idx_meeting']+"' ";
	var query = mysql_conn.query(sql, params, function(err, rows, fields) {
		evt.emit('get_meeting', err, rows);
	});
	return sql;
}

// set_meeting_appraisal
// params['idx_meeting']
// params['idx_group']
// params['idx_user']
// params['satisfaction']
// params['ft_appraisal']
// params['mvp']
exports.dao_set_meeting_appraisal = function(evt, mysql_conn, params){
	params['idx_meeting'] = 60;
	params['idx_group'] = 1;
	params['idx_user'] = 1;

	var sql = "INSERT INTO `meeting_appraisal` ";
	sql += "SET `idx_meeting` = '"+params['idx_meeting']+"', ";
	sql += "`idx_group` = '"+params['idx_group']+"', ";
	sql += "`idx_user` = '"+params['idx_user']+"', ";
	sql += "`satisfaction` = '"+params['satisfaction']+"', ";
	sql += "`ft_appraisal` = '"+params['ft_appraisal']+"', ";
	sql += "`mvp` = '"+params['mvp']+"'";
	var query = mysql_conn.query(sql, params, function(err, rows, fields) {
		evt.emit('set_meeting_appraisal', err, rows);
	});
	return sql;
}

// get_meeting_result
// params['idx_meeting']
// params['idx_group']
exports.dao_get_meeting_result = function(evt, mysql_conn, params){
	params['idx_meeting'] = 19;
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
//	sql += "`E`.`satisfaction`, ";
//	sql += "`E`.`ft_appraisal`, ";
//	sql += "`E`.`mvp`, ";
	sql += "GROUP_CONCAT( DISTINCT `D`.`first_name` ORDER BY `D`.`first_name` ASC SEPARATOR ', ') AS `user_list` ";
	sql += "FROM `meeting_planning` AS `A` ";
	sql += "INNER JOIN `agenda` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_meeting_planning` ";
	sql += "INNER JOIN `relation_user_meeting` AS `C` ";
	sql += "ON `A`.`idx` = `C`.`idx_meeting` ";	
	sql += "INNER JOIN `user` AS `D` ";
	sql += "ON `C`.`idx_user` = `D`.`idx` ";
//	sql += "INNER JOIN `meeting_appraisal` AS `E` ";
//	sql += "ON `A`.`idx` = `E`.`idx_meeting` ";
	sql += "WHERE `A`.`idx` = '"+params['idx_meeting']+"' ";
//	sql += "AND `A`.`idx_owner` = '"+params['idx_group']+"' ";
	sql += "GROUP BY `B`.`idx` ";
	sql += "ORDER BY `B`.`order` ASC";
//console.log(sql);
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('get_meeting_result', err, rows);
	});
	return sql;
}

exports.dao_get_meeting_result_appraisal = function(evt, mysql_conn, params){
	params['idx_meeting'] = 60;
	
	var sql = "SELECT ";
	sql += "`A`.`satisfaction`, ";
	sql += "`A`.`ft_appraisal`, ";
	sql += "`A`.`mvp` ";
	sql += "FROM `meeting_appraisal` AS `A` ";
	sql += "WHERE `A`.`idx_meeting` = '"+params['idx_meeting']+"'";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('get_meeting_result_appraisal', err, rows);
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

// set_meeting_close
// params['idx_meeting']
// params['idx_group']
// params['idx_user']
exports.dao_set_meeting_close = function(evt, mysql_conn, params){
	var sql = "UPDATE `meeting_planning` SET ";
	sql += "`status` = 'closed' ";
	sql += "WHERE `idx` = '"+params['idx_meeting']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('set_meeting_close', err, rows);
	});

	return sql;
}

// set_meeting_save_options
// params['idx_meeting']
// params['idx_group']
// params['idx_tool']
// params['idx_process']
// params['tool_num']
// params['image_value']
exports.dao_set_meeting_save_tools_image = function(evt, mysql_conn, params){
	var sql = "INSERT INTO `tools_image` SET ";
	sql += "`idx_meeting` = '"+params['idx_meeting']+"', ";
	sql += "`idx_group` = '"+params['idx_group']+"', ";
	sql += "`idx_tool` = '"+params['idx_tool']+"', ";
	sql += "`idx_process` = '"+params['idx_process']+"', ";
	sql += "`tool_num` = '"+params['tool_num']+"', ";
	sql += "`image_value` = '"+params['image_value']+"' ";

	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('set_meeting_tools_image', err, rows);
	});

	return sql;
}