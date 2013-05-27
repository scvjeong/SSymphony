var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var Validator = require('validator').Validator;

var _GROUP_SELECT_COMPLETE_FLAG_CNT = 2;

exports.meeting_list = function(req, res){
	/** session start **/
	/*
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	*/
	/** session end **/

	var evt = new EventEmitter();
	var dao_gs = require('../sql/group_select');
	var dao_gi = require('../sql/group_info');

	// params['idx_user']
	// params['idx_group']
	var params = { idx_user:1, idx_group:1 }
	var result = { meeting:{}, group_info:{} };
	var complete_flag = 0;

	dao_gs.dao_group_select(evt, mysql_conn, params);
	evt.on('group_select', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.meeting = rows;
		if( complete_flag === _GROUP_SELECT_COMPLETE_FLAG_CNT )
			res.render('meeting_list', {result:result} );
	});
	
	dao_gs.dao_group_info(evt, mysql_conn, params);
	evt.on('group_info', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.group_info = rows;
		if( complete_flag === _GROUP_SELECT_COMPLETE_FLAG_CNT )
			res.render('meeting_list', {result:result} );
	});
};
