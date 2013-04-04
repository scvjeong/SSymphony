// select_meeting_template
var sql_select_meeting_template = function(idx_onwer, idx_onwer_type){
	var sql = "SELECT * FROM `meeting_planning` WHERE `idx_onwer` = '1' AND `idx_onwer_type` = 'admin'";
	return sql;
}

module.exports = {
	sql_select_meeting_template: sql_select_meeting_template
}
