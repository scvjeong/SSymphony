//var postit_var = {};
		socket = io.connect('http://61.43.139.69:50002/group');	// socket.io 서버에 접속
		tmpLastId = 100;
		tmpGroup = 0;
		tmpTool = 0;
		tmpItemGroup = 0;
		tmpClient = 0;
		tmpToolSelect = 0;
		preSelectGroup = 0;
		
		$(document).ready(function() {
			init_postit("postit1", "group1");			
		});
	
		////  포스트잇 초기 설정해주는 함수  ////
		function init_postit( tool, group ){
			
			tmpTool = tool;

			tmpGroup = group;
			
			tmpToolSelect = $('[id='+tmpTool+']');
			
			//alert(tmpToolSelect.attr('id'));
	
			////  그룹에 join하는 함수  ////
			socket.emit('join_room', { group: tmpGroup });

			////  서버에 초기 데이터 요청하는 함수  ////
			socket.emit('set_tree_data', { group: tmpGroup, tool: tmpTool });
		
			socket.on('get_client', function (data) {
				tmpClient = data.client;
				//console.log("client: "+data.client);
			});

			////  X 버튼 클릭 이벤트 등록 - 포스트잇 삭제  ////
			$('article').delegate('.del_button', 'click', function() {
				var tmpSelect = $(this).parent().parent();
				var delId = tmpSelect.attr('taskid');
			
				////  삭제한 포스트잇 ID 서버에 전달  ////
				socket.emit('set_delete_tree_data', { group: tmpGroup, tool: tmpTool, id: delId });
				tmpSelect.remove();
			});
			
			////  포스트잇 추가 클릭 이벤트 등록  ////
			$('article').delegate('.add_postit', 'click', function() {
				tmpItemGroup = $(this).parent('.group_container').attr('groupid');
				socket.emit('set_last_id', { group: tmpGroup, tool: tmpTool });		
			});

			////  그룹 타이틀 포커스 잃었을 때 이벤트 등록  ////
			$('article').delegate('.group_title', 'change', function() {
				var tmpTitle = $(this).attr('titleid');
				//lert(tmpTitle);
				var tmpVal = $(this).val();
				//console.log(tmpVal);
				socket.emit('set_option_data', { group: tmpGroup, tool: tmpTool, id: '', option: tmpTitle, val: tmpVal });
			});

			////  입력창에서 포커스 잃었을 때 이벤트 등록  ////
			$('.container').delegate('.input_area', 'blur', function() {
				//데이터 전달하는 부분 작성
			});

		}

		////  포스트잇 추가하는 함수 - valId: 추가할 ID, groupId: 추가할 그룹의 ID, valData: 추가할 데이터  ////
		function postit_render_children(valId, groupId, valData) {

			//현재 ID 존재하는지 검사
			var tmpIdClass = tmpToolSelect.find('[taskid='+valId+']');
			if ( tmpIdClass.length > 0 )
			{
				tmpIdClass.children('textarea').val(valData);
				console.log(tmpIdClass);
			}
			else {
				var $containers = tmpToolSelect.find('.container:eq('+groupId+')');
				$containers.each(function(container_i) {
					var $element = $("<div class='object task' taskid="+valId+"></div>"),
							height = 160,
							width = $containers.children().first().width();	
					//$containers.children('.add_postit').before($element);		
					$containers.append($element);		

					var tmpPostit = tmpToolSelect.find('[taskid='+valId+']');
					var $titleArea = $("<div class='title_area'><div class='del_button'>X</div><div>");
					tmpPostit.append($titleArea);
					var $inputArea = $("<textarea class='input_area'  onClick='postit_mouse_focus()' onKeyDown='postit_key_input()'>"+valData+"</textarea>"); 
					tmpPostit.append($inputArea);
				});

				$containers.shapeshift({
					paddingY: 20
				});
				  
				  // ----------------------------------------------------------------------
				  // - Drag and Drop events for shapeshift
				  // ----------------------------------------------------------------------

				$containers.on("ss-event-dropped", function(e, selected) {
					//드롭 이벤트에 따라 위치 변경 클라이언트에 전달 - changeDepth 이용해서 구현
					var $selected = $(selected)
					var $selectedGroup = $selected.parent().parent();
					var tmpId = $selected.attr('taskid');
					var tmpVal = $selected.children('textarea').val();
					//console.log("The dropped item is:", $selectedGroup.attr('groupid'));
					dropFlag = 0;

					var tmpSelectGroup = $selectedGroup.attr('groupid');
					if ( tmpSelectGroup != preSelectGroup ) {		//다른 그룹으로 이동
						socket.emit('set_change_parent', {  group: tmpGroup, tool: tmpTool, id: tmpId,  parent: tmpSelectGroup, val: tmpVal });
					}
					else {		//그룹내 이동하는 경우
						
					}

					/*
					// Get the index position of each object
					$objects = $(this).children();
					$objects.each(function(i) {
					//console.log("Get the index position:", i)
					//console.log("Get the current element:", $(this))
					});
					*/
				});

				$containers.on("ss-event-dragged", function(e, selected) {
					var $selected = $(selected);
					var $selectedGroup = $selected.parent().parent();
					preSelectGroup = $selectedGroup.attr('groupid');
					//console.log("This is the item being dragged:", preSelectGroup);
				});
			}
		}
		
		////  서버에서 lastID 받는 함수  ////
		socket.on('get_last_id', function (data) {
			tmpLastId = data.last;
			postit_render_children(tmpLastId, tmpItemGroup, "");
			
			var tmpSelect = tmpToolSelect.find('[taskid='+tmpLastId+']');

			var addIndex = tmpToolSelect.find('.object').index(tmpSelect);	 // 현재 Index 구함
			//console.log("index: "+addIndex);
			socket.emit('set_insert_tree_data', { group: tmpGroup, tool: tmpTool, id: tmpLastId, parent: tmpItemGroup, index: addIndex, val:"", client: tmpClient });

		});

		////  서버에서 데이터 받는 함수  ////
		socket.on('get_tree_data', function (data) {
			tmpLastId = data.id;
			var tmpParent = data.parent;
			var tmpVal = data.val;		
			
			console.log("get_data: "+tmpLastId);

			var groupFlag = tmpToolSelect.find('article').find('.group_container[groupid='+tmpParent+']');
			
			if (groupFlag.length == 0) {
				postit_add_group(tmpParent);
			}
			postit_render_children(tmpLastId, tmpParent, tmpVal);

			socket.emit('set_tree_option_data', { group: tmpGroup, tool: tmpTool });
		});
		
		socket.on('get_tree_option_data', function (data) {
			var tmpOption = data.option;
			var tmpVal = data.val;
			
			var tmpTitle = tmpToolSelect.find('[titleid='+tmpOption+']');
			if ( tmpTitle.length > 0 )
			{
				//console.log("get_option: "+tmpOption+" val: "+tmpVal);  2번 호출되는 부분 해결해야함!
				tmpTitle.val(tmpVal);
			}		

		});

		////  서버에서 추가된 데이터 받는 함수  ////
		socket.on('get_insert_tree_data', function (data) {
			//console.log("get_data");
			var tmpId = data.id;
			var tmpParent = data.parent;
			var tmpIndex = data.index;
			var tmpVal = data.val;
			
			var groupFlag = tmpToolSelect.find('article').find('.group_container[groupid='+tmpParent+']');
			
			if (groupFlag.length == 0) {
				postit_add_group(tmpParent);
			}

			postit_render_children(tmpId, tmpParent, tmpVal);
		});
		
		////  서버에서 삭제된 데이터 받는 함수  ////
		socket.on('get_delete_tree_data', function (data) {
			var delId = data.id;
			
			var delSelect = tmpToolSelect.find('[taskid='+delId+']');

			delSelect.remove();
		});

		////  서버에서 그룹 변경된 데이터 받는 함수  ////
		socket.on('get_change_parent', function (data) {
			var changeId = data.id;
			var changeParent = data.parent;

			var delSelect = tmpToolSelect.find('[taskid='+changeId+']');
			var tmpVal = delSelect.children('textarea').val();
			//console.log(tmpVal);
			delSelect.remove();
			
			postit_render_children(changeId, changeParent, tmpVal);

		});

		////  서버에서 그룹제목 데이터 받는 함수  ////
		socket.on('get_option_data', function (data) {
			var tmpOption = data.option;
			var tmpVal = data.val;
			
			//console.log("11get_option: "+tmpOption+" val: "+tmpVal);

			var tmpTitle = tmpToolSelect.find('[titleid='+tmpOption+']');
			if ( tmpTitle.length > 0 )
			{
				//console.log(tmpTitle.attr('class'));
				//console.log("get_option: "+tmpOption+" val: "+tmpVal);
				tmpTitle.val(tmpVal);
			}
		});

		////  마우스 포커스 이동시 처리하는 함수  ////
		function postit_mouse_focus() {
			var focusClass = tmpToolSelect.find('textarea:focus').parent();
			var focusClassId = focusClass.attr('taskid');
			//console.log(focusClass.attr('taskid'));
			var preClass = tmpToolSelect.find('.container').find('.open');
			var preClassId = preClass.attr('taskid'); 
			if ( focusClassId != preClassId ) {		// 다른 포스트잇 선택했을 때
				preClass.attr('class', 'object task');
				focusClass.attr('class', 'object open');
				
				var preIndex = tmpToolSelect.find('.object').index(preClass);	 // 이전 Index 구함
				if ( preIndex >= 0 ) {
					var preVal = preClass.children('textarea').val();
					//console.log(preVal);

					var preParent = preClass.parent().parent().attr('groupid');
				
					////  추가된 데이터 서버에 전달  ////
					socket.emit('set_insert_tree_data', { group: tmpGroup, tool: tmpTool, id: preClassId, parent: preParent, index: preIndex, val: preVal, client: tmpClient });
				}
			}
			
		}

		////  그룹 추가하는 함수  ////
		function postit_add_group(groupId) {
			var groupFlag = 0;
			if (groupId >= 0) {	//groupId 매개변수 존재할 때
				groupFlag = 1;
				tmpItemGroup = groupId;			
			}
			else {
				tmpItemGroup = parseInt(tmpItemGroup) + 1;
			}
			var $article = tmpToolSelect.find("article");
			var tmpAddGroupData = "<div class='group_container' groupid="+tmpItemGroup+">";
			tmpAddGroupData += "<input type='text' class='group_title' titleid="+tmpItemGroup+" onKeyDown='postit_key_input()'/>"
			tmpAddGroupData += "<div class='add_postit'>+</div>";
			tmpAddGroupData += "<div class='container'></div></div>";
			$article.append(tmpAddGroupData);
			
			if (groupFlag == 0) {
				socket.emit('set_last_id', { group: tmpGroup, tool: tmpTool });		
			}		
		}

		//// input 영역에서 키보드 입력시 호출되는 함수  ////
		function postit_key_input() {
			var inputKey = event.keyCode;
			if ( inputKey == 13 )	// Input Enter
			{				
				var tmpTitleInput = tmpToolSelect.find('input:focus');
				
				if ( tmpTitleInput.length > 0 )
				{
					var tmpTitle = $('input:focus').attr('titleid');
					var tmpVal = $('input:focus').val();
					console.log(tmpVal);
					socket.emit('set_option_data', { group: tmpGroup, tool: tmpTool, id: '', option: tmpTitle, val: tmpVal });
				}
				else
				{
					var tmpSelect = $('textarea:focus').parent();
					var addId = tmpSelect.attr('taskid');
					var addVal = tmpSelect.children('textarea').val();	
					var addIndex = $('.object').index(tmpSelect);	 // 현재 Index 구함
					var addParent = tmpSelect.parent().parent().attr('groupid');
					
					////  추가된 데이터 서버에 전달  ////
					socket.emit('set_insert_tree_data', { group: tmpGroup, tool: tmpTool, id: addId, parent: addParent, index: addIndex, val: addVal, client: tmpClient });
				}
			}
			else if ( inputKey == 8 )	// Input BackSpaceKey
			{			
				/*
				//alert("BackSpace");
				var tmpSelect = $('textarea:focus').parent();
				if ( tmpSelect.length > 0 )
				{
					var delId = tmpSelect.attr('taskid');
					var delVal = tmpSelect.children('textarea').val();	
					var delIndex = $('.object').index(tmpSelect);	 // 현재 Index 구함
					var delParent = tmpSelect.parent().parent().attr('groupid');
						
					////  변경된 데이터 서버에 전달  ////
					socket.emit('set_insert_tree_data', { group: tmpGroup, tool: tmpTool, id: delId, parent: delParent, index: delIndex, val: delVal, client: tmpClient });
				
				}
				*/
			}
		}