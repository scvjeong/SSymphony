var express = require('express')
  , routes = require('./routes')
  , main = require('./routes/main')
  , meeting = require('./routes/meeting')
  , quick_meeting = require('./routes/quick_meeting')
  , meeting_planning = require('./routes/meeting_planning')
  , tools = require('./routes/tools')
  , http = require('http')
  , path = require('path');

var app = express();

var _upload_dir = 'tmp';

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('keyboard cat'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
	app.use('/' + _upload_dir, express.static(path.join(__dirname, _upload_dir)));	// 업로드 디렉토리 static 등재
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', main.main);
app.get('/page/meeting_list', routes.meeting_list);
app.get('/page/meeting', meeting.main);
app.get('/page/meeting_appraisal', meeting.meeting_appraisal);
app.get('/page/meeting_result', meeting.meeting_result);
app.get('/page/quick_meeting', quick_meeting.quick_meeting);
app.get('/page/meeting_template', meeting_planning.meeting_template);
app.get('/page/setting_agenda', meeting_planning.setting_agenda);
app.get('/page/setting_agenda_step', meeting_planning.setting_agenda_step);
app.post('/ajax/set_meeting_planning', meeting_planning.set_meeting_planning);
app.post('/page/login', main.login);
app.post('/page/meeting_save', meeting.meeting_save);

app.get('/tools/list/list', tools.list);

app.post('/lib/upload', function(req, res) {
	console.log(JSON.stringify(req.files)); 
	console.log('serverPath : ' + targetPath);
 	
  	var fs = require('fs');
 	var util = require('util');
 
    var serverPath = '/' + _upload_dir + '/' + req.files.uploadFile.name;	
 	var targetPath = path.join(__dirname, serverPath);

	var is = fs.createReadStream(req.files.uploadFile.path);
	var os = fs.createWriteStream(targetPath);
	
	util.pump(is, os, function() {
	    fs.unlinkSync(req.files.uploadFile.path);
	    res.send({
            filename: req.files.uploadFile.name,
            filetype: req.files.uploadFile.type
		});
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});