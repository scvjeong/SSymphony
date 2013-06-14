var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;

var _APPRAISAL_COMPLETE_FLAG_CNT = 1;
var _RESULT_COMPLETE_FLAG_CNT = 3;
var _MEETING_FLAG_CNT = 1;

exports.main = function(req, res){

	var agent = req.headers['user-agent'];
	if( agent.toString().indexOf("MSIE") > 0 )
	{
		res.render('no_explorer', {} );
		return;
	}

	/** session start 
	if( !req.session.email || typeof req.session.email === "undefined" )
		res.redirect("/");
	/** session end **/

	if( typeof req.param("idx_meeting") === "undefined" )
		res.redirect("/");
	else
		req.session.idx_meeting = req.param("idx_meeting");

	var evt = new EventEmitter();
	var dao_m = require('../sql/meeting');
	var complete_flag = 0;
	var params = { 
		idx_meeting:req.param("idx_meeting")
	};
	var result = { meeting:{} };

	dao_m.dao_get_meeting(evt, mysql_conn, params);
	evt.on('get_meeting', function(err, rows){
		if(err) throw err;
		complete_flag++;
		result.meeting = rows;
		result.idx_user = req.session.idx_user;	// idx_user
		result.idx_group = req.session.idx_group;	// idx_group
		result.idx_meeting = req.param("idx_meeting");	// idx_meeting
		console.log(result);
		if( complete_flag === _MEETING_FLAG_CNT )
			res.render('meeting', { result:result });
	});
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
	/** session start **/
	//if( !req.session.email || typeof req.session.email === "undefined" )
	//	res.redirect("/");
	/** session end **/
	res.render('meeting_evaluation', { title: 'Express' });
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
		if( complete_flag === _APPRAISAL_COMPLETE_FLAG_CNT ) {
			res.redirect("/page/meeting_result");
		}
	});
};

exports.post_meeting_close = function(req, res){

	var result;
	/** session start **
	if( !req.session.email || typeof req.session.email === "undefined" )
	{
		result = { result:"failed", msg:"You should be logged.", target:"" };
		res.send(result);
	}
	/** session end **/

	var evt = new EventEmitter();
	var dao_c = require('../sql/common');
	var dao_m = require('../sql/meeting');
	var params = { 
		idx_meeting:req.session.idx_meeting,	 
		idx_group:req.session.idx_group,
		idx_user:req.session.idx_user
	};
	var complete_flag = 0;

	if( params['idx_meeting'].length < 1 )
	{
		result = { result:"failed", msg:"You should select meeting", target:"" };
		res.send(result);
	}
	else
		dao_m.dao_set_meeting_close(evt, mysql_conn, params);

	evt.on('set_meeting_close', function(err, rows){
		if(err) throw err;
		result = { result:"successful", msg:"successful"  };
		res.send(result);
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
	var params = {};
	var result = { meeting_result:{}, meeting_result_appraisal:{}, meeting_tools_image:{} };
	var complete_flag = 0;

	dao_m.dao_get_meeting_result(evt, mysql_conn, params);
	evt.on('get_meeting_result', function(err, rows){
		if(err) throw err;
		result.meeting_result = rows;
		complete_flag++;
		if( complete_flag === _RESULT_COMPLETE_FLAG_CNT )
			res.render('meeting_result', {result:result} );
	});

	dao_m.dao_get_meeting_result_appraisal(evt, mysql_conn, params);
	evt.on('get_meeting_result_appraisal', function(err, rows){
		if(err) throw err;
		result.meeting_result_appraisal = rows;
		complete_flag++;
		if( complete_flag === _RESULT_COMPLETE_FLAG_CNT )
			res.render('meeting_result', {result:result} );
	});

	var idx_params = {
		idx_meeting:req.session.idx_meeting,	 
		idx_group:req.session.idx_group
	};

	dao_m.dao_get_meeting_tools_image(evt, mysql_conn, idx_params);
	evt.on('get_meeting_tools_image', function(err, rows){
		if(err) throw err;
		result.meeting_tools_image = rows;
		complete_flag++;
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

exports.meeting_save = function(req, res){
	/** session start **/
	//if( !req.session.email || typeof req.session.email === "undefined" )
	//	res.redirect("/");
	/** session end **/
	
	var evt = new EventEmitter();
	var dao_m = require('../sql/meeting');

	////  redis 클라이언트 생성  ////
	var redis = require('redis'), 
		client = redis.createClient(6379, '61.43.139.70'), multi;

	var tmpGroup = "group1";
	var tmpTool = "matrix1";
	var tmpOrder = tmpGroup+":"+tmpTool+":order";
	var tmpOption = tmpGroup+":"+tmpTool+":options";
	var params = {};
	var dataCnt = 0;
	var dataCompleteFlag = 0;
	var dataFlag = false;
	var optionsCnt = 0;
	var optionsCompleteFlag = 0;
	var optionsFlag = false;
	
	// data 
	client.keys("group1:*:order", function(err, replies) {
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
								var idx_meeting = 1;
								var idx_group = 1;
								var idx_tool = 1;
								params['idx_meeting'] = idx_meeting;
								params['idx_group'] = idx_group;
								params['idx_tool'] = idx_tool;
								params['delimiter'] = dataSplit[0]+":"+dataSplit[1];
								params['key'] = dataSplit[2];
								params['parent'] = parentSplit[2];
								params['value'] = val;
								params['type'] = 'data';
								params['client'] = client;
								dao_m.dao_set_meeting_save_data(evt, mysql_conn, params);
								//var err = null;
								//var rows = null;
								//evt.emit('set_meeting_save_data', err, rows);
							});
						});
					});
				});
			});
		});
	});
	
	// options
	client.keys("group1:*:options", function(err, replies) {
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
						var idx_meeting = 1;
						var idx_group = 1;
						var idx_tool = 1;
						params['idx_meeting'] = idx_meeting;
						params['idx_group'] = idx_group;
						params['idx_tool'] = idx_tool;
						params['delimiter'] = keySplit[0]+":"+keySplit[1];
						params['key'] = 0;
						params['parent'] = parentSplit[2];
						params['value'] = val;
						params['type'] = 'options';
						params['client'] = 0;
						dao_m.dao_set_meeting_save_options(evt, mysql_conn, params);
						//var err = null;
						//var rows = null;
						//evt.emit('set_meeting_save_options', err, rows);
					});
				});
			});
		});
	});

	evt.on('set_meeting_save_data', function(err, sql){
		if(err) throw err;
		dataCompleteFlag++;
		console.log("dataCompleteFlag : " + dataCompleteFlag + " / " + dataCnt);
		if( dataCnt === dataCompleteFlag )
			dataFlag = true;
		var redirectFlag = optionsFlag && dataFlag;
		if( redirectFlag )
			res.redirect("/page/meeting_result");
	});

	evt.on('set_meeting_save_options', function(err, sql){
		if(err) throw err;
		optionsCompleteFlag++;
		console.log("optionsCompleteFlag : " + optionsCompleteFlag + " / " + optionsCnt);
		if( optionsCnt === optionsCompleteFlag )
			optionsFlag = true;
		var redirectFlag = optionsFlag && dataFlag;
		if( redirectFlag )
			res.redirect("/page/meeting_result");
	});
};

exports.ft_help = function(req, res){
	result = { title:"ft_help" };
	res.render('ft_help', {result:result} );
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

