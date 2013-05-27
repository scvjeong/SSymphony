/*
	종혁이 파괴 방지 주석
	13.05.27 02시 - 투표 진행 함수 구현
*/

function server(io)
{
	////  group 채널 개설  ////
	var meeting = io.of('/group').on('connection', function (socket) {
		console.log("Connect group");

		////  그룹에 join하는 함수  ////
		socket.on('join_room', function(data) {
			console.log("Call: join_room");
			var tmpGroup = data.group;
			socket.join(tmpGroup);
			console.log("Join "+tmpGroup);
		});

		////  유저 정보 리스트에 저장하여 관리하는 함수  ////
		socket.on('set_client', function(data) {
			console.log("Call: set_client");
			var tmpGroup = data.group;
			var tmpUser = data.user;
			
			var userInfo = tmpGroup+":user";
			var userNum = -1;
			var countUser = 0;

			////  해당 user가 리스트에 존재하는지 확인해서 없으면 추가  ////
			client.llen(userInfo, function (err, num) {
				countUser = num;					
				client.lrange(userInfo, 0, -1, function (err, replies) {	
					replies.forEach( function (user, index) {
						console.log("user: "+user);
						if ( user == tmpUser ) {		//해당 user가 존재할 때
							userNum = index;
						}
					});
					if ( userNum == -1 ) {	//user가 존재하지 않을 때
						client.rpush(userInfo, tmpUser);
						userNum =countUser;
						_lastClient = userNum;
					}
					socket.emit('get_client', { client: userNum });
				});
			});	
		});

		////  클라이언트 해당 tool의 lastId 요청 처리하는 함수  ////
		socket.on('set_last_id', function(data) {
			console.log("Call: set_last_id");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpLastId = 101;
			
			var tmpCheckArray = _idArray.toString();
			//console.log("tmpArray:  "+tmpCheckArray);
			if ( tmpCheckArray.indexOf(tmpTool) < 0 ) {	//배열에 현재 도구 lastId 없을 때
				_idArray.push(tmpTool);
				_idArray[tmpTool] = 101;
			}
			else {
				_idArray[tmpTool] = parseInt(_idArray[tmpTool]) + 1;	 //해당 도구의 lastId 1 증가
				tmpLastId = _idArray[tmpTool];	
			}

			////  클라이언트로 lastId 전달  ////
			socket.emit('get_last_id', { tool: tmpTool, last: tmpLastId });
		});
		
		////  클라이언트 해당 tool의 데이터 요청 처리하는 함수  ////
		socket.on('set_data', function(data) {
			console.log("Call: set_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			
			client.lindex(tmpOrder, 0, function (err,reply) {
				if ( reply == null ) {
					var tmpId = tmpOrder.replace("order", "100");	
					client.lpush(tmpOrder, tmpId);
					client.set(tmpId, "");
				}	
				//console.log("tmpOrder: "+tmpOrder);
				client.lrange(tmpOrder, 0, -1, function (err, replies) {	
					//console.log("test: "+replies);
					replies.forEach( function (idNum, index) {
						client.get(idNum, function (err, val) {
							var splitArray = idNum.toString().split(':');
							var sendId = splitArray[2];						
							var sendVal = val;
							
							////  클라이언트로 데이터 전달  ////
							socket.emit('get_data', { tool: tmpTool, id: sendId, val: sendVal });	
						});
					});
				});
			});			
		});

		////  클라이언트 해당 tool의 데이터 요청 처리하는 함수_tree  ////
		socket.on('set_tree_data', function(data) {
			console.log("Call: set_tree_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			var tmpOption = tmpGroup+":"+tmpTool+":options";
			
			client.lindex(tmpOrder, 0, function (err,reply) {
				if ( reply == null ) {
					var tmpId = tmpOrder.replace("order", "100");
					var tmpParent = tmpOrder.replace("order", "0");
					client.lpush(tmpOrder, tmpId);
					client.hset(tmpId, tmpParent, "");
				}

				// order return 
				client.lrange(tmpOrder, 0, -1, function (err, replies) {	
					replies.forEach( function (idNum, index) {
						//console.log("id: "+idNum);
						client.hkeys(idNum, function (err, parentNum){
							//console.log("parent: "+parentNum);
							client.hget(idNum, parentNum, function (err, val) {
								//console.dir("val: "+val);					
								var splitArray = idNum.toString().split(":");
								var sendId = splitArray[2];
								splitArray = parentNum.toString().split(":");
								var sendParent = splitArray[2];
								var sendVal = val;

								////  클라이언트로 데이터 전달_tree  ////
								socket.emit('get_tree_data', { tool: tmpTool, id: sendId, parent: sendParent, val: sendVal });	
							});
						});
					});
				});	
			});				
		});

		////  클라이언트 해당 tool의 옵션 데이터 요청 처리하는 함수_tree  ////
		socket.on('set_tree_option_data', function(data) {
			console.log("Call: set_tree_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpOption = tmpGroup+":"+tmpTool+":options";
			// option return
			client.hkeys(tmpOption, function (err, replies) {
				replies.forEach(function (reply, i) {
					client.hget(tmpOption, reply, function(err, val){
						var splitOption = reply.toString().split(":");
						var option = splitOption[2];
						socket.emit('get_tree_option_data', { tool: tmpTool, id: '', option: option, val: val });
					})
				});
			});
		});

		////  클라이언트가 입력 시작한 경우 전달된 데이터 처리하는 함수  ////
		socket.on('set_input_data', function (data) {
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var setId = data.id;
			var setIndex = data.index;
			var setClient = data.client;

			////  다른 클라이언트들에게 데이터 전달  ////
			socket.broadcast.to(tmpGroup).emit('get_input_data', {  tool: tmpTool, id: setId, index: setIndex, client: setClient } );

		});

		////  클라이언트가 입력 시작한 경우 전달된 데이터 처리하는 함수_tree  ////
		socket.on('set_input_tree_data', function (data) {
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var setId = data.id;
			var setParent = data.parent;
			var setIndex = data.index;
			var setClient = data.client;

			////  다른 클라이언트들에게 데이터 전달_tree  ////
			socket.broadcast.to(tmpGroup).emit('get_input_tree_data', { tool:tmpTool, id: setId, parent: setParent, index: setIndex, client: setClient } );
		});

		////  클라이언트가 depth 변경한 경우 전달된 데이터 처리하는 함수_tree  ////
		socket.on('set_change_depth', function (data) {
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var setId = data.id;
			var setDepth = data.depth;

			// Redis 데이터 변경하는 부분 필요...

			////  다른 클라이언트들에게 변경된 depth 전달_tree  ////
			socket.broadcast.to(tmpGroup).emit('get_change_depth', { tool:tmpTool, id: setId, depth: setDepth } );
		});

		////  클라이언트가 parent 변경한 경우 전달된 데이터 처리하는 함수_tree  ////
		socket.on('set_change_parent', function (data) {
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var setId = data.id;
			var setParent = data.parent;

			////  부모 필드 존재하는지 검사  ////
			client.hlen(storeId, function (err, num) {
				client.hkeys(storeId, function (err, parent) {
					multi = client.multi();
					multi.hdel(storeId, parent);	
					multi.hset(storeId, storeParent, tmpVal);	 //hash에 데이터 저장
					multi.exec();
				});		
			});	

			////  다른 클라이언트들에게 변경된 parent 전달_tree  ////
			socket.broadcast.to(tmpGroup).emit('get_change_parent', { tool:tmpTool, id: setId, parent: setParent } );
		});

		////  클라이언트 해당 tool에 추가된 값을 DB에 저장  ////
		socket.on('set_insert_data', function(data) {
			console.log("Call: insert_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpId = data.id;	
			var tmpIndex = data.index;
			var tmpVal = data.val;
			var tmpClient = data.client;
		
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			var storeId = tmpGroup + ":" + tmpTool + ":" + tmpId;	
			var clientId = tmpGroup + ":" + tmpTool + ":" + tmpId + ":client";
			
			multi = client.multi();
			multi.set(storeId, tmpVal);	 //key에 데이터 저장
			multi.set(clientId, tmpClient);	//key에 클라이언트 ID 저장
			multi.exec();

			////  list에서 현재 위치에 ID 중복되는지 확인  ////
			client.llen(tmpOrder, function (err, idVal) {			
				client.lindex(tmpOrder, tmpIndex, function (err, preId) {
					//console.log("stroeId: "+storeId+ "// preId: " +preId);
					if ( preId != storeId )	//Id 다를때
					{
						console.log("Index: " + tmpIndex)
						client.lindex(tmpOrder, tmpIndex-1, function (err, reply) {
							//console.log("tmpOrder: " + tmpOrder +"id: "+tmpId+"//  tmpVal: "+tmpVal+"// tmpIndex: "+tmpIndex );
							client.linsert(tmpOrder, "after", reply, storeId);	//해당 인덱스 위치에 데이터 삽입		
						});	
					}
			
					////  다른 클라이언트들에게 추가된 값 전달  ////
					socket.broadcast.to(tmpGroup).emit('get_insert_data', {tool: tmpTool, id: tmpId, index: tmpIndex, val: tmpVal, client: tmpClient });
				});	
			});
		});


		////  클라이언트 해당 tool에 추가된 값을 DB에 저장_tree  ////
		socket.on('set_insert_tree_data', function(data) {
			console.log("Call: insert_tree_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpId = data.id;	
			var tmpParent = data.parent;
			var tmpIndex = data.index;
			var tmpVal = data.val;
			var tmpClient = data.client;
		
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			var storeId = tmpGroup + ":" + tmpTool + ":" + tmpId;
			var storeParent = tmpGroup + ":" + tmpTool + ":" + tmpParent;
			var clientId = tmpGroup + ":" + tmpTool + ":" + tmpId + ":client";
			console.log("Id: "+tmpId+" / Parent: "+tmpParent+" / Val: "+tmpVal);		
			
			////  부모 필드 존재하는지 검사  ////
			client.hlen(storeId, function (err, num) {
				if ( num > 0 )
				{
					client.hkeys(storeId, function (err, parent) {
						multi = client.multi();
						multi.hdel(storeId, parent);	
						multi.hset(storeId, storeParent, tmpVal);	 //hash에 데이터 저장
						multi.set(clientId, tmpClient);	//key에 클라이언트 ID 저장
						multi.exec();
					});
				}
				else
				{
					multi = client.multi();
					multi.hset(storeId, storeParent, tmpVal);	 //hash에 데이터 저장
					multi.set(clientId, tmpClient);	//key에 클라이언트 ID 저장
					multi.exec();
				}
			});	
			
			////  list에서 현재 위치에 ID 중복되는지 확인  ////
			client.llen(tmpOrder, function (err, idVal) {			
				client.lindex(tmpOrder, tmpIndex, function (err, preId) {
					//console.log("stroeId: "+storeId+ "// preId: " +preId);
					if ( preId != storeId )	//Id 다를때
					{
						client.lindex(tmpOrder, tmpIndex-1, function (err, reply) {
							//console.log("id: "+tmpId+"//  tmpVal: "+tmpVal+"// tmpIndex: "+tmpIndex );
							client.linsert(tmpOrder, "after", reply, storeId);	//해당 인덱스 위치에 데이터 삽입			
						});	
					}
					////  다른 클라이언트들에게 추가된 값 전달_tree  ////
					socket.broadcast.to(tmpGroup).emit('get_insert_tree_data', { tool: tmpTool, id: tmpId, parent: tmpParent, index: tmpIndex, val: tmpVal, client: tmpClient });
				});	
			});
		});


		////  클라이언트 해당 tool에 추가된 값을 DB에 저장_tree  ////
		socket.on('set_insert_vote_data', function(data) {
			console.log("Call: insert_tree_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpId = data.id;	
			var tmpParent = data.parent;
			var tmpIndex = data.index;
			var tmpVal = data.val;
			var tmpClient = data.client;
		
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			var storeId = tmpGroup + ":" + tmpTool + ":" + tmpId;
			var storeParent = tmpGroup + ":" + tmpTool + ":" + tmpParent;
			var clientId = tmpGroup + ":" + tmpTool + ":" + tmpId + ":client";
			console.log("Id: "+tmpId+" / Parent: "+tmpParent+" / Val: "+tmpVal);		
	
			multi = client.multi();
			multi.hset(storeId, storeParent, tmpVal);	 //hash에 데이터 저장
			multi.set(clientId, tmpClient);	//key에 클라이언트 ID 저장
			multi.exec();
		
			////  list에서 현재 위치에 ID 중복되는지 확인  ////
			client.llen(tmpOrder, function (err, idVal) {			
				client.lindex(tmpOrder, tmpIndex, function (err, preId) {
					console.log("stroeId: "+storeId+ "// preId: " +preId);
					if ( preId != storeId )	//Id 다를때
					{
						client.lindex(tmpOrder, tmpIndex-1, function (err, reply) {
							//console.log("id: "+tmpId+"//  tmpVal: "+tmpVal+"// tmpIndex: "+tmpIndex );
							client.linsert(tmpOrder, "after", reply, storeId);	//해당 인덱스 위치에 데이터 삽입			
						});	
					}
					////  다른 클라이언트들에게 추가된 값 전달_tree  ////
					socket.broadcast.to(tmpGroup).emit('get_insert_vote_data', { tool: tmpTool, id: tmpId, parent: tmpParent, index: tmpIndex, val: tmpVal, client: tmpClient });
				});	
			});
		});

		////  클라이언트 해당 tool에 삭제된 값을 DB에서 제거  ////
		socket.on('set_delete_data', function(data) {
			console.log("Call: set_delete_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpId = data.id;	
			
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			var delId = tmpGroup + ":" + tmpTool + ":" + tmpId;
			var delClient = tmpGroup + ":" + tmpTool + ":" + tmpId + ":client";

			multi = client.multi();
			multi.del(delId);	
			multi.del(delClient);
			multi.lrem(tmpOrder, 0, delId);	
			multi.exec();
			////  다른 클라이언트들에게 삭제된 값 전달  ////
			socket.broadcast.to(tmpGroup).emit('get_delete_data', { tool: tmpTool, id: tmpId });
		});
		
		////  클라이언트 해당 tool에 삭제된 값을 DB에서 제거_tree  ////
		socket.on('set_delete_tree_data', function(data) {
			console.log("Call: set_delete_tree_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpId = data.id;	
			
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			var delId = tmpGroup + ":" + tmpTool + ":" + tmpId;
			var delClient = tmpGroup + ":" + tmpTool + ":" + tmpId + ":client";
			//console.log("delId: "+delId);
				
			var tmpDelParent = 0;
			client.hkeys(delId, function (err, parent) {
				tmpDelParent = parent;
			});
			multi = client.multi();
			multi.hdel(delId, tmpDelParent);	
			multi.del(delClient);
			multi.lrem(tmpOrder, 0, delId);	
			multi.exec();

			////  다른 클라이언트들에게 삭제된 값 전달_tree  ////
			socket.broadcast.to(tmpGroup).emit('get_delete_tree_data', { tool: tmpTool, id: tmpId });
		});

		////  다른 도구 형태로 데이터 변경  ////
		socket.on('set_change_data', function(data) {
			console.log("Call: set_change_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var newTool= data.change;	
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			var newOrder = tmpGroup+":"+newTool+":order";		
					
			client.lindex(tmpOrder, 0, function (err,reply) {
				if ( reply == null ) {
		
				}	
				//console.log("tmpOrder: "+tmpOrder);
				client.lrange(tmpOrder, 0, -1, function (err, replies) {	
					//console.log("test: "+replies);
					replies.forEach( function (idNum, index) {
						client.get(idNum, function (err, val) {
							var newId = idNum.toString().replace(tmpTool, newTool);			
							var newVal = val;

							client.rpush(newOrder, newId);
							client.set(newId, newVal);
						});
					});
				});
			});	

			////  클라이언트는 change 받아서 새로 도구 창 띄우면 될 듯  ////
			socket.emit('get_change_data', { tool: tmpTool, change: newTool });	
			socket.broadcast.to(tmpGroup).emit('get_change_data', { tool: tmpTool, change: newTool });
		});

		////  다른 도구 형태로 데이터 변경_tree  ////
		socket.on('set_change_tree_data', function(data) {
			console.log("Call: set_change_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var newTool = data.change;	
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			var newOrder = tmpGroup+":"+newTool+":order";		

			client.lindex(tmpOrder, 0, function (err,reply) {
				if ( reply == null ) {

				}

				// order return 
				client.lrange(tmpOrder, 0, -1, function (err, replies) {	
					replies.forEach( function (idNum, index) {
						//console.log("id: "+idNum);
						client.hkeys(idNum, function (err, parentNum){
							//console.log("parent: "+parentNum);
							client.hget(idNum, parentNum, function (err, val) {
								//console.dir("val: "+val);	
								var newId = idNum.toString().replace(tmpTool, newTool);
								var newParent = parentNum.toString().replace(tmpTool, newTool);
								var newVal = val;
							
								client.rpush(newOrder, newId);
								client.hset(newId, newParent, newVal);

							});
						});
					});
				});	
			});	
		
			////  클라이언트는 change 받아서 새로 도구 창 띄우면 될 듯  ////
			socket.emit('get_change_tree_data', { tool: tmpTool, change: newTool });	
			socket.broadcast.to(tmpGroup).emit('get_change_tree_data', { tool: tmpTool, change: newTool });
		});

		////  해당 tool의 데이터 초기화  ////
		socket.on('set_init_tool_data', function(data) {
			console.log("Call: set_init_tool_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			var tmpOptions = tmpGroup+":"+tmpTool+":options";

			multi = client.multi();
			multi.del(tmpOrder).del(tmpOptions).exec();

			// 초기 인덱스가 있는지 확인후 없으면 추가
			client.lindex(tmpOrder, 0, function (err,reply) {
				if ( reply == null ) {
					var tmpInitId = tmpOrder.replace("order", "100");
					var tmpInitParent = tmpOrder.replace("order", "0");
					multi.lpush(tmpOrder, tmpInitId).hset(tmpInitId, tmpInitParent, "").exec();	
				}	
			});

			////  다른 클라이언트들에게 초기화된 tool 전달  ////
			socket.broadcast.to(tmpGroup).emit('get_init_tool_data', { tool: tmpTool });
		});

		////  클라이언트 tool의 옵션 데이터 처리하는 함수  ////
		socket.on('set_option_data', function(data) {
			console.log("Call: set_option_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpId = data.id;
			var tmpOption = data.option;
			var tmpVal = data.val;
			var optionKey = tmpGroup + ":" + tmpTool + ":options";
			var optionField = tmpGroup + ":" + tmpTool + ":" + tmpOption;

			multi = client.multi();
			multi.hset(optionKey, optionField, tmpVal).exec();

			////  다른 클라이언트들에게 tool의 옵션 데이터 전달  ////
			socket.broadcast.to(tmpGroup).emit('get_option_data', { tool: tmpTool, id: tmpId, option: tmpOption, val: tmpVal });
		});
		
		////  클라이언트 투표 도구의 데이터 요청 처리하는 함수  ////
		socket.on('set_vote_data', function(data) {
			console.log("Call: set_vote_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpOrder = tmpGroup+":"+tmpTool+":order";
			var tmpOption = tmpGroup+":"+tmpTool+":options";
			
			client.lindex(tmpOrder, 0, function (err,reply) {
				if ( reply == null ) {
					var tmpId = tmpOrder.replace("order", "100");
					var tmpParent = tmpOrder.replace("order", "0");
					client.lpush(tmpOrder, tmpId);
					client.hset(tmpId, tmpParent, "");
				}
			
				// order return 
				client.lrange(tmpOrder, 0, -1, function (err, replies) {	
					replies.forEach( function (idNum, index) {
						//console.log("id: "+idNum);
						var split_array = idNum.toString().split(":");
						var id_num = split_array[2];
						if ( id_num != 100)
						{
							client.hkeys(idNum, function (err, parentNum){
													
								var split_array = parentNum.toString().split(",");
								var i=0;
								for ( i=0; i<split_array.length; i++)
								{
									//var tmp_parent = split_array[i];
									client.hget(idNum, split_array[i], function (err, val) {
										console.log("id: "+idNum);					
										
										var id_split = idNum.toString().split(":");
										var sendId = id_split[2];
										console.log("parent: "+val+" // "+"id: "+sendId);
										var sendVal = val;
										
										////  클라이언트로 데이터 전달  ////
										socket.emit('get_vote_data', { tool: tmpTool, id: sendId, parent: sendId, val: val });	
										
									});
								}
							});
						}
					});
				});	
			});	
		});

		////  클라이언트 투표 진행상황 및 투표 결과 함수  ////
		socket.on('set_voting_data', function(data) {
			console.log("Call: set_voting_data");
			var tmpGroup = data.group;
			var tmpTool = data.tool;
			var tmpId = data.id;
			var tmpResult = data.val;
			var tmpOption = data.option;
			var tmpUser = data.user;
			
			var vote_field = tmpGroup + ":" + tmpTool + ":" + tmpId + ":vote";
			var vote_user_field = tmpGroup + ":" + tmpTool + ":" + tmpId + ":vote:user";

			
			if ( _vote_flag == false ) {
				_vote_flag = true;
				_vote_timer = setTimeout( function(){
					console.log("setTimeout");
					client.hkeys(vote_field, function (err, replies){
						replies.forEach( function (vote_text, index) {
							client.hget(vote_field, vote_text, function (err, vote_num) {
								console.log("vote_text: "+vote_text);
								console.log("vote_num: "+vote_num);

								socket.emit('get_voting_data', { text: vote_text, num: vote_num });	
								socket.broadcast.to(tmpGroup).emit('get_voting_data', { text: vote_text, num: vote_num });	
							});
						});
					});
				}, 10000);
			}
			
			var result_val = JSON.parse(tmpResult);
			var i=0;
			

				for ( i=0; i<result_val.length; i++ ) {			
					
					//console.log("vote_val: "+store_val);
					//store_val_array.push(store_val);
					
						
					//// 콜백함수 문제 해결해야함! - 타이밍 문제 ////		
					(function ( ) {
						
						var store_val = tmpGroup + ":" + tmpTool + ":" + result_val[i];
						var vote_user = tmpGroup + ":" + tmpTool + ":" + result_val[i] + ":user";
				
						client.hget(vote_field, store_val, function (err, val) {		
							console.log("store_val: "+store_val);
							console.log("val: "+val);
							var vote_num = 1;
							if ( val == null ) {		
								client.hset(vote_field, store_val, vote_num);
								client.hset(vote_user_field, vote_user, tmpUser);
							}
							else {
								vote_num = parseInt(val)+1;
								client.hset(vote_field, store_val, vote_num);
								client.hset(vote_user_field, vote_user, tmpUser);
							}
						});
						
					})(i)
		
				}

			////  for 문 돌면서 투표 결과 데이터 DB에 저장하는 부분
			////  클라이언트 투표 여부 확인해서 투표 전부 완료되면 get_voting_data 전달
			////  시간 제한 둬서 시간 지나면 전달
			
			
		});
		
		function timeEnd() {
			
		}
	});
}

////  redis 클라이언트 생성  ////
var redis = require('redis'), 
	client = redis.createClient(6379, '61.43.139.70'), multi;

var _idArray = new Array();	//lastId 배열
var _lastClient = 1;	//_lastClient 변수
var _vote_flag = false;
var _vote_timer = 0;

////  redis 데이터 초기화  ////
client.flushdb();

////  socket.io 서버 오픈  ////
var io_common = require('socket.io').listen(50000);
var io_list = require('socket.io').listen(50001);
var io_postit = require('socket.io').listen(50002);
var io_mindmap = require('socket.io').listen(50003);
var io_vote = require('socket.io').listen(50004);
var io_matrix = require('socket.io').listen(50005);
var io_board = require('socket.io').listen(50006);
var io_chatting = require('socket.io').listen(50007);

server(io_common);
server(io_list);
server(io_postit);
server(io_mindmap);
server(io_vote);
server(io_matrix);
server(io_board);
server(io_chatting);