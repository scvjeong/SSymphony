var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;

/*
 * GET home page.
 */
exports.index = function(req, res){
	var evt = new EventEmitter();
	var dao_ml = require('../sql/meeting_list');
	var dao_gi = require('../sql/group_info');
	// params['idx_user']
	// params['idx_group']
	var params = { idx_user:1, idx_group:1 }

	var result = { meeting:{}, users:{} };
	var complete_flag = 0;

	dao_ml.dao_meeting_list(evt, mysql_conn, params);
	evt.on('meeting_list', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.meeting = rows;
		if( complete_flag == 2 )
			res.render('main', {result:result} );
	});

	dao_gi.dao_group_info_member(evt, mysql_conn, params);
	evt.on('group_info_member', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.users = rows;
		if( complete_flag == 2 )
			res.render('main', {result:result} );
	});
};