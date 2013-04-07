var sql_quick_meeting = function(idx_onwer, idx_onwer_type){
	var sql = "SELECT idx, subject FROM `meeting_planning` WHERE `idx_onwer` = '1' AND `idx_onwer_type` = 'admin'";
	return sql;
}

module.exports = {
	sql_quick_meeting: sql_quick_meeting
}
