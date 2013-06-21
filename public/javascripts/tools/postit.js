//var postit_var = {};
//		var socket = io.connect('http://61.43.139.69:50002/group');	// socket.io 서버에 접속
var tmpLastId = 100;
var tmpGroup = 0;
var tmpTool = 0;
var tmpItemGroup = 0;
var tmpToolSelect = 0;
var preSelectGroup = 0;

////  포스트잇 초기 설정해주는 함수  ////
function initpostit(group, tool) { initPostit(group, tool); }
function initPostit(group, tool)
{
	console.log("CALL initPostit tool=" + tool);

	_now_tool_data.variables.tmpTool = 'postit' + tool;
	_now_tool_data.variables.tmpGroup = group;
	
	_now_tool_data.variables.tmpToolSelect = $('[id='+_now_tool_data.variables.tmpTool+']');
	
	//alert(tmpToolSelect.attr('id'));

	////  그룹에 join하는 함수  ////
	_socket_postit.emit('join_room', { group: _now_tool_data.variables.tmpGroup });

	////  서버에 초기 데이터 요청하는 함수  ////
	_socket_postit.emit('set_tree_data', { group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool });

	//_socket_postit.on('get_client', function (data) {
	//	tmpClient = data.client;
		//console.log("client: "+data.client);
	//});

	////  X 버튼 클릭 이벤트 등록 - 포스트잇 삭제  ////
	$('article').delegate('.del_button', 'click', function() {
		var tmpSelect = $(this).parent().parent();
		var delId = tmpSelect.attr('taskid');
	
		////  삭제한 포스트잇 ID 서버에 전달  ////
		_socket_postit.emit('set_delete_tree_data', { group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool, id: delId });
		tmpSelect.remove();
	});
	
	////  포스트잇 추가 클릭 이벤트 등록  ////
	$('article').delegate('.add_postit', 'click', function() {
		_now_tool_data.variables.tmpItemGroup = $(this).parent('.group_container').attr('groupid');
		_socket_postit.emit('set_last_id', { group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool });		
	});

	////  그룹 타이틀 포커스 잃었을 때 이벤트 등록  ////
	$('article').delegate('.group_title', 'change', function() {
		var tmpTitle = $(this).attr('titleid');
		//lert(tmpTitle);
		var tmpVal = $(this).val();
		//console.log(tmpVal);
		_socket_postit.emit('set_option_data', { group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool, id: '', option: tmpTitle, val: tmpVal });
	});

	////  입력창에서 포커스 잃었을 때 이벤트 등록  ////
	$('.postit-container').delegate('.input_area', 'blur', function() {
		//데이터 전달하는 부분 작성
	});

	
	///////////////////////////////////////////////////////////////////////////////
}

function addSocketListenerForPostit()
{
	////  서버에서 lastID 받는 함수  ////
	_socket_postit.on('get_last_id', function (data) {
		_now_tool_data.variables.tmpLastId = data.last;
		postit_render_children(_now_tool_data.variables.tmpLastId, _now_tool_data.variables.tmpItemGroup, "");
		
		var tmpSelect = _now_tool_data.variables.tmpToolSelect.find('[taskid='+_now_tool_data.variables.tmpLastId+']');

		var addIndex = _now_tool_data.variables.tmpToolSelect.find('.object').index(tmpSelect);	 // 현재 Index 구함
		//console.log("index: "+addIndex);
		_socket_postit.emit('set_insert_tree_data', { group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool, id: _now_tool_data.variables.tmpLastId, parent: _now_tool_data.variables.tmpItemGroup, index: addIndex, val:"", client: _client_id });
	});

	////  서버에서 데이터 받는 함수  ////
	_socket_postit.on('get_tree_data', function (data) {
		_now_tool_data.variables.tmpLastId = data.id;
		var tmpParent = data.parent;
		var tmpVal = data.val;		
		
		console.log("get_data: "+_now_tool_data.variables.tmpLastId);

		var groupFlag = _now_tool_data.variables.tmpToolSelect.find('article').find('.group_container[groupid='+tmpParent+']');
		
		if (groupFlag.length == 0) {
			postit_add_group(tmpParent);
		}
		postit_render_children(_now_tool_data.variables.tmpLastId, tmpParent, tmpVal);

		_socket_postit.emit('set_tree_option_data', { group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool });
	});
	
	_socket_postit.on('get_tree_option_data', function (data) {
		var tmpOption = data.option;
		var tmpVal = data.val;
		
		var tmpTitle = _now_tool_data.variables.tmpToolSelect.find('[titleid='+tmpOption+']');
		if ( tmpTitle.length > 0 )
		{
			//console.log("get_option: "+tmpOption+" val: "+tmpVal);  2번 호출되는 부분 해결해야함!
			tmpTitle.val(tmpVal);
		}		
	
	});
	
	////  서버에서 추가된 데이터 받는 함수  ////
	_socket_postit.on('get_insert_tree_data', function (data) {
		//console.log("get_data");
		var tmpId = data.id;
		var tmpParent = data.parent;
		var tmpIndex = data.index;
		var tmpVal = data.val;
		
		var groupFlag = _now_tool_data.variables.tmpToolSelect.find('article').find('.group_container[groupid='+tmpParent+']');
		
		if (groupFlag.length == 0) {
			postit_add_group(tmpParent);
		}

		postit_render_children(tmpId, tmpParent, tmpVal);
	});
	
	////  서버에서 삭제된 데이터 받는 함수  ////
	_socket_postit.on('get_delete_tree_data', function (data) {
		var delId = data.id;
		
		var delSelect = _now_tool_data.variables.tmpToolSelect.find('[taskid='+delId+']');

		delSelect.remove();
	});
	
	////  서버에서 그룹 변경된 데이터 받는 함수  ////
	_socket_postit.on('get_change_parent', function (data) {
		var changeId = data.id;
		var changeParent = data.parent;

		var delSelect = _now_tool_data.variables.tmpToolSelect.find('[taskid='+changeId+']');
		var tmpVal = delSelect.children('textarea').val();
		//console.log(tmpVal);
		delSelect.remove();
		
		postit_render_children(changeId, changeParent, tmpVal);
	});
	
	////  서버에서 그룹제목 데이터 받는 함수  ////
	_socket_postit.on('get_option_data', function (data) {
		var tmpOption = data.option;
		var tmpVal = data.val;
		
		//console.log("11get_option: "+tmpOption+" val: "+tmpVal);

		var tmpTitle = _now_tool_data.variables.tmpToolSelect.find('[titleid='+tmpOption+']');
		if ( tmpTitle.length > 0 )
		{
			//console.log(tmpTitle.attr('class'));
			//console.log("get_option: "+tmpOption+" val: "+tmpVal);
			tmpTitle.val(tmpVal);
		}
	});
}

////  포스트잇 추가하는 함수 - valId: 추가할 ID, groupId: 추가할 그룹의 ID, valData: 추가할 데이터  ////
function postit_render_children(valId, groupId, valData) {

	//현재 ID 존재하는지 검사
	var tmpIdClass = _now_tool_data.variables.tmpToolSelect.find('[taskid='+valId+']');
	if ( tmpIdClass.length > 0 )
	{
		tmpIdClass.children('textarea').val(valData);
	}
	else {
		var $containers = _now_tool_data.variables.tmpToolSelect.find('.postit-container:eq('+groupId+')');
		$containers.each(function(container_i) {
			var $element = $("<div class='object task' taskid="+valId+"></div>"),
					height = 140,
					width = $containers.children().first().width();	
			//$containers.children('.add_postit').before($element);		
			$containers.append($element);

			var tmpPostit = _now_tool_data.variables.tmpToolSelect.find('[taskid='+valId+']');
			var $titleArea = $("<div class='title_area'><div class='del_button'>X</div><div>");
			tmpPostit.append($titleArea);
			var $inputArea = $("<textarea class='input_area fancy-scrollbar'  onClick='postit_mouse_focus()' onKeyDown='postit_key_input()'>"+valData+"</textarea>"); 
			tmpPostit.append($inputArea);
		});

		$containers.shapeshift({
			paddingY: 40
		});
		  
		// ----------------------------------------------------------------------
		// - Drag and Drop events for shapeshift
		// ----------------------------------------------------------------------
		
		$containers.on("ss-event-dropped", function(e, selected) {
			console.log("CALL $containers.on:ss-event-dropped");

			//드롭 이벤트에 따라 위치 변경 클라이언트에 전달 - changeDepth 이용해서 구현
			var $selected = $(selected)
			var $selectedGroup = $selected.parent().parent();
			var tmpId = $selected.attr('taskid');
			var tmpVal = $selected.children('textarea').val();
			//console.log("The dropped item is:", $selectedGroup.attr('groupid'));
			dropFlag = 0;

			var tmpSelectGroup = $selectedGroup.attr('groupid');
			if ( tmpSelectGroup != _now_tool_data.variables.preSelectGroup ) {		//다른 그룹으로 이동
				_socket_postit.emit('set_change_parent', {  group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool, id: tmpId,  parent: tmpSelectGroup, val: tmpVal });
			}
			else {		//그룹내 이동하는 경우
				
			}
			
			// Get the index position of each object
			//$objects = $(this).children();
			//$objects.each(function(i) {
			//console.log("Get the index position:", i)
			//console.log("Get the current element:", $(this))
			//});
		});
		
		$containers.on("ss-event-dragged", function(e, selected) {
			console.log("CALL $containers.on:ss-event-dragged");
			var $selected = $(selected);
			var $selectedGroup = $selected.parent().parent();
			_now_tool_data.variables.preSelectGroup = $selectedGroup.attr('groupid');
			//console.log("This is the item being dragged:", preSelectGroup);
		});
	}
}

////  마우스 포커스 이동시 처리하는 함수  ////
function postit_mouse_focus() {
	var focusClass = _now_tool_data.variables.tmpToolSelect.find('textarea:focus').parent();
	var focusClassId = focusClass.attr('taskid');
	//console.log(focusClass.attr('taskid'));
	var preClass = _now_tool_data.variables.tmpToolSelect.find('.postit-container').find('.open');
	var preClassId = preClass.attr('taskid'); 
	if ( focusClassId != preClassId ) {		// 다른 포스트잇 선택했을 때
		preClass.attr('class', 'object task');
		focusClass.attr('class', 'object open');
		
		var preIndex = _now_tool_data.variables.tmpToolSelect.find('.object').index(preClass);	 // 이전 Index 구함
		if ( preIndex >= 0 ) {
			var preVal = preClass.children('textarea').val();
			//console.log(preVal);

			var preParent = preClass.parent().parent().attr('groupid');
		
			////  추가된 데이터 서버에 전달  ////
			_socket_postit.emit('set_insert_tree_data', { group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool, id: preClassId, parent: preParent, index: preIndex, val: preVal, client: _client_id });
		}
	}
	
}

////  그룹 추가하는 함수  ////
function postit_add_group(groupId) {
	console.log("CALL postit_add_group");
	
	var groupFlag = 0;
	if (groupId >= 0) {	//groupId 매개변수 존재할 때
		groupFlag = 1;
		_now_tool_data.variables.tmpItemGroup = groupId;			
	}
	else {
		_now_tool_data.variables.tmpItemGroup = parseInt(_now_tool_data.variables.tmpItemGroup) + 1;
	}
	var $article = _now_tool_data.variables.tmpToolSelect.find("article");
	var tmpAddGroupData = "<div class='group_container' groupid="+_now_tool_data.variables.tmpItemGroup+">";
	tmpAddGroupData += "<input type='text' class='group_title' titleid="+_now_tool_data.variables.tmpItemGroup+" onKeyDown='postit_key_input()'/>"
	tmpAddGroupData += "<div class='add_postit'>+</div>";
	tmpAddGroupData += "<div class='postit-container'></div></div>";
	$article.append(tmpAddGroupData);
	
	if (groupFlag == 0) {
		_socket_postit.emit('set_last_id', { group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool });		
	}		
}

//// input 영역에서 키보드 입력시 호출되는 함수  ////
function postit_key_input() {
	console.log("CALL postit_key_input");

	var inputKey = event.keyCode;
	if ( inputKey == 13 )	// Input Enter
	{				
		var tmpTitleInput = _now_tool_data.variables.tmpToolSelect.find('input:focus');
		
		if ( tmpTitleInput.length > 0 )
		{
			var tmpTitle = $('input:focus').attr('titleid');
			var tmpVal = $('input:focus').val();
			console.log(tmpVal);
			_socket_postit.emit('set_option_data', { group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool, id: '', option: tmpTitle, val: tmpVal });
		}
		else
		{
			var tmpSelect = $('textarea:focus').parent();
			var addId = tmpSelect.attr('taskid');
			var addVal = tmpSelect.children('textarea').val();	
			var addIndex = $('.object').index(tmpSelect);	 // 현재 Index 구함
			var addParent = tmpSelect.parent().parent().attr('groupid');
			
			////  추가된 데이터 서버에 전달  ////
			_socket_postit.emit('set_insert_tree_data', { group: _now_tool_data.variables.tmpGroup, tool: _now_tool_data.variables.tmpTool, id: addId, parent: addParent, index: addIndex, val: addVal, client: _client_id });
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