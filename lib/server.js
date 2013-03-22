var io = require('socket.io').listen(8000);
var redis = require("redis"), 
	client = redis.createClient(6379, '61.43.139.70');

////  mysql 접속  ////
var mysql = require('mysql');
var sqlConnection = mysql.createConnection({
	host	:	'61.43.139.70',
	user	:	'symphony',
	password	:	'dhzptmxmfk',
});
sqlConnection.connect();

var lastId = 101;		//lastId 변수
var lastClient = 1;

////  redis 데이터 초기화  ////
client.flushdb();
client.hset(100, 0, "");
client.lpush("datatree", 100);

////  group 채널 개설  ////
var meeting = io.of('/group').on('connection', function (socket) {

	var roomNum = null;
	console.log("Connect group");

	////  room 접속하는 부분  ////
	socket.on('join_room', function(data) {
		socket.join(data);
		roomNum = data;
		console.log("Join "+roomNum);
	});

	////  클라이언트 접속시 redis DB에 저장되어 있는 데이터 가져오는 부분  ////
	client.lrange("datatree", 0, -1, function (err, replies) {	
		replies.forEach( function (idNum, index) {
			//console.log("id: "+idNum);
			client.hkeys(idNum, function (err, parentNum){
				//console.log("parent: "+parentNum);
				client.hget(idNum, parentNum, function (err, val) {
					//console.dir("val: "+val);		
					socket.emit('open', {id: idNum, parent: parentNum, val: val});	//클라이언트의 'on' 소켓으로 데이터 전달
				});
			});
		});
	});

	////  클라이언트에게 Client 번호 전달 후 Clinet 번호 증가  ////
	socket.emit('get_client', { client: lastClient });
	if ( lastClient < 5 ) {
		lastClient = lastClient + 1;
	}
	else {
		lastClient = 1;
	}
	//console.log("lastId: "+lastId);
	
	////  Clear 클릭시 DB 초기화하고 클라이언트들로 데이터 전송  ////
	socket.on('set_init', function (data) {
		client.flushdb();
		client.hset(100, 0, "");
		client.lpush("datatree", 100);
		lastId = 101;	
		socket.broadcast.to(roomNum).emit('get_init', 'Init Data');
		////  클라이언트 접속시 redis DB에 저장되어 있는 데이터 가져오는 부분  ////
		client.lrange("datatree", 0, -1, function (err, replies) {	
			replies.forEach( function (idNum, index) {
				//console.log("id: "+idNum);
				client.hkeys(idNum, function (err, parentNum){
					//console.log("parent: "+parentNum);
					client.hget(idNum, parentNum, function (err, val) {
						//console.dir("val: "+val);		
						socket.emit('open', {id: idNum, parent: parentNum, val: val});	//클라이언트의 'on' 소켓으로 데이터 전달
						socket.broadcast.to(roomNum).emit('open', {id: idNum, parent: parentNum, val: val});	//클라이언트의 'on' 소켓으로 데이터 전달
					});
				});
			});
		});
	});

	////  클라이언트가 입력 시작한 경우  ////
	socket.on('set_start', function (data) {
		
		var setId = data.id;
		var setParent = data.parent;
		var setIndex = data.index;
		var setClient = data.client;
		
		socket.broadcast.to(roomNum).emit('get_start', {  id: setId, parent: setParent, index: setIndex, client: setClient } );

	});

	////  클라이언트가 전송한 데이터 저장하는 부분  ////
	socket.on('set_data', function (data) {
		//console.log(data);
		var tmpId = data.id;	
		var tmpParent = data.parent;
		var tmpIndex = data.index;
		var tmpVal = data.val;
		
		////  부모 필드 존재하는지 검사  ////
		client.hlen(tmpId, function (err, num) {
			if ( num > 0 )
			{
				client.del(tmpId);	//부모 필드 존재시 두명의 부모 갖는걸 방지하기 위해 삭제
			}
			client.hset(tmpId, tmpParent, tmpVal);	 //hash에 데이터 저장
		});	
		
		lastId = parseInt(lastId) + 1;	 //lastId 1 증가

		////  list에서 현재 위치에 ID 중복되는지 확인  ////
		client.llen("datatree", function (err, idVal) {			
			client.lindex("datatree", tmpIndex, function (err, preId) {
				//console.log("tmpIndex: "+tmpIndex+ "// preId: " +preId);
				if ( preId != tmpId )	//Id 다를때
				{
					client.lindex("datatree", tmpIndex-1, function (err, reply) {
						//console.log("id: "+tmpId+"//  tmpVal: "+tmpVal+"// tmpIndex: "+tmpIndex );
						client.linsert("datatree", "after", reply, tmpId);	//해당 인덱스 위치에 데이터 삽입			
					});	
				}
				socket.broadcast.to(roomNum).emit('get_data', { id: tmpId, parent: tmpParent, index: tmpIndex, val: tmpVal });
				//다른 클라이언트들의 'get_data' 소켓으로 데이터 전달
			});	
		});
		
	});

	////  클라이언트에서 lastId 요청시  ////
	socket.on('call_id', function (data) {	
		socket.emit('get_id', { id: lastId });
	});

	//// 클라이언트에서 들여쓰기 변경시  ////
	socket.on('set_indent', function (data) {
		var changeId = data.id;
		var changeIndent = data.indent;
		socket.broadcast.to(roomNum).emit('get_indent', { id: changeId, indent: changeIndent });
	});
	
	////  클라이언트에서 삭제한 데이터 redis DB에서 삭제하는 부분  ////
	socket.on('del_data', function (data) {
		var delId = data.id;
		//console.log("delId: "+delId);
		client.hkeys(delId, function (err, parent) {
			client.hdel(delId, parent);	
		});
		client.lrem("datatree", 0, delId);	

		socket.broadcast.to(roomNum).emit('del_list', { id: delId });
	});
	
	socket.on('set_check', function (data) {
		var checkId = data.id;

		socket.broadcast.to(roomNum).emit('get_check', { id: checkId });
	});

	/*
	////  Home 클릭시 데이터 가져오는 부분  ////
	socket.on('require_data', function (data) {
		client.lrange("datatree", 0, -1, function (err, replies) {
			replies.forEach( function (idNum, index) {
				//console.log("id: "+idNum);
				client.hkeys(idNum, function (err, parentNum){
					//console.log("parent: "+parentNum);
					client.hget(idNum, parentNum, function (err, val) {
						//console.dir("val: "+val);		
						socket.emit('open', {id: idNum, parent: parentNum, val: val});
					});			
				});
			});
		});
	});
	
	
	////  Bullet 클릭시  //// 
	socket.on('click_child', function (data) {
		var tmpSelectId = data.selectId;
		
		client.hlen(tmpSelectId, function (err, childNum){
			if ( parseInt(childNum) > 0 )
			{
				client.hgetall(tmpSelectId, function (err, childs) {
					console.dir(childs);	
				});
			}
		});		
	});
	*/
});

