var mysql_conn = require('../sql/mysql_server').mysql_conn;
var EventEmitter = require('events').EventEmitter;
var util = require('../lib/util');
var check = require('validator').check,
    sanitize = require('validator').sanitize;

var _COMPLETE_FLAG_CNT = 1;

exports.main = function(req, res){
	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/
	
	console.log("CALL meeting.main");
	console.log(req);

	res.render('meeting', { title: 'Express' });
};

exports.meeting_appraisal = function(req, res){
	/** session start **/
	if( !req.session.email || !req.session.email.length )
		res.redirect("/");
	/** session end **/

	res.render('appraisal', { title: 'Express' });
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
	var result = { meeting_result:{} };
	var complete_flag = 0;

	dao_m.dao_get_meeting_result(evt, mysql_conn, params);
	evt.on('get_meeting_result', function(err, rows){
		if(err) throw err;
		result.meeting_result = rows;
		complete_flag++;
		if( complete_flag === _COMPLETE_FLAG_CNT )
			res.render('meeting_result', {result:result} );
	});
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
							});
						});
					});
				});
			});
		});
	});
	
	// options
	client.keys("group1:*:options", function(err, replies) {	
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
					});
				});
			});
		});
	});

	evt.on('set_meeting_save_data', function(err, sql){
		if(err) throw err;
		dataCompleteFlag++;
		if( dataCnt === dataCompleteFlag )
			dataFlag = true;
		var redirectFlag = optionsFlag && dataFlag;
		if( redirectFlag )
			res.redirect("/page/meeting_result");
	});

	evt.on('set_meeting_save_options', function(err, sql){
		if(err) throw err;
		optionsCompleteFlag++;
		if( optionsCnt === optionsCompleteFlag )
			optionsFlag = true;
		var redirectFlag = optionsFlag && dataFlag;
		if( redirectFlag )
			res.redirect("/page/meeting_result");
	});
};
