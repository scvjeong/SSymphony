
		//var list_var = {};
		
		//socket = io.connect('http://61.43.139.69:50001/group');	// socket.io 서버에 접속
		
		var tmpIndent = 0;	// 현재 들여쓰기 상태
		var tmpLastId = 100;	// 마지막 ID 관리
		var tmpClient = 0;	//현재 클라이언트 번호
		var tmpGroup = 0;	//현재 그룹
		var tmpTool = 0;  //현재 도구
		var tmpToolSelect = 0;
		var clientColor = new Array( "none", "#99FF99", "#CCCC99", "#0099FF", "#CCFFCC", "#FFFF66", "#FF9999", "#669999", "#9999FF", "#00CCCC", "#CC9900");	
		var inputFlag = 0;	//키입력 감지하기 위한 변수		
			
		/*
		$(document).ready(function() {
			init_list("list1", "group1");			
		});
		*/

		////  리스트 초기 설정해주는 함수  ////
		function initList(group, tool)
		{
			console.log("CALL initList(" + group + ", " + tool + ")");
			
			tool = "list" + tool;
			group = "group" + group;
			tmpTool = tool;
			tmpGroup = group;
			
			tmpToolSelect = $('[id='+tmpTool+']');
			
			console.log(tmpToolSelect.attr('id'));

			_socket_list.emit('join_room', { group: tmpGroup });
			
			_socket_list.emit('set_tree_data', { group: tmpGroup, tool: tmpTool });

			////  Bullet 클릭 이벤트 등록 - 자식 노드 숨김  ////
			tmpToolSelect.find('.list_space').delegate('.bullet', 'click', function() {
				var tmpSelectEdit = $(this).parent().parent();
				if ( tmpSelectEdit.attr('class') == "edit_open")
				{
					var tmpChildren = tmpSelectEdit.children('.children');
					tmpChildren.toggle(10);
				}			
				var tmpSelectId = $(this).parent().attr('taskid');		
			});

			////  Checkbox 클릭 이벤트 등록 - 완료 표시  ////
			tmpToolSelect.find('.list_space').delegate('.check_box', 'click', function() {
				var tmpCheckBox = $(this);
				var tmpSelectInput = $(this).parent();

				if ( tmpCheckBox.is(':checked') )
				{
					tmpSelectInput.children('.tmp_editing').css({ "ime-mode": "readonly" });
					tmpSelectInput.children('.tmp_editing').css({ "text-decoration": "line-through" });
				}
				else
				{
					tmpSelectInput.children('.tmp_editing').css({ "ime-mode": "auto" });
					tmpSelectInput.children('.tmp_editing').css({ "text-decoration": "" });	
				}
				var tmpId = tmpSelectInput.attr('taskid');
				_socket_list.emit('set_option_data',  { group: tmpGroup, tool: tmpTool, id: tmpId }); 
				//console.log("Check ID: "+tmpId);
				//socket.emit('set_check', { id: tmpId });
			});		
		}

		function addSocketListenerForList()
		{
			console.log("CALL addSocketListenerForList");
			
			////  클라이언트 번호 얻어오는 부분  ////
			_socket_list.on('get_client', function (data) {
				tmpClient = data.client;
			});
			
			////  다른 클라이언트가 데이터 초기화했을 때  ////
			_socket_list.on('get_init_tool_data', function (data) {
				tmpToolSelect.find('.list_space > .children').children().remove();
				_socket_list.emit('set_tree_data', { group: tmpGroup, tool: tmpTool });
			});
			
			////  현재 group, tool에 해당하는 데이터 서버에서 응답 받는 함수_tree  ////
			_socket_list.on('get_tree_data', function (data) {
	
				var tmpId = data.id;
				var tmpParent = data.parent;
				var tmpVal = data.val;			
				
				//console.log("id: "+tmpId+"// parent: "+tmpParent+"// val: "+tmpVal);
				
				if ( tmpParent == "0" )
				{
					var rootTag = "<div class='edit_task'><div class='input_task' indent='0' taskId="+tmpId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0' value='"+tmpVal+"'><input type='checkbox' class='check_box'></div></div>";
					tmpToolSelect.find('.list_space > .children').append(rootTag);
				}
				else
				{
					var childParentInput = tmpToolSelect.find('[taskid='+tmpParent+']');
					var childParent = childParentInput.parent();
					var parentIndent = childParentInput.attr('indent');
					var childIndent = parseInt(parentIndent) +1;
					var childTag = "<div class='edit_task'><div class='input_add' indent="+childIndent+" taskId="+tmpId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0' value='"+tmpVal+"'><input type='checkbox' class='check_box'></div></div>";
					if ( childParent.children('.children').length > 0 )
					{
						childParent.children('.children').append(childTag);		
					}
					else
					{	
						childParent.attr('class', 'edit_open');
						childTag = "<div class='children'>"+childTag+"</div>";
						childParent.append(childTag);			
					}
					list_set_indent(childIndent);	 // 들여쓰기 설정			
				}
				tmpToolSelect.find('.input_open').attr('class', 'input_task');
				var lastInput = tmpToolSelect.find('.input_task:last');
				lastInput.attr('class', 'input_open');
				tmpToolSelect.find('.input_open > .tmp_editing').trigger('focus'); 
	
			});
	
			////  lastId 얻어오는 함수  ////
			_socket_list.on('get_last_id', function (data) {
	
				tmpLastId = data.last;
				list_add_input_box();
			});
	
			////  변경된 들여쓰기 얻어오는 함수  ////
			_socket_list.on('get_change_depth', function (data) {
	
				var tmpChangeId = data.id;
				var tmpChangeIndent = data.depth;
				//console.log("id: "+tmpChangeId+" // indent: "+tmpChangeIndent);
				var tmpInput = tmpToolSelect.find('[taskid='+tmpChangeId+']');
				var tmpVal = tmpInput.children('.tmp_editing').val();	
	
				var tmpInputParent = tmpInput.parent();
				var preClass = tmpInputParent.prev();
				var preInput = preClass.children();
				
				var preInputIndent = preInput.attr('indent');
				
				////  인덴트 적용하는 부분 상황별로 추가  ////
				if ( tmpInput.length > 0 )		// 인덴트 설정하려는 Id 존재할 경우
				{	
					if ( parseInt(tmpChangeIndent) > parseInt(preInputIndent) )	// 들여쓰기 추가한 경우 (Tab)
					{
						if ( preClass.attr('class') == "edit_task" )
						{
							tmpInput.parent().remove();			
							preClass.attr('class', "edit_open");
							var addTag = "<div class='children'><div class=edit_task><div class='input_add' indent="+tmpChangeIndent+" taskid="+tmpChangeId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0' value='"+tmpVal+"'><input type='checkbox' class='check_box'></div></div></div>";
							preClass.append(addTag);
						}
						
						else if ( preClass.attr('class') == "edit_open" )	// 직전 클래스가 edit_open인 경우 태그만 추가
						{
							tmpInput.parent().remove();
							var addTag = "<div class=edit_task><div class='input_add' indent="+tmpChangeIndent+" taskid="+tmpChangeId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0' value='"+tmpVal+"'><input type='checkbox' class='check_box'></div></div>";
							preClass.children('.children').append(addTag);
						}
	
					}
					else // 들여쓰기 제거한 경우 (Shift+Tab)
					{
						var addTag = "<div class=edit_task><div class='input_add' indent="+tmpChangeIndent+" taskid="+tmpChangeId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0' value='"+tmpVal+"'><input type='checkbox' class='check_box'></div></div>";		
						tmpInputParent.parent().parent().after(addTag);
						tmpInputParent.remove();
					}
	
					list_set_indent(tmpChangeIndent);
				}
			});
	
			////  다른 클라이언트가 입력 시작할 경우 해당 라인 스타일 변경  ////
			_socket_list.on('get_input_tree_data', function (data) {
	
				var addId = data.id;
				var addParent = data.parent;
				var addIndex = data.index;
				var addClient = data.client;
			
				//console.log("Id: "+addId+"// addClient: "+addClient);
				
				////  해당 인덱스에 존재하는 Edit 태그 찾기  ////
				var preInput = tmpToolSelect.find('.bullet:eq('+addIndex+')');
				var preInputParent = preInput.parent();
				var preEdit = preInputParent.parent();
		
				var tmpTask = tmpToolSelect.find('[taskid='+addId+']');
				
				////  taskid 존재할 경우  ////
				if ( tmpTask.length > 0 )	{	
					var changeInput = tmpToolSelect.find('[taskid='+addId+']');
					changeInput.css({ "background": clientColor[addClient] });
					//changeInput.css({ "ime-mode": "readonly" });
				}
	
				////  taskid 존재하지 않을 경우  ////
				else {
					var addTag = "";
					if ( addParent == 0 )	// 현재 추가하려는 데이터의 부모가 Root일 때
					{
						addTag = "<div class='edit_task'><div class='input_task' indent='0' taskid="+addId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0'><input type='checkbox' class='check_box'></div></div>";
						if ( preEdit.length == 0 )	//정의 안 된경우
						{
							preEdit = tmpToolSelect.find('.list_space > .children');
							preEdit.append(addTag);
						}
						else
						{
							preEdit.before(addTag);
						}	
					}
					else	// 부모가 Root가 아닐 때
					{
						addIndex = parseInt(addIndex) -1;
						preInput = tmpToolSelect.find('.bullet:eq('+addIndex+')');
						preInputParent = preInput.parent();
						preEdit = preInputParent.parent();
	
						var addInputParent = tmpToolSelect.find('[taskid='+addParent+']');
						var addParentIndent = parseInt(addInputParent.attr('indent'));
						var preInputIndent = parseInt(preInputParent.attr('indent'));
						var tmpIndentStatus = parseInt(addInputParent.attr('indent')) + 1;	//부모보다 한칸 들여쓰기
	
						//console.log( "Index: "+addIndex+" // add: "+addParentIndent+" // pre: "+preInputIndent);
				
						addTag = "<div class='edit_task'><div class='input_add' indent="+tmpIndentStatus+" taskid="+addId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0'><input type='checkbox' class='check_box'></div></div>";
									
						if (addParentIndent == preInputIndent)	// 첫번째 자식일 경우	
						{
							//console.log("첫번째 자식//"+preEdit.attr('class'));
							if ( preEdit.attr('class') == "edit_open")
							{
								preEdit.children('.children').prepend(addTag);
							}
							else
							{
								addTag = "<div class='children'>" + addTag + "</div>";
								preEdit.attr('class', 'edit_open');
								preEdit.append(addTag);
							}
						}
						else if ( addParentIndent < preInputIndent-1 )	// 앞으로 내어쓰기 한 경우
						{
							//console.log("내어쓰기//"+preEdit.attr('class'));
							preEdit.parent().parent().after(addTag);				
						} 
						else	// 같은 레벨로 계속 추가하는 경우
						{		
							//console.log("같은레벨//"+preEdit.attr('class'));
							preEdit.after(addTag);
						}
					}
					var changeInput = tmpToolSelect.find('[taskid='+addId+']');
					changeInput.css({ "background": clientColor[addClient] });
					tmpToolSelect.find('.input_open > .tmp_editing').trigger('focus'); 
					list_set_indent(tmpIndentStatus);	// 들여쓰기 설정		
				}
					
			});
	
			////  다른 클라이언트가 추가한 리스트 data 서버에서 가져옴  ////
			_socket_list.on('get_insert_tree_data', function (data) {
				//console.log(data);
	
				var addId = data.id;
				var addParent = data.parent;
				var addIndex = data.index;
				var addVal = data.val;
				
				////  해당 인덱스에 존재하는 Edit 태그 찾기  ////
				var preInput = tmpToolSelect.find('.bullet:eq('+addIndex+')');
				var preInputParent = preInput.parent();
				var preEdit = preInputParent.parent();
				//lastId = parseInt(lastId) + 1;
			
				var tmpTask = tmpToolSelect.find('[taskid='+addId+']');
				if ( tmpTask.length > 0 )	// 자신의 id 가진 객체 존재시
				{	
					var changeInput = tmpToolSelect.find('[taskid='+addId+']');
					changeInput.children('.tmp_editing').val(addVal);	// 값 업데이트
					changeInput.css({ "background": clientColor[0] });
					//changeInput.css({ "ime-mode": "auto" });
				}
				
			});
	
			////  다른 클라이언트에서 삭제한 리스트 data ID 서버에서 가져와서 삭제  ////
			_socket_list.on('get_delete_tree_data', function (data) {
				//console.log(data);
	
				var tmpDelId = data.id;
				var delInput = tmpToolSelect.find('[taskid='+tmpDelId+']');
				var delInputParent = delInput.parent();
			
				if ( delInputParent.attr('class') != "edit_open" )
				{
					var preClass = delInputParent.prev();
					if ( preClass.attr('class') == "edit_task" || preClass.attr('class') == "edit_open" )
					{
						delInputParent.remove();
					}
					else 
					{
						preClass = delInputParent.parent().parent();
						var otherEditClass = delInputParent.next();			
						if ( otherEditClass.attr('class') == "edit_task" || otherEditClass.attr('class') == "edit_open"  )
						{
							delInputParent.remove();
						}
						else
						{
							delInputParent.parent().parent().attr('class', 'edit_task');
							delInputParent.parent().remove();
						}			
					}
				}
			});
			
			////  check 상태 변화 서버에서 받아와서 적용  ////
			_socket_list.on('get_option_data', function (data) {
		
				var checkId = data.id;
				var checkInput = tmpToolSelect.find('[taskid='+checkId+']');
				var checkBox = checkInput.children('.check_box');
				console.log("GetCheck ID: "+checkId);
				
				if ( checkBox.is(':checked') )
				{
					checkBox.attr('checked', false);
					checkInput.children('.tmp_editing').css({ "ime-mode": "auto" });
					checkInput.children('.tmp_editing').css({ "text-decoration": "" });	
				}
				else
				{
					checkBox.attr('checked', true);
					checkInput.children('.tmp_editing').css({ "ime-mode": "readonly" });
					checkInput.children('.tmp_editing').css({ "text-decoration": "line-through" });			
				}	
			});
		}

		function list_init_data() {
			//alert("Init Data");
			_socket_list.emit('set_init_tool_data', { group: tmpGroup, tool: tmpTool });	
			tmpToolSelect.find('.list_space > .children').children().remove();
			_socket_list.emit('set_tree_data', { group: tmpGroup, tool: tmpTool });
		}
	
		////  input 영역 마우스로 클릭시 호출되는 함수  ////
		function list_mouse_focus(){
			//alert("Mouse focus");
				
			var focusClass = tmpToolSelect.find('input:focus').parent();
			//console.log(focusClass.attr('taskid'));
			var tmpInputOpen = tmpToolSelect.find('.list_space').find('.input_open');
			
			if ( tmpInputOpen.length <= 0 )
			{
				////  포커싱된 클래스 상태 open으로 변경 및 기존 open 클래스 task로 변경  ////
				focusClass = tmpToolSelect.find('input:focus');
				tmpIndent = focusClass.parent('.input_task').attr('indent');
				focusClass.parent('.input_task').attr('class', 'input_open');
			}
			else if( focusClass.attr('class') != "input_open" )
			{
				inputFlag = 0;
				////  이전에 작성 중이던 데이터 저장  ////		
				var preInput = tmpToolSelect.find('.input_open');
				var preId = preInput.attr('taskid');		// 자신의 id 가져옴	
				var parentId = 0;	 
				var preIndentStatus =  preInput.attr('indent');
				if( preIndentStatus != 0 ) {
					var parentChildrenClass = preInput.parent().parent();
					parentId = parentChildrenClass.prev('.input_task').attr('taskid');	// 부모 id 가져옴
				}		
				var preBullet = tmpToolSelect.find('.input_open a');
				var preIndex = tmpToolSelect.find('.bullet').index(preBullet);	 // 이전 Index 구함
				var preVal = tmpToolSelect.find('.input_open > .tmp_editing').val();	// 이전 값 구함
			
				_socket_list.emit('set_insert_tree_data', { group: tmpGroup, tool: tmpTool, id: preId, parent: parentId, index: preIndex, val: preVal } );
				//서버 소켓으로 데이터 전송

				////  포커싱된 클래스 상태 open으로 변경 및 기존 open 클래스 task로 변경  ////
				focusClass = tmpToolSelect.find('input:focus');
				tmpIndent = focusClass.parent('.input_task').attr('indent');
				focusClass.parent('.input_task').attr('class', 'input_open');
				
				preInput.attr('class', 'input_task');
			}		
		}

		////  들여쓰기 공백 설정해주는 함수  ////
		function list_set_indent(indentStatus) {
			var tmpInput = tmpToolSelect.find('.input_add');	// 추가된 태그인 경우
			if ( tmpInput.length > 0 )
			{
				tmpInput = tmpToolSelect.find('.input_add > .tmp_editing');
				var tmpBullet = tmpToolSelect.find('.input_add > .bullet');
				var tmpBulletLeft = tmpBullet.css('margin-left');
				var tmpWidth = tmpInput.width();
				tmpBullet.css({"margin-left": parseInt(5) + (20*parseInt(indentStatus)) });
				tmpInput.css({ "margin-left": 10 });
				tmpInput.css({ "width": (90-(3*parseInt(indentStatus)))+'%' });
				tmpToolSelect.find('.input_add').attr('class', 'input_task');
			}
			else 
			{		
				tmpInput = tmpToolSelect.find('.input_open > .tmp_editing');
				var tmpBullet = tmpToolSelect.find('.input_open > .bullet');
				var tmpBulletLeft = tmpBullet.css('margin-left');
				var tmpWidth = tmpInput.width();
				tmpBullet.css({"margin-left": parseInt(5) + (20*parseInt(indentStatus)) });
				tmpInput.css({ "margin-left": 10 });
				tmpInput.css({ "width": (90-(3*parseInt(indentStatus)))+'%' });
				tmpInput.trigger('focus');
			}
		}
		
		////  현재 값 서버로 전송해주고 inputbox 추가  ////
		function list_add_input_box(){
			var preInput = tmpToolSelect.find('.input_open');
			var preId = preInput.attr('taskid');	// 자신의 id 가져옴		
			var parentId = 0;	 	
			var preIndentStatus =  preInput.attr('indent');
			if( preIndentStatus != 0 ) {
				var parentChildrenClass = preInput.parent().parent();
				parentId = parentChildrenClass.prev('.input_task').attr('taskid');	// 부모 id 가져옴
				//alert(parentId);
			}
			
			var preBullet = tmpToolSelect.find('.input_open a');
			var preIndex = tmpToolSelect.find('.bullet').index(preBullet);		// 이전 Index 구함			
			var preVal = tmpToolSelect.find('.input_open > .tmp_editing').val();	// 이전 값 구함
		
			preInput.css({ "background": clientColor[0] });

			_socket_list.emit('set_insert_tree_data', { group: tmpGroup, tool: tmpTool, id: preId, parent: parentId, index: preIndex, val: preVal } );
			//서버 소켓으로 데이터 전송

			preInput.attr('class', 'input_task');					

			var addTag = "<div class='edit_task'><div class='input_open' indent="+tmpIndent+" taskid="+tmpLastId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0'><input type='checkbox' class='check_box'></div></div>";
			var preInputParent = preInput.parent(); 
		
			if( preInputParent.attr('class') == "edit_open" )	// 자식 노드 존재하는 경우 자식노드로 추가
			{
				tmpIndent = parseInt(tmpIndent) + 1;
				preInputParent.children('.children').prepend(addTag);
				tmpToolSelect.find('.input_open').attr('indent', tmpIndent);
			}
			else
			{
				preInputParent.after(addTag);
			}

			tmpToolSelect.find('.input_open > .tmp_editing').trigger('focus'); 
			var tmpIndentStatus = tmpToolSelect.find('.input_open').attr('indent'); 
			list_set_indent(tmpIndentStatus);	// 들여쓰기 설정
			//resizeWindow();
		}

		////  들여쓰기 추가된 경우 호출되는 함수  ////
		function list_add_indent() {
			
			var tmpInput = tmpToolSelect.find('.input_open');					
			var tmpInputParent = tmpInput.parent();
			var tmpId = tmpInput.attr('taskid');		
			var tmpVal = tmpInput.children('.tmp_editing').val();	
			
			var preClass = tmpInputParent.prev();
			//alert(preEditTask.attr('class'));

			if ( tmpInputParent.attr('class') != "edit_open")	// 자식노드가 없을 때만
			{		
				if ( preClass.attr('class') == "edit_task" )	//직전 클래스가 edit_task인 경우 추가하려는 children 태그 추가
				{
					tmpIndent = parseInt(tmpIndent)+1;
					tmpInput.parent().remove();			
					preClass.attr('class', "edit_open");
					
					var addTag = "<div class='children'><div class=edit_task><div class='input_open' indent="+tmpIndent+" taskid="+tmpId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0' value='"+tmpVal+"'><input type='checkbox' class='check_box'></div></div></div>";
					preClass.append(addTag);

					list_set_indent(tmpIndent);

					_socket_list.emit('set_change_depth', {  group: tmpGroup, tool: tmpTool, id: tmpId,  depth: tmpIndent });
				}		
				else if ( preClass.attr('class') == "edit_open" )	//직전 클래스가 edit_open인 경우 태그만 추가
				{
					tmpIndent = parseInt(tmpIndent)+1;
					tmpInput.parent().remove();
					var addTag = "<div class=edit_task><div class='input_open' indent="+tmpIndent+" taskid="+tmpId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0' value='"+tmpVal+"'><input type='checkbox' class='check_box'></div></div>";
					preClass.children('.children').append(addTag);

					list_set_indent(tmpIndent);
		
					_socket_list.emit('set_change_depth', {  group: tmpGroup, tool: tmpTool, id: tmpId,  depth: tmpIndent });
				}
			}	
		}
	
		////  들여쓰기 삭제했을 경우 호출되는 함수  ////
		function list_remove_indent() {
			var tmpInput = tmpToolSelect.find('.input_open');
			var tmpId = tmpInput.attr('taskid');
			var tmpVal = tmpToolSelect.find('.input_open > .tmp_editing').val();					
			var tmpInputParent = tmpToolSelect.find('.input_open').parent();

			if ( tmpIndent > 0 && tmpInputParent.attr('class') != "edit_open" ) 
			{	
				tmpIndent = parseInt(tmpIndent)-1;
						
				var addTag = "<div class=edit_task><div class='input_open' indent="+tmpIndent+" taskid="+tmpId+"><a class='bullet'>•</a><input type='text' class='tmp_editing' onClick='list_mouse_focus()' onKeyDown='list_key_input()' tabindex='0' value='"+tmpVal+"'><input type='checkbox' class='check_box'></div></div>";		

				if( tmpInputParent.parent().attr('class') == "children" )
				{
					tmpInputParent.parent().parent().after(addTag);
					tmpInputParent.remove();
				}
				list_set_indent(tmpIndent);	// 들여쓰기 설정 함수 호출

				_socket_list.emit('set_change_depth', {  group: tmpGroup, tool: tmpTool, id: tmpId,  depth: tmpIndent });
			}
		}

		////  현재 노드 삭제할 경우 호출되는 함수  ////
		function list_del_line() {
			var tmpInput = tmpToolSelect.find('.input_open');
			var tmpId = tmpInput.attr('taskid');
			var tmpInputParent = tmpToolSelect.find('.input_open').parent();

			if ( tmpInputParent.attr('class') != "edit_open" )
			{
				var preClass = tmpInputParent.prev();
				if ( preClass.attr('class') == "edit_task" )
				{
					preClass.children('.input_task').attr('class', 'input_open');
					preClass.children('.input_open').children('.tmp_editing').trigger('focus');							
					tmpIndent = preClass.children('.input_open').attr('indent');
													
					tmpInputParent.remove();
				}
				else if ( preClass.attr('class') == "edit_open" )
				{
					var preEditClass = preClass.children('.children').children('.edit_task:last');
					preEditClass.children('.input_task').attr('class', 'input_open');
					preEditClass.children('.input_open').children('.tmp_editing').trigger('focus');						
					tmpIndent = preEditClass.children('.input_open').attr('indent');

					tmpInputParent.remove();
				}
				else 
				{
					preClass = tmpInputParent.parent().parent();
					var otherEditClass = tmpInputParent.next();
					
					var preInputClass = preClass.children('.input_task:last');
					preInputClass.attr('class', 'input_open');				
					tmpIndent = preInputClass.attr('indent');

					preInputClass.children('.tmp_editing').trigger('focus');
				
					if ( otherEditClass.attr('class') == "edit_task" || otherEditClass.attr('class') == "edit_open"  )
					{
						tmpInputParent.remove();
					}
					else
					{
						tmpInputParent.parent().parent().attr('class', 'edit_task');
						tmpInputParent.parent().remove();
					}						
				}						
				var delId = tmpInput.attr('taskid');
				_socket_list.emit('set_delete_tree_data', { group: tmpGroup, tool: tmpTool, id: delId  } );
			}
		}

		////  입력 시작할 경우 다른 클라이언트들에 표시  ////
		function list_start_input() {
			var tmpInput = tmpToolSelect.find('.input_open');
			var tmpId = tmpInput.attr('taskid');
			var tmpInputParent = tmpToolSelect.find('.input_open').parent();
			var tmpParentId = 0;
			var tmpIndentStatus = tmpInput.attr('indent');
			if( tmpIndentStatus != 0 ) {
				var parentChildrenClass = tmpInput.parent().parent();
				tmpParentId = parentChildrenClass.prev('.input_task').attr('taskid');	// 부모 id 가져옴
			}

			var tmpBullet = tmpToolSelect.find('.input_open a');
			var tmpIndex = tmpToolSelect.find('.bullet').index(tmpBullet);	 // 이전 Index 구함
			
			console.log("Id: "+tmpId+"// addClient: "+tmpClient);

			_socket_list.emit('set_input_tree_data', { group: tmpGroup, tool: tmpTool, id: tmpId, parent: tmpParentId, index: tmpIndex, client: tmpClient } );
		}

		//// input 영역에서 키보드 입력시 호출되는 함수  ////
		function list_key_input() {
			var inputKey = event.keyCode;
			if ( inputKey == 13 )	// Input Enter
			{
				//alert("Enter");
				_socket_list.emit('set_last_id', { group: tmpGroup, tool: tmpTool });		
				inputFlag = 0;
			}
			else if ( inputKey == 9 && event.shiftKey ) // Input Shift + Tab
			{
				//alert("Shift+Tab");
				event.returnValue = false;
	
				list_remove_indent();
			}
			else if ( inputKey == 9 )	// Input Tab		
			{
				//alert("Tab");
				event.returnValue = false;
						
				list_add_indent();
			}	
			else if ( inputKey == 8 )	// Input BackSpaceKey
			{				
				//alert("BackSpace");
				var tmpVal = tmpToolSelect.find('.input_open > .tmp_editing').val();
								
				var bulletCount = tmpToolSelect.find('.bullet').length;
				//console.log("bullet: "+bulletCount);

				if( tmpVal == "" && bulletCount > 1 ) 
				{
					event.returnValue = false;			
					list_del_line();			
				}				
			}
			else if ( inputKey == 27 )	// Input ESCKey
			{				
				//alert("ESC");
				tmpToolSelect.find('.input_open > .tmp_editing').val('');
				
			}

			else	//그 외 키보드 입력시
			{
				if ( inputFlag == 0 ) {
					inputFlag = 1;
					list_start_input();
				}
			}
		}
		
		function list_add_new_input() {
			_socket_list.emit('set_last_id', { group: tmpGroup, tool: tmpTool });		
			inputFlag = 0;
		}

		function list_change_data() {
			_socket_list.emit('set_change_tree_data', { group: tmpGroup, tool: tmpTool, change: 'mindmap1' });
		}

