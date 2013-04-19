var width = 100;
var height = 100;
var tmpClient = 0;	//현재 클라이언트 번호
var tmpGroup = "matrix-group-1";	//현재 그룹
var toolName = "matrix";
var setupData = { row:0, col:0 }; // matrix 행, 열
var setupFlag = { data_init:false, row:false, col:false };
var optionId = { clear:999999, row:999998, col:999997 };
var boxCount = 0; // lastId 가 세팅 되어 있는 input 이 있는 박스 갯수
var totalBoxCount = 0; // row * col 총 박스 갯수
var setFlag = 0;
var clientColor = new Array( "none", "#99FF99", "#CCCC99", "#0099FF", "#CCFFCC", "#FFFF66", "#FF9999", "#669999", "#9999FF", "#00CCCC", "#CC9900");	

var inputFlag = 0;	//키입력 감지하기 위한 변수

////  socket.io 서버의 해당 그룹에 접속  ////
var socket = io.connect('http://61.43.139.69:8000/group');	// socket.io 서버에 접속

////  처음 창 오픈되었을 때 호출  ////
$(document).ready(function() {
	resizeMatrix();
	$(window).resize(function(){
		resizeMatrix();
	});
	socket.emit('join_room', { group: tmpGroup });
	socket.on('get_client', function (data) {
		console.log(data);
	});
	////  서버에 초기 데이터 요청하는 함수  ////
	socket.emit('set_tree_data', { group: tmpGroup, tool: toolName });
	socket.on('get_tree_data', function (data) {
		console.log(data);
	});

	$(window).focus(function(){
		$('.writing').focus();
	});
	$('.matrix').click(function(){
		//console.log("focus");
		//$('.writing').focus();
	});
}); 

function resizeMatrix(){
	width = $(window).width();
	height = $(window).height();
	$('.matrix').css({ width:width+"px", height:height+"px" });
}

function setMatrix(t){
	if( setupFlag.data_init == false )
	{
		setupData.row = $('#rowNum', $(t).parent() ).val();
		setupData.col = $('#colNum', $(t).parent() ).val();
		setupFlag.data_init = true;
		setupFlag.row = true;
		setupFlag.col = true;
		socket.emit('set_init_tool_data', { group: tmpGroup, tool: toolName });		
		socket.emit('set_option_data', { group: tmpGroup, tool: toolName, id: optionId.row, option: "row", val: setupData.row });
		socket.emit('set_option_data', { group: tmpGroup, tool: toolName, id: optionId.col, option: "col", val: setupData.col });
		setDoMatrix();
	}
}

function setClear() {
	//if( confirm("정말 삭제하겠습니까?") ) {
		socket.emit('set_option_data', { group: tmpGroup, tool: toolName, id: optionId.row, option: "row", val: false });
		socket.emit('set_option_data', { group: tmpGroup, tool: toolName, id: optionId.col, option: "col", val: false });
		socket.emit('set_option_data', { group: tmpGroup, tool: toolName, id: optionId.clear, option: "clear", val: true });
		setDoClear();
	//}
}

function setDoClear() {
	setupFlag.data_init = false;
	setupFlag.row = false;
	setupFlag.col = false;
	boxCount = 0;
	$('.matrix_table tbody').html("");
	$('.matrix_table colgroup').html("");
}

function setDoMatrix() {
	if( setupFlag.data_init && setupFlag.row && setupFlag.col )
	{
		var tmpRow = setupData.row;
		var tmpCol = setupData.col;
		totalBoxCount = (tmpRow*1)*(tmpCol*1);

		var tmpMatrix = $('.matrix_table tbody');
		var colGroup =  $('.matrix_table colgroup');
		var tmpTag = "";
		var colWidth = $('.matrix_table').width() / ((tmpCol*1));

		var i=0, j=0;
		for (i=0; i<parseInt(tmpRow); i++) {
			tmpTag = "<tr class='row'></tr>";
			tmpMatrix.append(tmpTag);
			for (j=0; j<parseInt(tmpCol); j++) {
				if (i==0)
					colGroup.append("<col width='"+colWidth+"px'>");

				var tmpInsertRow = tmpMatrix.find('.row:last');
				tmpTag = "<td><div class='input_line matrix-box' parent='"+( (i*tmpCol)+j )+"'></div></td>";
				tmpInsertRow.append(tmpTag);
				socket.emit('set_last_id', { group: tmpGroup, tool: toolName });
			}
		}

		$('.matrix_table tr:nth-child(even) td:nth-child(even)').addClass("even");
		$('.matrix_table tr:nth-child(even) td:nth-child(odd)').addClass("c-even");
		$('.matrix_table tr:nth-child(odd) td:nth-child(even)').addClass("odd");
		$('.matrix_table tr:nth-child(odd) td:nth-child(odd)').addClass("c-odd");

		$('.matrix-box').click(function(e){
			if( e.target.localName == "div" )
				$('input:last', this).focus();					
		});
	}
}

// 키 입력 체크 함수 ( enter, backspace )
function keyDownCheck(t, e)
{
	var $div = $(t).parent();
	if( e.keyCode == 13 && $(t).val().trim().length > 0 )
		addInput(t);
	else if( (e.keyCode == 8 ) && $(t).val().trim().length < 1 && $("input",$div).length > 1 )
	{
		delInput(t);
		return false;
	}
	return true;
}

function addInput(t)
{
	var $div = $(t).parent();
	var taskId = $(t).attr("taskid");
	var parent = $(t).parent().attr("parent");
	var idx = 0;
	$("input", $(t).parent()).each(function(i){
		if( $(this).attr("taskid") == taskId )
			idx = i;
	});
	var val = $(t).val();
	socket.emit('set_insert_tree_data', { group: tmpGroup, tool: toolName, id: taskId, parent: parent, index: idx, val: val });

	// 비어있는 input 박스 존재 유무 확인
	var existObj = null;
	$("input", $div).each(function(){
		if( $(this).val().trim().length < 1 )
			existObj = $(this);
	});
	if( existObj != null )
		existObj.focus()
	else
		socket.emit('set_last_id', { group: tmpGroup, tool: toolName });
}

function delInput(t)
{
	var $div = $(t).parent();
	var taskId = $(t).attr("taskid");
	$(t).remove();
	socket.emit('set_delete_tree_data', { group: tmpGroup, tool: toolName, id: taskId });
	$("input",$div).focus();
}

function makeInputbox(lastId, val)
{
	if( typeof(val) == "undefined" )
		val = "";
	var html = "<input taskid='"+lastId+"' type='text' class='matrix-input' name='matrix-input' onkeydown='javascript:return keyDownCheck(this, event);' onfocus='focusInput(this);' value='"+val+"'>";
	return html
}

// 이전에 작성중이였던 box를 찾아서 input 추가
function addInputbox( lastId , val )
{
	// 작성중이였던 input select
	var $input = $('.writing');
	$input.removeClass("writing");
	// 작성중이였던 div select
	var $div = $input.parent();
	$div.append(makeInputbox(lastId, val));
	$('input:last', $div).focus();
	var h = $div.height();
	var td_obj = $div.parent().parent();
	$("div.matrix-box", td_obj).css("min-height", h+"px");
	$('input:last', $div).focus();
}

// 동기화를 위한 원격에서 input 요청
function addRemoteInputbox( lastId , val, parent, index )
{
	var $div = $(".matrix-box[parent="+parent+"]");
	// 데이터 수정일 때,
	if( $("input[taskid="+lastId+"]", $div).length > 0 )
	{
		$("input[taskid="+lastId+"]", $div).val(val);
	}
	// 데이터 추가 일 때,
	else
	{
		if( index > 0 )
			$("input:eq("+(index-1)+")",$div).after(makeInputbox(lastId, val));
		else
			$("input:eq("+(index)+")",$div).before(makeInputbox(lastId, val));
	}
}

// 초기 box 생성시 input 생성
function setupBox(lastId)
{
	var $div = $(".matrix-box:not(input):nth-child("+boxCount+")");
	$div.append(makeInputbox(lastId, ""))
	boxCount++;
}

function focusInput(t)
{
	if( $(".writing") == t )
		console.log("=");
	$(".writing").each(function(){
		//addInput( $(this) );
//		console.log( $(this).val() );
		$(this).removeClass("writing");
	});
	$(t).addClass("writing");
}

// matrix setup
socket.on('get_init_tool_data', function (data) {
	setupFlag.data_init = true;
	setDoMatrix();
});
socket.on('get_option_data', function (data) {
	if( data.option == "row" && data.val )
	{
		setupFlag.row = true;
		setupData.row = data.val;
		setDoMatrix();
	}
	else if( data.option == "row" && !data.val )
	{
		setupFlag.row = false;
		setupData.row = 0;
	}
	else if( data.option == "col" && data.val )
	{
		setupFlag.col = true;
		setupData.col = data.val;
		setDoMatrix();
	}
	else if( data.option == "col" && !data.val )
	{
		setupFlag.col = false;
		setupData.col = 0;
	}
	else if( data.option == "clear" && data.val )
		setDoClear();
});

socket.on('get_insert_tree_data', function (data) {
	console.log( data );
	addRemoteInputbox(data.id, data.val, data.parent, data.index);
	//$(".matrix-box:eq("+data.parent+") input:eq("+data.index+")").val(data.val);
	//socket.emit('set_last_id', { group: tmpGroup, tool: toolName });
});

socket.on('get_delete_tree_data', function (data) {
	$("input[taskid="+data.id+"]").remove();
});

socket.on('get_last_id', function (data) {
	console.log( data );
	var tmpTool = data.tool; 
	lastId = data.last;
	if( totalBoxCount != boxCount )
		setupBox(lastId);
	else
		addInputbox(lastId, "");
});
