exports.dao_set_meeting_planning = function(evt, mysql_conn, params){
	var sql = "INSERT INTO `meeting_planning` SET `idx_owner` = '1', `idx_owner_type` = 'user', `subject` = '"+params['meeting_subject']+"', `goal` = '"+params['meeting_goal']+"', `date` = '"+params['date']+"', `start_time` = '"+params['meeting_start_time']+"', `end_time` = '"+params['meeting_end_time']+"', `reg_time` = now()";
	var query = mysql_conn.query(sql, params, function(err, rows, fields) {
		evt.emit('query_unit_1', err, rows);
	});
	return sql;
}

exports.dao_set_meeting_planning_agenda = function(evt, mysql_conn, params){
	var sql = "INSERT INTO `agenda` SET `subject` = '"+params['subject']+"', `goal` = '"+params['goal']+"', `start_time` = '"+params['start_time']+"', `end_time` = '"+params['end_time']+"', `order` = '"+params['order']+"'";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('query_unit_2', err, rows);
	});
	return sql;
}

exports.dao_set_meeting_planning_users = function(evt, mysql_conn, params){
	var sql = "INSERT INTO `relation_user_meeting` SET `idx_user` = '"+params['user']+"', `idx_meeting` = '"+params['idx_meeting']+"'";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('query_unit_3', err, rows);
	});
	return sql;
}

// select_meeting_template
// params['idx_owner']
// params['idx_owner_type']
exports.dao_meeting_template = function(evt, mysql_conn, params){
	var sql = "SELECT idx, subject FROM `meeting_planning` WHERE `idx_owner` = '1' AND `idx_owner_type` = 'admin'";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('meeting_template', err, rows);
	});
	return sql;
}

// load_agenda
// params['idx_owner']
// params['idx_owner_type']
// params['idx_meeting_planning']
// params['idx_group']
exports.dao_load_agenda = function(evt, mysql_conn, params){
	// agenda
	var sql = "SELECT	`A`.`idx`, `A`.`subject`, `B`.`subject`, `B`.`goal`, `B`.`start_time`, `B`.`end_time`, `B`.`order` ";
	sql += "FROM `meeting_planning` AS `A` INNER JOIN `agenda` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_meeting_planning` ";
	sql += "WHERE `A`.`idx_owner` = '1' AND `A`.`idx_owner_type` = 'admin' AND `A`.`idx` = '"+params['idx_meeting_planning']+"' ";
	sql += "ORDER BY `B`.`order` ASC";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('setting_agenda', err, rows);
	});
	return sql;
}

exports.dao_load_tools = function(evt, mysql_conn, params){
	var sql = "SELECT `idx`, `name` FROM `tools` WHERE `use_flag` = 'Y'";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('load_tools', err, rows);
	});
	return sql;
}