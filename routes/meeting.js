var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;

var _APPRAISAL_COMPLETE_FLAG_CNT = 1;
var _RESULT_COMPLETE_FLAG_CNT = 2;
var _MEETING_FLAG_CNT = 1;

exports.main = function(req, res){

	var agent = req.headers['user-agent'];
	if( agent.toString().indexOf("MSIE") > 0 )
	{
		res.render('no_explorer', {} );
		return;
	}

	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/

	var evt = new EventEmitter();
	var dao_m = require('../sql/meeting');
	var complete_flag = 0;
	var params = { 
		idx_meeting:req.param("idx_meeting")
	};

	dao_m.dao_get_meeting(evt, mysql_conn, params);
	evt.on('get_meeting', function(err, rows){
		if(err) throw err;
		complete_flag++;
		console.log(rows);
		if( complete_flag === _MEETING_FLAG_CNT )
			res.render('meeting', { title: 'Express' });
	});

	//res.render('meeting', { title: 'Express' });
};

exports.meeting_public = function(req, res){
	res.render('meeting_public', { title: 'Express' });
};

exports.meeting_appraisal = function(req, res){
	/** session start **/
	//if( !req.session.email || !req.session.email.length )
	//	res.redirect("/");
	/** session end **/
	res.render('meeting_appraisal', { title: 'Express' });
};


exports.meeting_evaluation = function(req, res){
	/** session start **/
	//if( !req.session.email || !req.session.email.length )
	//	res.redirect("/");
	/** session end **/
	res.render('meeting_evaluation', { title: 'Express' });
};

exports.post_meeting_appraisal = function(req, res){
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


exports.meeting_result = function(req, res){
	/** session start **/
	//if( !req.session.email || !req.session.email.length )
	//	res.redirect("/");
	/** session end **/

	var evt = new EventEmitter();
	var dao_c = require('../sql/common');
	var dao_m = require('../sql/meeting');
	var params = {};
	var result = { meeting_result:{}, meeting_result_appraisal:{} };
	var complete_flag = 0;

	dao_m.dao_get_meeting_result(evt, mysql_conn, params);
	evt.on('get_meeting_result', function(err, rows){
		if(err) throw err;
		result.meeting_result = rows;
		complete_flag++;
		console.log(rows);
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
};

exports.minutes = function(req, res){
	/** session start **/
	//if( !req.session.email || !req.session.email.length )
	//	res.redirect("/");
	/** session end **/

	res.render('minutes', { title: '' });
};

exports.meeting_save = function(req, res){
	/** session start **/
	//if( !req.session.email || !req.session.email.length )
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
}