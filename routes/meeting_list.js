var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var Validator = require('validator').Validator;

var _MEETING_LIST_COMPLETE_FLAG_CNT = 1;
var _MEETING_USER_COMPLETE_FLAG_CNT = 1;

exports.meeting_list = function(req, res){
	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/

	var evt = new EventEmitter();
	var dao_ml = require('../sql/meeting_list');

	// params['idx_user']
	// params['idx_group']
	var params = { idx_user:1, idx_group:1 }
	var result = { meeting_info:{}, meeting_user:{} };
	var complete_flag = 0;
	var meeting_user_complete_flag = 0;
	var s_d = new Date();
	var e_d = new Date();
	e_d.setMonth(e_d.getMonth()+1);
	params['start_date'] = s_d.getFullYear() + "-" + (s_d.getMonth()+1) + "-00";
	params['end_date'] = e_d.getFullYear() + "-" + (e_d.getMonth()+1) + "-00";

	dao_ml.dao_meeting_list(evt, mysql_conn, params);
	evt.on('meeting_list', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.meeting_info = rows;
		if( complete_flag === _MEETING_LIST_COMPLETE_FLAG_CNT && rows.length > 0 )
		{
			_MEETING_USER_COMPLETE_FLAG_CNT = rows.length;
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
		if( meeting_user_complete_flag === _MEETING_USER_COMPLETE_FLAG_CNT )
			res.render('meeting_list', {result:result} );
	});	
};
