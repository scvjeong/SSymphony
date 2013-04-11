exports.dao_set_meeting_planning = function(evt, mysql_conn, post){
	var sql = "INSERT INTO `meeting_planning` SET `idx_owner` = '1', `idx_owner_type` = 'user', `subject` = '"+post['meeting_subject']+"', `goal` = '"+post['meeting_goal']+"', `start_time` = '"+post['meeting_start_time']+"', `end_time` = '"+post['meeting_end_time']+"', `reg_time` = now()";
	var query = mysql_conn.query(sql, post, function(err, rows, fields) {
		evt.emit('query_unit_1', err, rows);
	});
	return sql;
}

exports.dao_set_meeting_planning_agenda = function(evt, mysql_conn, post){
	var sql = "INSERT INTO `agenda` SET `subject` = '"+post['subject']+"', `goal` = '"+post['goal']+"', `start_time` = '"+post['start_time']+"', `end_time` = '"+post['end_time']+"', `order` = '"+post['order']+"'";
	var query = mysql_conn.query(sql, function(err, rows, fields) {
		evt.emit('query_unit_2', err, rows);
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
exports.dao_load_agenda = function(evt, mysql_conn, params){
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