var io = require('socket.io').listen(8000);
var redis = require("redis"), 
	client = redis.createClient();

//redis 데이터 초기화
client.flushdb();
client.hset("root", 100, "");
////////////////////////////////////


io.sockets.on('connection', function (socket) {
	
	client.hgetall("root", function (err, childs) {
		console.dir(childs);
		socket.emit('open', {parent: "root"});
		socket.emit('open', childs);
	});
	client.lrange("datatree", 0, 200, function (err, replies) {
		replies.forEach( function (idNum, index) {
			client.hlen(idNum, function (err, childNum){
				if ( parseInt(childNum) > 0 )
				{
					client.hgetall(idNum, function (err, childs) {
						console.dir(childs);		
						socket.emit('open', {parent: idNum});
						socket.emit('open', childs);
					});
				}
			});
		});
	});

	socket.on('set_data', function (data) {
		console.log(data);

		var tmpId = data.id;
		var tmpParent = data.parent;
		var tmpIndex = data.index;
		var tmpVal = data.val;
				
		if ( tmpParent == "0" )
		{
			client.hset("root", tmpId, tmpVal);
		}
		else 
		{
			client.hset(tmpParent, tmpId, tmpVal);	
		}
		
		client.llen("datatree", function (err, idVal) {
			if (idVal == 0) 
			{
				client.lpush("datatree", tmpId);
				socket.broadcast.emit('get_data', { id: tmpId, parent: tmpParent, index: tmpIndex, val: tmpVal });
			}
			else
			{
				//현재 위치에 ID 중복되는지 확인
				client.lindex("datatree", tmpIndex, function (err, preId) {
					//console.log("tmpIndex: "+tmpIndex+ "// reply2: " +reply2);
					if ( preId != tmpId )
					{
						client.lindex("datatree", tmpIndex-1, function (err, reply) {
							console.log("==============================");
							console.log("preId: "+reply+" // tmpId: "+tmpId);
							console.log("id: "+tmpId+"//  tmpVal: "+tmpVal+"// tmpIndex: "+tmpIndex );
							client.linsert("datatree", "after", reply, tmpId);
							socket.broadcast.emit('get_data', { id: tmpId, parent: tmpParent, index: tmpIndex, val: tmpVal });
						});	
					}
					else
					{
						socket.broadcast.emit('get_data', { id: tmpId, parent: tmpParent, index: tmpIndex, val: tmpVal });
					}
				});	
			}
		});
		
	});
	
	socket.on('require_data', function (data) {
		var tmpSelectId = data.selectId;
		
		
		client.hgetall("root", function (err, childs) {
			console.dir(childs);	
			socket.broadcast.emit('get_data', childs);	 //자신을 제외한 다른 클라이언트들에게 브로드캐스트
		});
		
		client.lrange("datatree", 0, 200, function (err, replies) {
			replies.forEach( function (idNum, index) {
				client.hlen(idNum, function (err, childNum){
					if ( parseInt(childNum) > 0 )
					{
						client.hgetall(idNum, function (err, childs) {
							console.dir(childs);	
							socket.broadcast.emit('get_data', childs);
						});
					}
				});
			});
		});

		
		/*

		client.lrange("datatree", 0, 200, function (err, replies) {
			replies.forEach( function (idNum, index) {
				console.log("index: "+index+" idNum: "+idNum);
			});
		});


		*/
	});
	
	socket.on('click_child', function (data) {
		var tmpSelectId = data.selectId;
		
		/*
		client.lrange("datatree", 0, 200, function (err, replies) {
			replies.forEach( function (idx, data) {
				console.log("idx: "+idx+"// data: "+data);
			});
		});
		*/
		client.hlen(tmpSelectId, function (err, childNum){
			if ( parseInt(childNum) > 0 )
			{
				client.hgetall(tmpSelectId, function (err, childs) {
					console.dir(childs);	
				});
			}
		});
		
	});

	
});

