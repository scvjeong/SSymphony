var io = require('socket.io').listen(8000);
var redis = require("redis"), 
	client = redis.createClient();

var lastId = 101;
//redis 데이터 초기화
client.flushdb();
client.hset(100, 0, "");
client.lpush("datatree", 100);


////////////////////////////////////

var meeting = io.of('/meeting2').on('connection', function (socket) {

});

var meeting = io.of('/meeting').on('connection', function (socket) {
	
	//초기 데이터 가져오는 부분
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
	//console.log("lastId: "+lastId);
	
	//클라이언트가 전송한 데이터 저장하는 부분
	socket.on('set_data', function (data) {
		console.log(data);

		var tmpId = data.id;
		var tmpParent = data.parent;
		var tmpIndex = data.index;
		var tmpVal = data.val;
		
		//부모 필드 존재하는지 검사
		client.hlen(tmpId, function (err, num) {
			if ( num > 0 )
			{
				client.del(tmpId);
				
			}
			client.hset(tmpId, tmpParent, tmpVal);
		});	
		
		lastId = parseInt(lastId) + 1;

		client.llen("datatree", function (err, idVal) {			
			//현재 위치에 ID 중복되는지 확인
			client.lindex("datatree", tmpIndex, function (err, preId) {
				console.log("========================");
				console.log("tmpIndex: "+tmpIndex+ "// preId: " +preId);
				if ( preId != tmpId )
				{
					client.lindex("datatree", tmpIndex-1, function (err, reply) {
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
		});
		
	});

	socket.on('get_id', function (data) {
		socket.emit('last_id', { id: lastId });
	});

	socket.on('new_indent', function (data) {
		var changeId = data.id;
		var changeIndent = data.indent;
		socket.broadcast.emit('change_indent', { id: changeId, indent: changeIndent });
	});
	
	//클라이언트에서 삭제한 데이터 삭제하는 부분
	socket.on('del_data', function (data) {
		var delId = data.id;
		console.log("========================");
		console.log("delId: "+delId);
		client.hkeys(delId, function (err, parent) {
			client.hdel(delId, parent);	
		});
		client.lrem("datatree", 0, delId);	

		socket.broadcast.emit('del_list', { id: delId });
	});
	
	//Home 클릭시 데이터 가져오는 부분
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
	
	//Bullet 클릭시 
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

	
});

