
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , meeting = require('./routes/meeting')
  , quick_meeting = require('./routes/quick_meeting')
  , meeting_planning = require('./routes/meeting_planning')
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
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(require('stylus').middleware(__dirname + '/' + _upload_dir));
  app.use(express.static(path.join(__dirname, _upload_dir)));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/page/meeting', meeting.main);
app.get('/page/quick_meeting', quick_meeting.quick_meeting);
app.get('/page/meeting_template', meeting_planning.meeting_template);
app.get('/page/setting_agenda', meeting_planning.setting_agenda);
app.get('/page/setting_agenda_step', meeting_planning.setting_agenda_step);
app.get('/page/users', user.list);

app.post('/ajax/set_meeting_planning', meeting_planning.set_meeting_planning);

app.post('/lib/upload', function(req, res) {
	console.log(JSON.stringify(req.files));
 
    var serverPath = '/' + _upload_dir + '/' + req.files.uploadFile.name;
	console.log('serverPath : ' + __dirname + "/" + serverPath);	// 윈도우에서 테스트할 때는 /를 \\로 그치기
 
 	var fs = require('fs'),
    util = require('util');

	var is = fs.createReadStream(req.files.uploadFile.path);
	var os = fs.createWriteStream(__dirname + "/" + serverPath);	// 윈도우에서 테스트할 때는 /를 \\로 그치기
	
	util.pump(is, os, function() {
	    fs.unlinkSync(req.files.uploadFile.path);
	    res.send({
            filename: req.files.uploadFile.name,
            filetype: req.files.uploadFile.type
		});
	});
 
 	// 권한 문제로 시스템마다 작동여부가 다름
    /*require('fs').rename(
		req.files.uploadFile.path,
		'.' + serverPath,
		//__dirname + "\\" + serverPath,
		function(error) {
            if(error) {
            	console.log(error);
				res.send({
                    error: 'Ah crap! Something bad happened'
				});
                return;
            }
 
            res.send({
				path: serverPath
            });
		}
    );*/
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
