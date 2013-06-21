var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;

var _APPRAISAL_COMPLETE_FLAG_CNT = 1;
var _EVALUATION_COMPLETE_FLAG_CNT = 1;
var _RESULT_COMPLETE_FLAG_CNT = 4;
var _EVALUATION_INFO_FLAG_CNT = 1;

exports.main = function(req, res){

	var agent = req.headers['user-agent'];
	if( agent.toString().indexOf("MSIE") > 0 )
	{
		res.render('no_explorer', {} );
		return;
	}
	/* debug */
	req.session.idx_user = 1;
	req.session.email = "orchestra@gmail.com";
	req.session.idx_group = 1;

	/** session start **/
	if( !req.session.email || !req.session.idx_group || typeof req.session.email === "undefined" )
		res.redirect("/");
	/** session end **/
	else
	{	
		var evt = new EventEmitter();
		var dao_c = require('../sql/common');
		var dao_m = require('../sql/meeting');
		var dao_ml = require('../sql/meeting_list');
		var dao_mp = require('../sql/meeting_planning');
		var select_tool = typeof req.param("tool") !== "undefined";
		var complete_flag = 0;
		var params = { 
			idx_user:req.session.idx_user,
			idx_group:req.session.idx_group
		};
		var result = {};
		req.assert("idx_meeting", "valid meeting required").notEmpty().isInt();
		var errors = req.validationErrors();

		if( select_tool )
			dao_c.dao_begin_work(evt, mysql_conn);
		else if( errors !== null )
			res.redirect("/");
		else
		{
			params.idx_meeting = req.param("idx_meeting");
			dao_m.dao_get_meeting(evt, mysql_conn, params);
		}
		
		// 트랜젝션 실행 후
		evt.on('begin_work', function(err, rows){
			if(err) throw err;
			// unit 쿼리 실행 - Insert meeting_planning
			dao_m.dao_set_quick_meeting(evt, mysql_conn, params);
		});
		
		evt.on('set_quick_meeting', function(err, rows){
			console.log("set_quick_meeting");
			if(err) 
				dao_c.dao_rollback(evt, mysql_conn);
			else
			{
				params.idx_meeting = rows.insertId;
				dao_mp.dao_set_meeting_planning_users(evt, mysql_conn, params);
			}
		});
		evt.on('query_unit_3', function(err, rows){
			console.log("query_unit_3");
			if(err) 
				dao_c.dao_rollback(evt, mysql_conn);
			else
				dao_mp.dao_set_meeting_planning_group(evt, mysql_conn, params);
		});
		evt.on('set_meeting_planning_group', function(err, rows){
			console.log("set_meeting_planning_group");
			if(err) 
				dao_c.dao_rollback(evt, mysql_conn);
			else
				dao_c.dao_commit(evt, mysql_conn);
		});
		// 트랜젝션 커밋 실행 후
		evt.on('commit', function(err, rows){
			if(err) throw err;
			dao_m.dao_get_meeting(evt, mysql_conn, params);
		});
		evt.on('rollback', function(err, rows){
			if(err) throw err;
			res.redirect("/");
		});

		evt.on('get_meeting', function(err, rows){
			if(err) throw err;

			result.meeting = rows;

			if( rows.length > 0 )
			{
				result.idx_user = req.session.idx_user;	// idx_user
				result.idx_group = req.session.idx_group;	// idx_group
				result.idx_meeting = params.idx_meeting;	// idx_meeting
				req.session.idx_meeting = params.idx_meeting;
				
				var d_t = new Date(result.meeting[0].date);
				var c_t = new Date();
				var s_t = util.getTime(result.meeting[0].start_time);
				var e_t = util.getTime(result.meeting[0].end_time);
				var total_time = 0;
				var start_point = true;
				var run_time = Math.floor(((c_t.getTime() - d_t.getTime() + 3600000*9) / 1000) - s_t.t);
				if( run_time < 1 ) run_time = 0;
				result.meeting[0].run_time = run_time;
				result.meeting[0].limit_time = util.getTimeFormat(e_t.t-s_t.t);
				result.process = {time:run_time};

				var is_ing, is_prev_ing, start_time, end_time, used_time, time_over;

				for(var i=0;i<result.meeting.length;i++)
				{
					is_ing = (result.meeting[i].agenda_status === "ing");
					if(i===0)
					{
						start_time = "00:00:00";
						// 현재 단계 완료
						if( !is_ing )
						{
							end_time = result.meeting[i].agenda_use_time;
							used_time = result.meeting[i].agenda_use_time;
							total_time += result.meeting[i].agenda_use_time;
						}
						else
						{
							end_time = result.meeting[i].agenda_time;
							used_time = run_time;
							total_time += result.meeting[i].agenda_time;
						}
					}
					else
					{
						is_prev_ing = (result.meeting[i-1].agenda_status === "ing");
						// 현재 단계 완료
						if( !is_ing )
						{
							start_time = total_time;
							end_time = start_time + result.meeting[i].agenda_use_time;
							used_time = result.meeting[i].agenda_use_time;
							total_time += used_time;
						}
						// 전 단계가 진행 됨 ( 현재 진행중 )
						else if( !is_prev_ing )
						{
							start_time = total_time;
							end_time = start_time + result.meeting[i].agenda_time;
							used_time = run_time - total_time;
							total_time += result.meeting[i].agenda_time;
						}
						// 전 단계가 진행 안됨
						else
						{
							start_time = total_time;
							end_time = start_time + result.meeting[i].agenda_time;
							used_time = 0;
							total_time += result.meeting[i].agenda_time;
						}
					}
					if( used_time > result.meeting[i].agenda_time )
						result.meeting[i].agenda_time_over = "time-over";
					else
						result.meeting[i].agenda_time_over = "";
					result.meeting[i].agenda_start_time = util.getTimeFormat(start_time);
					result.meeting[i].agenda_end_time = util.getTimeFormat(end_time);
					result.meeting[i].agenda_time = result.meeting[i].agenda_time;
					result.meeting[i].agenda_limit_time = util.getTimeFormat(result.meeting[i].agenda_time);
					result.meeting[i].agenda_used_time = util.getTimeFormat(used_time);
					result.meeting[i].agenda_total_time = total_time;

					if( is_ing && start_point )
					{
						result.meeting[i].class_name = "processing";
						used_time = util.getTime(result.meeting[i].agenda_used_time);
						result.process.time = used_time.t;
						start_point = false;
					}
					else
						result.meeting[i].class_name = "";
				}
				dao_ml.dao_meeting_user(evt, mysql_conn, params);
			}
			else
				res.redirect("/");
		});

		evt.on('meeting_user', function(err, rows){
			if(err) throw err;
			result.meeting_user = rows;
			console.log(result);
			res.render('meeting', { result:result });
		});
	}
};

exports.post_next_process = function(req, res){

	var result = {};
	/** session start **/
	if( !req.session.email || !req.session.idx_group || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You should be logged.", target:"" };
		res.send(result);
	}
	/** session end **/
	else
	{	
		req.assert("idx_agenda", "valid meeting required").notEmpty().isInt();
		var errors = req.validationErrors();
		if( errors )
			res.send(errors[0]);
		else
		{
			var evt = new EventEmitter();
			var dao_c = require('../sql/common');
			var dao_m = require('../sql/meeting');
			var dao_ml = require('../sql/meeting_list');
			var dao_mp = require('../sql/meeting_planning');
			var params = {
				idx_meeting:req.session.idx_meeting,
				idx_agenda:req.param("idx_agenda")*1
			};
			
			var c_d = new Date();
			dao_m.dao_get_meeting(evt, mysql_conn, params);
				
			evt.on('get_meeting', function(err, rows){
				if(err) throw err;
				if( rows.length > 0 )
				{
					var current_time, date_time;
					var use_time;
					var prev_use_time = 0;
					for(var i=0;i<rows.length;i++)
					{
						if( rows[i].agenda_idx === params.idx_agenda && i === (rows.length-1) )
						{
							result = { result:"failed", msg:"This is last process", next:"exit_meeting" }
							break;
						}
						else if( rows[i].agenda_idx === params.idx_agenda )
						{
							result = {};
							current_time = new Date().getTime();
							date_time = new Date(rows[i].date).getTime()-9*3600000;
							start_time = util.getTime(rows[i].start_time).t;
							params.date_time = date_time;
							params.start_time = start_time;
							params.prev_use_time = prev_use_time;
							params.prev_use_time_t = prev_use_time;
							use_time = ((current_time - date_time)/1000) - start_time - prev_use_time;
							params.u_t = use_time;
							params.use_time = Math.floor(use_time);

							console.log(params);
							dao_m.dao_set_agenda_complete(evt, mysql_conn, params);
							break; 
						}
						else
							result = { result:"failed", msg:"Not exist process in meeting "+params.idx_agenda };
						prev_use_time += rows[i].agenda_use_time;
					}
					if( result.result === "failed" )
						res.send(result);
				}
				else
				{
					result = { result:"failed", msg:"You should be logged.", target:"" };
					res.send(result);
				}
			});
			
			evt.on('set_agenda_complete', function(err, rows){
				if(err) throw err;
				result = { result:"successful", use_time:params.use_time };
				res.send(result);
			});
		}
	}
};

exports.meeting_public = function(req, res){
	res.render('meeting_public', { title: 'Express' });
};

exports.meeting_appraisal = function(req, res){
	/** session start **/
	//if( !req.session.email || typeof req.session.email === "undefined" )
	//	res.redirect("/");
	/** session end **/
	res.render('meeting_appraisal', { title: 'Express' });
};


exports.meeting_evaluation = function(req, res){

	var result = {};
	/** session start **/
	if( !req.session.email || !req.session.idx_group || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You should be logged.", target:"" };
		res.send(result);
	}
	/** session end **/
	else
	{	
		var evt = new EventEmitter();
		var dao_c = require('../sql/common');
		var dao_m = require('../sql/meeting');
		var params = { 
			idx_meeting:req.session.idx_meeting,	 
			idx_group:req.session.idx_group,
			idx_user:req.session.idx_user
		};	

		console.log("[LOG]"+params['idx_meeting']);
		console.log("[LOG]"+params['idx_group']);
		console.log("[LOG]"+params['idx_user']);

		var result = { meeting_evaluation:{} };
		var complete_flag = 0;

		dao_m.dao_get_meeting_evaluation_info(evt, mysql_conn, params);
		evt.on('get_meeting_evaluation_info', function(err, rows){
			if(err) throw err;
			result.meeting_evaluation = rows;
			console.log(result);
			complete_flag++;
			if( complete_flag === _EVALUATION_INFO_FLAG_CNT )
				res.render('meeting_evaluation', {result:result} );
		});
	}
};

exports.post_meeting_appraisal = function(req, res){

	var result;
	var evt = new EventEmitter();
	var dao_c = require('../sql/common');
	var dao_m = require('../sql/meeting');
	var params = { 
		satisfaction:req.body.satisfaction,
		ft_appraisal:req.body.ft_appraisal,
		mvp:req.body.mvp
	};
	var complete_flag = 0;

	dao_m.dao_set_meeting_appraisal(evt, mysql_conn, params);
	evt.on('set_meeting_appraisal', function(err, rows){
		if(err) throw err;
		complete_flag++;
		if( complete_flag === _APPRAISAL_COMPLETE_FLAG_CNT )
			res.redirect("/page/meeting_result");
	});
};

exports.post_meeting_evaluation = function(req, res) {

	var evt = new EventEmitter();
	var dao_c = require('../sql/common');
	var dao_m = require('../sql/meeting');

	var params = { 
		satisfaction:req.param("satisfaction"),
		ft_appraisal:req.param("ft_appraisal"),
		mvp:req.param("mvp"),
		idx_meeting:req.session.idx_meeting,	 
		idx_group:req.session.idx_group,
		idx_user:req.session.idx_user
	};	
	
	var result = {  };

	var complete_flag = 0;
	
	dao_m.dao_set_meeting_evaluation(evt, mysql_conn, params);
	evt.on('set_meeting_evaluation', function(err, rows){
		console.log("set_meeting_evaluation");
		if(err) throw err;
		complete_flag++;
		if( complete_flag === _EVALUATION_COMPLETE_FLAG_CNT ) {
			//showMeetingRe
			res.send(result);
		}
	});
};

exports.meeting_result = function(req, res){
	/** session start **/
	//if( !req.session.email || typeof req.session.email === "undefined" )
	//	res.redirect("/");
	/** session end **/

	var evt = new EventEmitter();
	var dao_c = require('../sql/common');
	var dao_m = require('../sql/meeting');
	var params = { 
		idx_meeting:req.session.idx_meeting,	 
		idx_group:req.session.idx_group
	};	
	
	console.log("rep: "+req.param("idx_meeting"));

	if ( params["idx_meeting"] != req.param("idx_meeting") && req.param("idx_meeting") != 0  )
	{	
		params["idx_meeting"] = req.param("idx_meeting");
	}

	console.log("[Result LOG]"+params['idx_meeting']);

	var result = { meeting_result:{}, meeting_result_appraisal:{}, meeting_tools_image:{}, meeting_charts:{} };
	var complete_flag = 0;

	dao_m.dao_get_meeting_result(evt, mysql_conn, params);
	evt.on('get_meeting_result', function(err, rows){
		if(err) throw err;
		result.meeting_result = rows;
		complete_flag++;
		console.log(result);
		if( complete_flag === _RESULT_COMPLETE_FLAG_CNT )
			res.render('meeting_result', {result:result} );
	});

	dao_m.dao_get_meeting_result_appraisal(evt, mysql_conn, params);
	evt.on('get_meeting_result_appraisal', function(err, rows){
		if(err) throw err;
		result.meeting_result_appraisal = rows;
		complete_flag++;
		console.log(result);
		if( complete_flag === _RESULT_COMPLETE_FLAG_CNT )
			res.render('meeting_result', {result:result} );
	});

	dao_m.dao_get_meeting_tools_image(evt, mysql_conn, params);
	evt.on('get_meeting_tools_image', function(err, rows){
		if(err) throw err;
		result.meeting_tools_image = rows;
		complete_flag++;
		console.log(result);
		if( complete_flag === _RESULT_COMPLETE_FLAG_CNT )
			res.render('meeting_result', {result:result} );
	});

	dao_m.dao_get_meeting_charts(evt, mysql_conn, params);
	evt.on('get_meeting_charts', function(err, rows){
		if(err) throw err;
		result.meeting_charts = rows;
		complete_flag++;
		console.log(result);
		if( complete_flag === _RESULT_COMPLETE_FLAG_CNT )
			res.render('meeting_result', {result:result} );
	});

};

exports.minutes = function(req, res){
	/** session start **/
	//if( !req.session.email || typeof req.session.email === "undefined" )
	//	res.redirect("/");
	/** session end **/

	res.render('minutes', { title: '' });
};

exports.post_meeting_close = function(req, res){
	var result = {};
	/** session start **/
	if( !req.session.email || !req.session.idx_group || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You should be logged.", target:"" };
		res.send(result);
	}
	/** session end **/
	else
	{	
		if( false )
		{
			result = { result:"failed", msg:"You should be logged.", target:"" };
			res.send(result);
		}		
		else
		{	
			var idx_meeting = req.session.idx_meeting;
			var idx_group = req.session.idx_group;
			var idx_user = req.session.idx_user;

			var evt = new EventEmitter();
			var dao_m = require('../sql/meeting');
			var dao_c = require('../sql/common');

			////  redis 클라이언트 생성  ////
			var redis = require('redis'), 
				client = redis.createClient(6379, '61.43.139.70'), multi;

			var params = {
				idx_meeting:idx_meeting,
				idx_group:idx_group,
				idx_user:idx_user
			};

			var dataCnt = 0;
			var dataCompleteFlag = 0;
			var dataFlag = false;
			var optionsCnt = 0;
			var optionsCompleteFlag = 0;
			var optionsFlag = false;

			dao_c.dao_begin_work(evt, mysql_conn);
			// 트랜젝션 실행 후
			evt.on('begin_work', function(err, rows){
				if(err) throw err;

				// data 
				// meeting data select
				var m_d_selector = idx_meeting+":*:order"
				client.keys(m_d_selector, function(err, replies) {
					// data 가 없을 경우
					if( replies.length < 1 )
						dataFlag = true;
					replies.forEach( function(key, index) {
						var keySplit = key.toString().split(":");
						client.lrange(key, 0, -1, function (err, replies) {	
							dataCnt +=replies.length;
							replies.forEach( function (data, index) {
								var dataSplit = data.toString().split(":");
								client.hkeys(data, function (err, parent){
									var parentSplit = parent.toString().split(":");
									client.hget(data, parent, function (err, val) {
										client.get(data+":client", function (err, client){
											params['tool'] = dataSplit[1];
											params['delimiter'] = dataSplit[0]+":"+dataSplit[1];
											params['key'] = dataSplit[2];
											params['parent'] = parentSplit[2];
											params['value'] = val;
											params['type'] = 'data';
											params['client'] = client;
											dao_m.dao_set_meeting_save_data(evt, mysql_conn, params);
										});
									});
								});
							});
						});
					});
				});

				// options
				// meeting options select
				var m_o_selector = idx_meeting+":*:options"
				client.keys(m_o_selector, function(err, replies) {
					// options 가 없을 경우
					if( replies.length < 1 )
						optionsFlag = true;
					replies.forEach( function(key, index) {
						var keySplit = key.toString().split(":");
						client.hkeys(key, function (err, replies){
							replies.forEach( function(parent, index){
								optionsCnt += 1;
								var parentSplit = parent.toString().split(":");
								client.hget(key, parent, function (err, val) {
									params['tool'] = keySplit[1];
									params['delimiter'] = keySplit[0]+":"+keySplit[1];
									params['key'] = 0;
									params['parent'] = parentSplit[2];
									params['value'] = val;
									params['type'] = 'options';
									params['client'] = 0;
									dao_m.dao_set_meeting_save_options(evt, mysql_conn, params);
								});
							});
						});
					});
				});
			});

			evt.on('set_meeting_save_data', function(err, sql){
				if(err) 
					dao_c.dao_rollback(evt, mysql_conn);
				else
				{
					dataCompleteFlag++;
					if( dataCnt === dataCompleteFlag )
						dataFlag = true;
					var redirectFlag = optionsFlag && dataFlag;
					if( redirectFlag )
						dao_m.dao_set_meeting_close(evt, mysql_conn, params);
				}
			});
			evt.on('set_meeting_save_options', function(err, sql){
				if(err) 
					dao_c.dao_rollback(evt, mysql_conn);
				else
				{
					optionsCompleteFlag++;
					if( optionsCnt === optionsCompleteFlag )
						optionsFlag = true;
					var redirectFlag = optionsFlag && dataFlag;
					if( redirectFlag )
						dao_m.dao_set_meeting_close(evt, mysql_conn, params);
				}
			});
			evt.on('set_meeting_close', function(err, rows){
				if(err) throw err;
				dao_c.dao_commit(evt, mysql_conn);
			});
			evt.on('commit', function(err, rows){
				if(err) throw err;
				result = { result:"successful", msg:"successful"  };
				res.send(result);
			});
			evt.on('rollback', function(err, rows){
				if(err) throw err;
				result = { result:"failed", msg:"failed"  };
				res.send(result);
			});
		}
	}
};

exports.ft_help = function(req, res){
	result = { title:"ft_help" };
	res.render('ft_help', {result:result} );
};

exports.tool_help = function(req, res){
	result = { title:"tool_help" };
	res.render('tool_help', {result:result} );
};

exports.need_help = function(req, res){
	result = { title:"need_help" };
	res.render('need_help', {result:result} );
};

exports.meeting_save_tools_image = function(req, res){
	/** session start **/
	//if( !req.session.email || typeof req.session.email === "undefined" )
	//	res.redirect("/");
	/** session end **/
	
	var evt = new EventEmitter();
	var dao_m = require('../sql/meeting');
	
	var params = { 
		idx_meeting:req.session.idx_meeting,	 
		idx_group:req.session.idx_group,
		idx_tool:req.param("idx_tool"),
		idx_process:req.param("idx_process"),
		tool_num:req.param("tool_num"),
		image_value:req.param("image_value")
	};	

	dao_m.dao_set_meeting_save_tools_image(evt, mysql_conn, params);

	evt.on('set_meeting_tools_image', function(err, sql){
		if(err) throw err;

		var result = { result:"successful", msg:"successful"  };
		res.send(result);
	});
};

exports.result_get_tools_image = function(req, res){
	/** session start **/
	//if( !req.session.email || typeof req.session.email === "undefined" )
	//	res.redirect("/");
	/** session end **/
	
	var evt = new EventEmitter();
	var dao_m = require('../sql/meeting');
	
	var params = { 
		idx_meeting:req.session.idx_meeting,	 
		idx_group:req.session.idx_group,
		idx_process:req.param("idx_process")
	};	

	dao_m.dao_get_meeting_tools_image(evt, mysql_conn, params);

	evt.on('get_meeting_tools_image', function(err, rows){
		if(err) throw err;
		//console.log("[rows]->"+rows[0].image_value);
		res.send(rows);
	});
};

