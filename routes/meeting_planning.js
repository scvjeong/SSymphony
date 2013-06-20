/*
 * GET select_meeting_template
 */
var mysql_conn = require('../sql/mysql_server').mysql_conn;
var util = require('../lib/util');
var EventEmitter = require('events').EventEmitter;

var _SET_MEETING_PLANNING_COMPLETE_FLAG_CNT = 3;

exports.set_meeting_planning = function(req, res){

	/** session start *
	if( !req.session.email || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You should be logged.", target:"" };
		res.send(result);
	}
	/** session end **/
	
	var evt = new EventEmitter();
	var dao_c = require('../sql/common');
	var dao_mp = require('../sql/meeting_planning');
	var post = util.regroup_post_for_meeting_planning(req.body);
	var params = {
			idx_group:req.session.idx_group,
			meeting_subject:req.param("meeting_subject"),
			meeting_goal:req.param("meeting_goal"),
			meeting_date:req.param("meeting_date"),
			meeting_start_time:req.param("meeting_start_time"),
			meeting_end_time:req.param("meeting_end_time"),
			meeting_agenda:req.param("meeting_agenda"),
			meeting_user_list:req.param("meeting_user_list")
	}
	var unit_2_cnt = 0;
	var unit_3_cnt = 0;
	var complete_flag = 0;
	var unit_3_total_cnt = 0;

	// 트랜젝션 실행
	dao_c.dao_begin_work(evt, mysql_conn);

	// 트랜젝션 실행 후
	evt.on('begin_work', function(err, rows){
		if(err) throw err;
		// unit 쿼리 실행 - Insert meeting_planning
		dao_mp.dao_set_meeting_planning(evt, mysql_conn, params);
	});
	evt.on('query_unit_1', function(err, rows){
		console.log("query_unit_1");
		if(err)
			dao_c.dao_rollback(evt, mysql_conn);
		else
		{
			var idx_meeting = rows.insertId;
			params.idx_meeting = idx_meeting;
			// unit 쿼리 실행 - Insert agenda
			for( var i=0; i<params.meeting_agenda.length; i++ )
			{
				// set order 
				params.meeting_agenda[i] = { 
					subject:params.meeting_agenda[i], 
					order:i,
					time:10,
					idx_meeting:params.idx_meeting
				}
				dao_mp.dao_set_meeting_planning_agenda(evt, mysql_conn, params.meeting_agenda[i]);
			}

			// unit_3 쿼리 실행 - Insert relation_user_meeting
			unit_3_total_cnt = params.meeting_user_list.length;
			for( var i=0; i<unit_3_total_cnt; i++ )
			{
				params.meeting_user_list[i] = { 
					idx_user:params.meeting_user_list[i], 
					idx_meeting:params.idx_meeting
				}
				dao_mp.dao_set_meeting_planning_users(evt, mysql_conn, params.meeting_user_list[i]);
			}
			dao_mp.dao_set_meeting_planning_group(evt, mysql_conn, params);
		}
	});
	evt.on('query_unit_3', function(err, rows){
		console.log("query_unit_3");
		if(err) 
			dao_c.dao_rollback(evt, mysql_conn);
		else
		{
			unit_3_cnt++;
			if( unit_3_total_cnt == unit_3_cnt  )
			{
				complete_flag++;
				if( complete_flag == _SET_MEETING_PLANNING_COMPLETE_FLAG_CNT )
				{
					// 트랜젝션 커밋 실행
					dao_c.dao_commit(evt, mysql_conn);
				}
			}
		}
	});
	evt.on('query_unit_2', function(err, rows){
		console.log("query_unit_2");
		if(err) 
			dao_c.dao_rollback(evt, mysql_conn);
		else
		{
			unit_2_cnt++;
			if( post.length == unit_2_cnt )
			{
				complete_flag++;
				if( complete_flag === _SET_MEETING_PLANNING_COMPLETE_FLAG_CNT )
				{
					// 트랜젝션 커밋 실행
					dao_c.dao_commit(evt, mysql_conn);
				}
			}
		}
	});
	evt.on('set_meeting_planning_group', function(err, rows){
		console.log("set_meeting_planning_group");
		if(err) 
			dao_c.dao_rollback(evt, mysql_conn);
		else
		{
			complete_flag++;
			if( complete_flag === _SET_MEETING_PLANNING_COMPLETE_FLAG_CNT )
			{
				// 트랜젝션 커밋 실행
				dao_c.dao_commit(evt, mysql_conn);
			}
		}
	});
	// 트랜젝션 커밋 실행 후
	evt.on('commit', function(err, rows){
		if(err) throw err;
		result = { result:"successful", msg:"successful", idx_meeting:params.idx_meeting  };
		res.send(result);
	});
	evt.on('rollback', function(err, rows){
		if(err) throw err;
		res.render('ajax/set_meeting_planning', {result:"failed"} );
	});
};

exports.meeting_template = function(req, res){
	/** session start **/
	
	if( !req.session.email || typeof req.session.email === "undefined" )
		res.send("");
	
	/** session end **/

	var evt = new EventEmitter();
	var dao_mp = require('../sql/meeting_planning');
	var result = { agenda:[] };
	var idx_user = req.session.idx_user;
	var idx_group = req.session.idx_group;
	var first_name = req.session.first_name;
	var last_name = req.session.last_name;
	var complete_flag = 0;
	var total_complete_flag = 0;
	// params['idx_user']
	// params['idx_group']
	var params = { 
		idx_owner:null, 
		idx_owner_type:null, 
		idx_group:idx_group
	}
	dao_mp.dao_meeting_template(evt, mysql_conn, params);
	evt.on('meeting_template', function(err, rows){
		if(err) throw err;
		result.meeting_planning = rows;
		total_complete_flag = rows.length;
		for(var i=0;i<rows.length;i++)
		{
			params.idx_meeting_planning = rows[i].idx;
			dao_mp.dao_load_agenda(evt, mysql_conn, params);
		}
	});

	evt.on('setting_agenda', function(err, rows){
		if(err) throw err;
		complete_flag++;
		if( rows.length > 0 )
		{
			result.agenda[rows[0].idx] = rows;
			if( total_complete_flag === complete_flag ){
				result.idx_user = idx_user;
				result.user_name = first_name.substring(0,1).toUpperCase()+last_name.substring(0,1).toUpperCase();
				res.render('select_meeting_template', {result:result} );		
			}
		}
	});
};

exports.setting_agenda = function(req, res){
	/** session start **/
	if( !req.session.email || typeof req.session.email === "undefined" )
		res.redirect("/");
	/** session end **/

	var evt = new EventEmitter();
	var dao_mp = require('../sql/meeting_planning');
	var dao_gi = require('../sql/group_info');
	// params['idx_owner']
	// params['idx_owner_type']
	// params['idx_meeting_planning']
	// params['idx_group']
	var params = { idx_owner:null, idx_owner_type:null, idx_meeting_planning:req.param('idx'), idx_group:1 }
	var complete_flag = 0;
	var result = { agenda:{}, users:{}, tools:{} };
	
	dao_mp.dao_load_agenda(evt, mysql_conn, params);
	evt.on('setting_agenda', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.agenda = rows;
		if( complete_flag == 3 )
			res.render('setting_agenda', {result:result} );
	});

	dao_mp.dao_load_tools(evt, mysql_conn, params);
	evt.on('load_tools', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.tools = rows;
		if( complete_flag == 3 )
			res.render('setting_agenda', {result:result} );
	});
	
	dao_gi.dao_group_info_user(evt, mysql_conn, params);
	evt.on('group_info_user', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.users = rows;
		if( complete_flag == 3 )
			res.render('setting_agenda', {result:result} );
	});


};

exports.setting_agenda_step = function(req, res){
	/** session start **/
	if( !req.session.email || typeof req.session.email === "undefined" )
		res.redirect("/");
	/** session end **/

	res.render('setting_agenda_step');
};

exports.post_search_meeting_planning = function(req, res){
	/** session start **/
	/*
	if( !req.session.email || typeof req.session.email === "undefined" )
		res.redirect("/");
	*/
	/** session end **/

	var evt = new EventEmitter();
	var dao_mp = require('../sql/meeting_planning');
	var result = { agenda:[] };
	var idx_group = req.session.idx_group;
	var value = req.param("val");
	var complete_flag = 0;
	var total_complete_flag = 0;
	// params['idx_owner']
	// params['idx_owner_type']
	var params = { idx_owner:null, idx_owner_type:null, idx_group:idx_group, value:value }
	dao_mp.dao_meeting_template(evt, mysql_conn, params);
	evt.on('meeting_template', function(err, rows){
		if(err) throw err;
		if( rows.length < 1 )
			res.send(result);
		else 
		{
			result.meeting_planning = rows;
			total_complete_flag = rows.length;
			for(var i=0;i<rows.length;i++)
			{
				params.idx_meeting_planning = rows[i].idx;
				dao_mp.dao_load_agenda(evt, mysql_conn, params);
			}
		}
	});

	evt.on('setting_agenda', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.agenda[rows[0].idx] = rows;
		if( total_complete_flag === complete_flag )
			res.send(result);
	});
};