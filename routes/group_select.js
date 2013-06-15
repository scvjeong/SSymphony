var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var Validator = require('validator').Validator;

var _GROUP_SELECT_COMPLETE_FLAG_CNT = 3;

exports.group_select = function(req, res){

	var agent = req.headers['user-agent'];
	if( agent.toString().indexOf("MSIE") > 0 )
	{
		res.render('no_explorer', {} );
		return;
	}

	/** session start **/
	if( !req.session.email || typeof req.session.email === "undefined" )
		res.redirect("/");
	/** session end **/

	var evt = new EventEmitter();
	var dao_ui = require('../sql/user_info');
	var dao_gs = require('../sql/group_select');
	var dao_gi = require('../sql/group_info');

	// params['idx_user']
	var params = { idx_user:req.session.idx_user }
	var result = { user_info:{}, meeting:{}, group_info:{} };
	var complete_flag = 0;
	var s_d = new Date();
	var e_d = new Date();
	e_d.setMonth(e_d.getMonth()+1);
	params['start_date'] = s_d.getFullYear() + "-" + (s_d.getMonth()) + "-00";
	params['end_date'] = e_d.getFullYear() + "-" + (e_d.getMonth()+1) + "-00";

	dao_ui.dao_user_info(evt, mysql_conn, params);
	evt.on('user_info', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.user_info = rows;
		if( complete_flag === _GROUP_SELECT_COMPLETE_FLAG_CNT )
			res.render('user_info', {result:result} );
	});

	dao_gs.dao_group_select(evt, mysql_conn, params);
	evt.on('group_select', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.meeting = rows;
		if( complete_flag === _GROUP_SELECT_COMPLETE_FLAG_CNT )
			res.render('group_select', {result:result} );
	});
	
	dao_gs.dao_group_info(evt, mysql_conn, params);
	evt.on('group_info', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.group_info = rows;
		if( complete_flag === _GROUP_SELECT_COMPLETE_FLAG_CNT )
			res.render('group_select', {result:result} );
	});
};

exports.new_group = function(req, res){
	/** session start **/
	if( !req.session.email || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You must be logged.", target:"group_name" };
		res.send(result);
	}
	/** session end **/

	var evt = new EventEmitter();
	var dao_gs = require('../sql/group_select');
	var dao_c = require('../sql/common');
	var result = {};
	var params = {};
	var group_name = req.body.group_name;
	
	if( group_name.length < 1 )
		result = { result:"failed", msg:"You can't leave this empty.", target:"group_name" };

	if( result.result !== "failed" )
	{
		// params['group_name']
		params = { group_name:group_name }
		dao_gs.dao_check_group_name(evt, mysql_conn, params);
	}
	else
		res.send(result);
	
	//check_group_name
	evt.on('check_group_name', function(err, rows){
		if( rows[0].cnt === 0 )
		{
			// 트랜젝션 실행
			dao_c.dao_begin_work(evt, mysql_conn);
		}
		else
		{
			result = { result:"failed", msg:"Someone already has that group name. Try another?", target:"group_name" };
			res.send(result);
		}
	});

	// 트랜젝션 실행 후
	evt.on('begin_work', function(err, rows){
		if(err) throw err;
		// params['group_name']
		params = { group_name:group_name };
		dao_gs.dao_new_group(evt, mysql_conn, params);
	});
	// new_group
	evt.on('new_group', function(err, rows){
		if(err)
			dao_c.dao_rollback(evt, mysql_conn);
		else
		{
			var idx_group = rows.insertId;
			params = { idx_user:req.session.idx_user, idx_group:idx_group };
			dao_gs.dao_set_relation_user_group(evt, mysql_conn, params);
		}
	});
	// set_relation_user_group
	evt.on('set_relation_user_group', function(err, rows){
		if(err)
			dao_c.dao_rollback(evt, mysql_conn);
		else
		{
			// 트랜젝션 커밋 실행
			dao_c.dao_commit(evt, mysql_conn);
		}
	});
	// 커밋
	evt.on('commit', function(err, rows){
		if(err) throw err;
		// 트랜젝션 커밋 실행 후
		result = { result:"successful", msg:"successful", user_name:req.session.nickname, group_name:group_name  };
		res.send(result);
	});
	// 롤백
	evt.on('rollback', function(err, rows){
		if(err) throw err;
		result = { result:"failed", msg:"Someone already has that group name. Try another?", target:"group_name" };
		res.send(result);
	});
};
