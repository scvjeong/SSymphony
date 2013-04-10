var sql_quick_meeting = function(idx_onwer, idx_onwer_type){
	var sql = "SELECT `idx`, `name` FROM `tools` WHERE `use_flag` = 'Y'";
	return sql;
}

module.exports = {
	sql_quick_meeting: sql_quick_meeting
}
