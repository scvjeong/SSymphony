exports.dao_set_meeting_planning = function(evt, mysql_conn, post){
	var sql = "INSERT INTO `agenda` SET ?";
	var query = mysql_conn.query(sql, post, function(err, rows, fields) {
		evt.emit('query_unit', err, rows);
	});
	return sql;
}

// select_meeting_template
exports.sql_meeting_template = function(idx_onwer, idx_onwer_type){
	var sql = "SELECT idx, subject FROM `meeting_planning` WHERE `idx_onwer` = '1' AND `idx_onwer_type` = 'admin'";
	return sql;
}

exports.sql_load_agenda = function(idx_onwer, idx_onwer_type, idx_meeting_planning){
	var sql = "SELECT	`A`.`idx`, `A`.`subject`, `B`.`subject`, `B`.`goal`, `B`.`start_time`, `B`.`end_time`, `B`.`order` ";
	sql += "FROM `meeting_planning` AS `A` INNER JOIN `agenda` AS `B` ";
	sql += "ON `A`.`idx` = `B`.`idx_meeting_planning` ";
	sql += "WHERE `A`.`idx_onwer` = '1' AND `A`.`idx_onwer_type` = 'admin' AND `A`.`idx` = '"+idx_meeting_planning+"' ";
	sql += "ORDER BY `B`.`order` ASC";
	return sql;
}