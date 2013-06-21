var width = 100;
var height = 100;
//var tmpClient = 0;	//현재 클라이언트 번호
var clientColor = new Array( "none", "#99FF99", "#CCCC99", "#0099FF", "#CCFFCC", "#FFFF66", "#FF9999", "#669999", "#9999FF", "#00CCCC", "#CC9900");	
var setupData = { row:0, col:0 }; // matrix 행, 열
var setupFlag = { data_init:true, row:false, col:false };
var optionId = { set:999999, row:999998, col:999997 };
var tmpGroup = 0;
var _key_code = null // 키 입력 값 저장
var _box_count = 0;
var inputFlag = 0;	//키입력 감지하기 위한 변수

function initmatrix(idx_meeting, tool) { initMatrix(idx_meeting, tool); }
function initMatrix(idx_meeting, tool)
{
	// Select Tool Div
	var tool_div = $('#matrix'+tool);

	$('.setMatrix', tool_div).click(function(){
		setMatrix(this, "matrix"+tool) 
	});
	$('.clearMatrix', tool_div).click(function(){
		setClear("matrix"+tool) 
	});

	// resize
	resizeMatrix();
	$(window).resize(function(){
		resizeMatrix();
	});
	_socket_matrix.emit('join_room', { idx_meeting: _idx_meeting });
	////  서버에 초기 데이터 요청하는 함수  ////
	_socket_matrix.emit('set_tree_data', { idx_meeting: _idx_meeting, tool: "matrix"+tool });
	_socket_matrix.emit('set_tree_option_data', { idx_meeting: _idx_meeting, tool: "matrix"+tool });
}

function resizeMatrix(){
	width = $(window).width();
	height = $(window).height();
	$('.matrix').css({ width:width+"px", height:height+"px" });
}

function setMatrix(t, toolName){
	if( _now_tool_data.variables.setupFlag.data_init == true )
	{
		_now_tool_data.variables.setupData.row = $('#rowNum', $(t).parent() ).val();
		_now_tool_data.variables.setupData.col = $('#colNum', $(t).parent() ).val();
		_now_tool_data.variables.setupFlag.row = true;
		_now_tool_data.variables.setupFlag.col = true;
		_socket_matrix.emit('set_option_data', { idx_meeting: _idx_meeting, tool: toolName, id: _now_tool_data.variables.optionId.row, option: "row", val: _now_tool_data.variables.setupData.row });
		_socket_matrix.emit('set_option_data', { idx_meeting: _idx_meeting, tool: toolName, id: _now_tool_data.variables.optionId.col, option: "col", val: _now_tool_data.variables.setupData.col });
		_socket_matrix.emit('set_option_data', { idx_meeting: _idx_meeting, tool: toolName, id: _now_tool_data.variables.optionId.set, option: "set", val: true });
		setDoMatrix(toolName);
	}
}

function setClear(toolName) {
	//if( confirm("정말 삭제하겠습니까?") ) {
		_socket_matrix.emit('set_init_tool_data', { idx_meeting: _idx_meeting, tool: toolName });		
		_socket_matrix.emit('set_option_data', { idx_meeting: _idx_meeting, tool: toolName, id: _now_tool_data.variables.optionId.row, option: "row", val: false });
		_socket_matrix.emit('set_option_data', { idx_meeting: _idx_meeting, tool: toolName, id: _now_tool_data.variables.optionId.col, option: "col", val: false });
		_socket_matrix.emit('set_option_data', { idx_meeting: _idx_meeting, tool: toolName, id: _now_tool_data.variables.optionId.set, option: "set", val: false });
		setDoClear(toolName);
	//}
}

function setDoClear(toolName) {
	var toolBox = $('#'+toolName);
	_now_tool_data.variables.setupFlag.data_init = true;
	_now_tool_data.variables.setupFlag.row = false;
	_now_tool_data.variables.setupFlag.col = false;
	$('.matrix_table tbody', toolBox).html("");
	$('.matrix_table colgroup', toolBox).html("");
}

function setDoMatrix(toolName) {
	if( _now_tool_data.variables.setupFlag.data_init && _now_tool_data.variables.setupFlag.row && _now_tool_data.variables.setupFlag.col )
	{
		_now_tool_data.variables.setupFlag.data_init = false;
		var tmpRow = _now_tool_data.variables.setupData.row*1;
		var tmpCol = _now_tool_data.variables.setupData.col*1;
		_now_tool_data.variables._box_count = 0;
		var toolBox = $('#'+toolName);
		var tmpMatrix = $('.matrix_table tbody', toolBox);
		var colGroup =  $('.matrix_table colgroup', toolBox);
		var tmpTag = "";
		var colWidth = $('.matrix_table', toolBox).width() / ((tmpCol*1));

		var i=0, j=0;
		for (i=0; i<parseInt(tmpRow); i++) {
			tmpTag = "<tr class='matrix-row'></tr>";
			tmpMatrix.append(tmpTag);
			for (j=0; j<parseInt(tmpCol); j++) {
				if (i==0)
					colGroup.append("<col width='"+colWidth+"px'>");

				var tmpInsertRow = tmpMatrix.find('.matrix-row:last', toolBox);
				tmpTag = "<td><div class='input_line matrix-box' parent='"+( (i*tmpCol)+j )+"'></div></td>";
				tmpInsertRow.append(tmpTag);
				_socket_matrix.emit('set_last_id', { idx_meeting: _idx_meeting, tool: toolName });
			}
		}
		$('.matrix_table tr:nth-child(even) td', toolBox).css({width:colWidth+"px"});
		$('.matrix_table tr:nth-child(even) td:nth-child(even)', toolBox).addClass("even");
		$('.matrix_table tr:nth-child(even) td:nth-child(odd)', toolBox).addClass("c-even");
		$('.matrix_table tr:nth-child(odd) td:nth-child(even)', toolBox).addClass("odd");
		$('.matrix_table tr:nth-child(odd) td:nth-child(odd)', toolBox).addClass("c-odd");

		$('.matrix-box', toolBox).click(function(e){
			if( e.target.localName == "div" )
				$('input:last', this).focus();					
		});
	}
}

// 키 입력 체크 함수 ( enter, backspace )
function keyDownCheck(t, e, toolName)
{
	var $div = $(t).parent();
	_now_tool_data.variables._key_code = e.keyCode;

	if( $(t).val().trim().length > 0  )
	{
		switch( _now_tool_data.variables._key_code )
		{
			case 13:
				addInput(t, toolName);
				break;
			case 9:
			case 38:
			case 40:
				addInput(t, toolName);
				return false;
				break;
		}
	}
	else if( $(t).val().trim().length < 1 && $("input",$div).length > 1 )
	{
		switch( _now_tool_data.variables._key_code )
		{
			case 8:
				delInput(t, toolName);
				return false;
				break;
			case 38:
				$(t).prev().focus();
				return false;
				break;
		}
	}
	return true;
}

function addInput(t, toolName)
{
	var $div = $(t).parent();
	var taskId = $(t).attr("taskid");
	var parent = $(t).parent().attr("parent");
	var idx = 0;
	$("input", $(t).parent()).each(function(i){
		if( $(this).attr("taskid") == taskId )
			idx = (i+1);
	});
	var val = $(t).val();
	_socket_matrix.emit('set_insert_tree_data', { idx_meeting: _idx_meeting, tool: toolName, id: taskId, parent: parent, index: idx, val: val });

	// 비어있는 input 박스 존재 유무 확인
	var existObj = null;
	$("input", $div).each(function(){
		if( $(this).val().trim().length < 1 )
			existObj = $(this);
	});
	// 아래 화살표
	if( existObj != null && _now_tool_data.variables._key_code == 40 )
		$(t).next().focus();
	// 위 화살표
	else if( existObj != null && _now_tool_data.variables._key_code == 38 )
		$(t).prev().focus();
	else if( existObj != null )
		existObj.focus();
	else
		_socket_matrix.emit('set_last_id', { idx_meeting: _idx_meeting, tool: toolName });
}

function delInput(t, toolName)
{
	var $div = $(t).parent();
	var taskId = $(t).attr("taskid");
	$(t).remove();
	_socket_matrix.emit('set_delete_tree_data', { idx_meeting: _idx_meeting, tool: toolName, id: taskId });
	$("input",$div).focus();
}

function makeInputbox(lastId, val, toolName)
{
	if( typeof(val) == "undefined" )
		val = "";
	var html = "<input taskid='"+lastId+"' type='text' class='matrix-input' ";
	html += "name='matrix-input' ";
	html += "onkeydown='javascript:return keyDownCheck(this, event, \""+toolName+"\");' ";
	html += "onfocus='focusInput(this, \""+toolName+"\");' value='"+val+"'>";
	toolName
	return html;
}

// 이전에 작성중이였던 box를 찾아서 input 추가
function addInputbox( lastId, val, toolName )
{
	// 작성중이였던 input select
	var $input = $('.writing');
	$input.removeClass("writing");
	// 작성중이였던 div select
	var $div = $input.parent();
	var parent = $div.attr("parent");
	$div.append(makeInputbox(lastId, val, toolName));
	var h = $div.height();
	var td_obj = $div.parent().parent();
	$("div.matrix-box", td_obj).css("min-height", h+"px");

	// tab 키로 확장 했을 경우
	if( _now_tool_data.variables._key_code == 9 )
	{
		if( $('div[parent='+((parent*1)+1)+'] input:last').length > 0 )
			$('div[parent='+((parent*1)+1)+'] input:last').focus();
		else
			$('div[parent=0] input:last').focus();
	}
	// ↑
	else if( _now_tool_data.variables._key_code == 38 )
		$input.prev().focus();
	// ↓
	else if( _now_tool_data.variables._key_code == 40 )
		$input.next().focus();
	else
		$('input:last', $div).focus();
}

// 동기화를 위한 원격에서 input 요청
function addRemoteInputbox( lastId , val, parent, index, toolName )
{
	var toolBox = $('#'+toolName);
	if( val.trim().length > 0 )
	{
		var $div = $(".matrix-box[parent="+parent+"]", toolBox);
		// 데이터 수정일 때,
		if( $("input[taskid="+lastId+"]", $div).length > 0 )
		{
			$("input[taskid="+lastId+"]", $div).val(val);
		}
		// 데이터 추가 일 때,
		else
		{
			var len = $("input", $div).length;
			var emtpyInput = $("input[value='']", $div).length;
			if( len < 1 )
				$($div).append(makeInputbox(lastId, val, toolName));
			else if( len == 1 && emtpyInput > 0 )
				$("input", $div).before(makeInputbox(lastId, val, toolName));
			else if( len > 1 && emtpyInput > 0 )
				$("input:eq("+(len-2)+")",$div).after(makeInputbox(lastId, val, toolName));
			else if( len > 0 )
				$("input:eq("+(len-1)+")",$div).after(makeInputbox(lastId, val, toolName));
		}
	}
}

// 초기 box 생성시 input 생성
function setupBox(lastId, toolName)
{
	var toolBox = $('#'+toolName);
	//var boxCount = $('.matrix_table input', toolBox).length;

	var $div = $(".matrix-box:not(input):eq("+_now_tool_data.variables._box_count+")", toolBox);
	$div.append(makeInputbox(lastId, "", toolName));
	_now_tool_data.variables._box_count++;
}

function focusInput(t, toolName)
{
	var taskId = $(t).attr("taskid");
	_socket_matrix.emit('set_input_data', { idx_meeting: _idx_meeting, tool: toolName, id: taskId, index: 0, client: _client_id });
	if( $(".writing") == t )
		console.log("=");
	$(".writing").each(function(){
		//addInput( $(this) );
//		console.log( $(this).val() );
		$(this).removeClass("writing");
	});
	$(t).addClass("writing");
}

function setOption(data)
{
	if( data.option == "row" && data.val != "false" )
	{
		_now_tool_data.variables.setupFlag.row = true;
		_now_tool_data.variables.setupData.row = data.val;
		setDoMatrix(data.tool);
	}
	else if( data.option == "row" && data.val == "false" )
	{
		_now_tool_data.variables.setupFlag.row = false;
		_now_tool_data.variables.setupData.row = 0;
	}
	else if( data.option == "col" && data.val != "false" )
	{
		_now_tool_data.variables.setupFlag.col = true;
		_now_tool_data.variables.setupData.col = data.val;
		setDoMatrix(data.tool);
	}
	else if( data.option == "col" && data.val == "false" )
	{
		_now_tool_data.variables.setupFlag.col = false;
		_now_tool_data.variables.setupData.col = 0;
	}
	else if( data.option == "set" && data.val )
		setDoMatrix(data.tool);
	else if( data.option == "set" && !data.val )
		setDoClear(data.tool);
}

/*********************************  Socket ON START ******************************/
function addSocketListenerForMatrix()
{
	console.log( "addSocketListenerForMatrix" );
	_socket_matrix.on('get_tree_data', function (data) {
		_now_tool_data.variables.setupFlag.data_init = true;
		index = $(".matrix-box[parent="+data.parent+"]").length;
		addRemoteInputbox(data.id, data.val, data.parent, index, data.tool);
	});
	// matrix setup
	_socket_matrix.on('get_init_tool_data', function (data) {
		_now_tool_data.variables.setupFlag.data_init = true;
	});
	_socket_matrix.on('get_tree_option_data', function (data) {
		setOption(data);
	});
	_socket_matrix.on('get_option_data', function (data) {
		setOption(data);
	});

	_socket_matrix.on('get_insert_tree_data', function (data) {
		addRemoteInputbox(data.id, data.val, data.parent, data.index, data.tool);
	});

	_socket_matrix.on('get_delete_tree_data', function (data) {
		$("input[taskid="+data.id+"]").remove();
	});

	_socket_matrix.on('get_last_id', function (data) {
		lastId = data.last;
		var toolBox = $('#'+data.tool);
		var totalBoxCount = $('td', toolBox).length;
		//var boxCount = $('.matrix_table input', toolBox).length;
		if( totalBoxCount > _now_tool_data.variables._box_count )
		{
			setupBox(lastId, data.tool);
			$(".matrix-input:first").focus();
		}
		else
			addInputbox(lastId, "", data.tool);
	});

	/*
	_socket_matrix.on('get_input_data', function (data) {
	//	console.log( data.client );
	//	console.log( data.id );
	});
	*/
	/*********************************  Socket ON END *****************************/
}
