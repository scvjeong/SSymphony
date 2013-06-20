var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var Validator = require('validator').Validator;

var _GROUP_INFO_COMPLETE_FLAG_CNT = 1;
var _MEETING_LIST_COMPLETE_FLAG_CNT = 1;

exports.meeting_list = function(req, res){
	var agent = req.headers['user-agent'];
	if( agent.toString().indexOf("MSIE") > 0 )
	{
		res.render('no_explorer', {} );
		return;
	}

	/** session start **/
	if( !req.session.email || typeof req.session.email === "undefined" )
	{
		res.redirect("/");
	}
	/** session end **/
	else
	{
		if( typeof req.param("group") === "undefined" )
			res.redirect("/page/group_select");
		else
			req.session.idx_group = req.param("group");

		var evt = new EventEmitter();
		var dao_ml = require('../sql/meeting_list');

		// params['idx_user']
		// params['idx_group']
		var params = { idx_user:req.session.idx_user, idx_group:req.session.idx_group }
		var result = { group_info:{}, meeting_list:{}, meeting_user:{} };
		var meeting_list_complete_flag = 0;
		var group_info_complete_flag = 0;
		var meeting_user_complete_flag = 0;
		var meeting_user_complete_flag_cnt;
		var s_d = new Date();
		var e_d = new Date();
		e_d.setMonth(e_d.getMonth()+1);
		params['start_date'] = s_d.getFullYear() + "-" + (s_d.getMonth()) + "-00";
		params['end_date'] = e_d.getFullYear() + "-" + (e_d.getMonth()+1) + "-00";
		
		dao_ml.dao_group_info(evt, mysql_conn, params);
		evt.on('group_info', function(err, rows){
			if(err) throw err;
			group_info_complete_flag++;
			result.group_info = rows;
			if( group_info_complete_flag === _GROUP_INFO_COMPLETE_FLAG_CNT && rows.length > 0 )
				dao_ml.dao_meeting_list(evt, mysql_conn, params);
			else if( rows.length < 1)
				throw err;
		});
		
		evt.on('meeting_list', function(err, rows){
			if(err) throw err;
			meeting_list_complete_flag++;
			result.meeting_list = rows;
			if( meeting_list_complete_flag === _MEETING_LIST_COMPLETE_FLAG_CNT && rows.length > 0 )
				{
				meeting_user_complete_flag_cnt = rows.length;
				for(var i=0; i<rows.length; i++)
				{
					params['idx_meeting'] = rows[i].idx_meeting;
					result.meeting_user[rows[i].idx_meeting] = {};
					dao_ml.dao_meeting_user(evt, mysql_conn, params);
				}
			}
			else if( rows.length < 1)
				res.render('meeting_list', {result:result} );
		});

		evt.on('meeting_user', function(err, rows){
			if(err) throw err;
			meeting_user_complete_flag++;
			result.meeting_user[rows[0].idx_meeting] = rows;
			if( meeting_user_complete_flag === meeting_user_complete_flag_cnt )
				res.render('meeting_list', {result:result} );
		});
	}
};

exports.post_search_user = function (req, res){

	var result;
	/** session start **/
	if( !req.session.email || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You should be logged.", target:"" };
		res.send(result);
	}
	/** session end **/
	
	var evt = new EventEmitter();
	var dao_ml = require('../sql/meeting_list');
	var user_id = req.param("user_id");
	var idx_group = req.session.idx_group;

	if( idx_group > 0 )
	{
		// params['idx_group']
		// params['user_id']
		var params = { idx_group:idx_group, user_id:user_id }
		
		dao_ml.dao_search_user(evt, mysql_conn, params);
		evt.on('search_user', function(err, rows){
			if(err) throw err;
			res.send(rows);
		});	
	}
	else
		res.send("");
};

exports.post_search_user_for_meeting = function (req, res){

	var result;
	/** session start **/
	if( !req.session.email || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You should be logged.", target:"" };
		res.send(result);
	}
	/** session end **/
	
	var evt = new EventEmitter();
	var dao_ml = require('../sql/meeting_list');
	var user_id = req.param("user_id");
	var idx_user = req.session.idx_user;
	var idx_group = req.session.idx_group;

	if( idx_group > 0 )
	{
		// params['idx_group']
		// params['user_id']
		// params['idx_user']		
		var params = { idx_user:idx_user, idx_group:idx_group, user_id:user_id }
		
		dao_ml.dao_search_user_for_meeting(evt, mysql_conn, params);
		evt.on('search_user_for_meeting', function(err, rows){
			if(err) throw err;
			res.send(rows);
		});	
	}
	else
		res.send("");
};


exports.post_set_add_user = function (req, res){

	var result;
	/** session start **/
	if( !req.session.email || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You should be logged.", target:"" };
		res.send(result);
	}
	/** session end **/
	
	var evt = new EventEmitter();
	var dao_ml = require('../sql/meeting_list');
	var idx_user = req.param("idx_user");
	var user_name = req.param("user_name");
	var idx_group = req.session.idx_group;

	if( idx_group > 0 )
	{
		// params['idx_group']
		// params['idx_user']
		var params = { idx_group:idx_group, idx_user:idx_user }
		
		dao_ml.dao_set_add_user(evt, mysql_conn, params);
		evt.on('set_add_user', function(err, rows){
			if(err) throw err;
			result = { result:"successful", msg:"successful", idx_user:idx_user, user_name:user_name  };
			res.send(result);
		});	
	}
	else
		res.send("");
};

exports.post_user_info = function (req, res){

	var result;
	/** session start 
	if( !req.session.email || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You should be logged.", target:"" };
		res.send(result);
	}
	/** session end **/
	
	var evt = new EventEmitter();
	var dao_ml = require('../sql/meeting_list');
	var idx_user = req.param("idx_user");

	if( idx_user > 0 )
	{
		// params['idx_user']
		var params = { idx_user:idx_user }
		
		dao_ml.dao_user_info(evt, mysql_conn, params);
		evt.on('user_info', function(err, rows){
			if(err) throw err;
			res.send(rows);
		});	
	}
	else
		res.send("");
};

exports.post_set_delete_user = function (req, res){

	var result;
	/** session start 
	if( !req.session.email || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You should be logged.", target:"" };
		res.send(result);
	}
	/** session end **/
	
	var evt = new EventEmitter();
	var dao_ml = require('../sql/meeting_list');
	var idx_user = req.param("idx_user");
	var idx_group = req.session.idx_group;

	if( idx_group > 0 )
	{
		// params['idx_group']
		// params['idx_user']
		var params = { idx_group:idx_group, idx_user:idx_user }
		
		dao_ml.dao_set_delete_user(evt, mysql_conn, params);
		evt.on('set_delete_user', function(err, rows){
			if(err) throw err;
			result = { result:"successful", msg:"successful", idx_user:idx_user };
			res.send(result);
		});	
	}
	else
		res.send("");
};

exports.user_info = function(req, res){
	var agent = req.headers['user-agent'];
	if( agent.toString().indexOf("MSIE") > 0 )
	{
		res.render('no_explorer', {} );
		return;
	}

	var evt = new EventEmitter();
	var dao_ml = require('../sql/meeting_list');
	var dao_gs = require('../sql/group_select');

	var idx_user;
	if( req.param("idx") )
		idx_user = req.param("idx");
	else
		idx_user = req.session.idx_user;
	var idx_group = req.session.idx_group;
	var result = { meeting_user:{} };
	var complete_flag = 0;
	var meeting_user_complete_flag_cnt;

	var meeting_list_complete_flag = 0;
	var group_info_complete_flag = 0;
	var meeting_user_complete_flag = 0;
		
	// params['idx_user']
	// params['idx_group']
	var params = { idx_user:idx_user, idx_group:idx_group }
	
	dao_ml.dao_user_info(evt, mysql_conn, params);
	evt.on('user_info', function(err, rows){
		if(err) throw err;
		result.user_info = rows;
		complete_flag++;
		if( complete_flag === 3 )
		{
			if( result.user_info.length )
				res.render('user_info', {result:result} );
			else
				res.send();
		}
	});

	dao_gs.dao_group_info(evt, mysql_conn, params);
	evt.on('group_info', function(err, rows){
		if(err) throw err;
		result.group_info = rows;
		complete_flag++;
		if( complete_flag === 3 )
		{
			if( result.user_info.length )
				res.render('user_info', {result:result} );
			else
				res.send();
		}
		/*
		if( group_info_complete_flag === _GROUP_INFO_COMPLETE_FLAG_CNT && rows.length > 0 )
			dao_ml.dao_meeting_list(evt, mysql_conn, params);
		else if( rows.length < 1)
			throw err;
		*/
	});
	
	dao_ml.dao_meeting_list(evt, mysql_conn, params);
	evt.on('meeting_list', function(err, rows){
		if(err) throw err;
		result.meeting_list = rows;
		if( rows.length > 0 )
			{
			meeting_user_complete_flag_cnt = rows.length;
			for(var i=0; i<rows.length; i++)
			{
				params['idx_meeting'] = rows[i].idx_meeting;
				result.meeting_user[rows[i].idx_meeting] = {};
				dao_ml.dao_meeting_user(evt, mysql_conn, params);
			}
		}
		else if( rows.length < 1)
		{
			complete_flag++;
			if( complete_flag === 3 )
			{
				if( result.user_info.length )
					res.render('user_info', {result:result} );
				else
					res.send();
			}
		}
	});

	evt.on('meeting_user', function(err, rows){
		if(err) throw err;
		meeting_user_complete_flag++;
		result.meeting_user[rows[0].idx_meeting] = rows;
		if( meeting_user_complete_flag === meeting_user_complete_flag_cnt )
		{
			complete_flag++;
			if( complete_flag === 3 )
			{
				if( result.user_info.length )
					res.render('user_info', {result:result} );
				else
					res.send();
			}
		}
	});
};
