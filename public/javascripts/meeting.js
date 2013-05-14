var _toolWindowList = new Array();	// 도구창 저장하는 배열
var _tool_list_count = 0;
var _tool_postit_count = 0;
var _tool_mindmap_count = 0;
var _tool_vote_count = 0;
var _tool_matrix_count = 0;
var _common_window_top = 50;
var _common_windot_left = 20;
var _new_z_index = 0;
var _drawtool = 'pen';
var _group_id = 1;
var _is_rightpanel_open = true;
var _window_width = 0;
var _window_height = 0;

var _socket_common;
var _socket_list;
var _socket_postit;
var _socket_mindmap;
var _socket_vote;
var _socket_matrix;

var _is_added_socket_listener_for_list = false;

$(document).ready(function() {
	// 크기 조정
	$(window).resize();

	setRightpanel("participants");	// 최초에는 오른쪽 패널에 참가자 탭을 보여줌

	// 소켓 열기
	openSocket();

	// 콘텐트 관리 상자 초기화
	share_box.init();
	addLinkList("네이버", "http://naver.com");
	addLinkList("다음", "http://daum.net");
	$('#btn_addlink').click(function() {
		var linktitle = $('#txt_linktitle').val();
		var linkurl = $('#txt_linkurl').val();
		addLinkList(linktitle, linkurl);
	});

	// 화이트보드 초기화
	//$('#meetingboard #whiteboard_control_box').draggable();	// 화이트보드 도구 상자 움직이기 가능
	$('#meetingboard #btn_drawtool_pen').click(function() {
		_drawtool = 'pen';
	});
	$('#meetingboard #btn_drawtool_rect').click(function() {
		_drawtool = 'rect';
	});
	$('#meetingboard #btn_drawtool_ellipse').click(function() {
		_drawtool = 'ellipse';
	});

	$('#meetingboard #btn_text_add').click(function() {
		_drawtool = 'text';
	});

	// 알림 예시
	showPopupWindow("회의가 시작되었습니다.");
	setTimeout('showPopupWindow("정용기님이 입장하셨습니다.")', 300);
	setTimeout('showPopupWindow("김태하님이 입장하셨습니다.")', 4000);
	setTimeout('showPopupWindow("임종혁님이 입장하셨습니다.")', 5000);
	setTimeout('showPopupWindow("김정호님이 입장하셨습니다.")', 5500);
	setTimeout('showPopupWindow("고동현님이 입장하셨습니다.")', 20000);
	setTimeout('showPopupWindow("올바른 회의 진행을 위해서는 서로를 존중하는 마음을 가져야 합니다.")', 22000);

	// 파일 업로드 초기화
	$('#btn_uploadFile').click(function() {
            $('#uploadForm').submit();
	});
            
	$('#uploadForm').submit(function() { 
        $(this).ajaxSubmit({                                                                                                                 
 
            error: function(xhr) {
				status('Error: ' + xhr.status);
            },
 
            success: function(response) {
            	console.log(response);
            	
            	var newfileitem = "";
            	var filetypeinfo = getFileTypeInfo(response.filetype);
            	
            	newfileitem += "<li>";
            	newfileitem += "<a href=\"";
            	newfileitem += "/tmp/";
            	newfileitem += response.filename;
            	newfileitem += "\">";
            	newfileitem += "<img src=\"";
            	newfileitem += filetypeinfo.iconurl;
            	newfileitem += "\" width=\"16\" height=\"16\" /> ";
            	newfileitem += "[" + filetypeinfo.category + "]";
            	newfileitem += response.filename;
            	newfileitem += "</a>";
            	newfileitem += "</li>";
				$('#file_list').append(newfileitem);
            }
		});

		return false;
    });
});

$(window).resize(function() {
	resetSizeInfo();
	resizeWhiteBoardControlBox();
});

// 소켓 열기
function openSocket()
{
	_socket_common = io.connect('http://61.43.139.69:50000/group');
	_socket_list = io.connect('http://61.43.139.69:50001/group');
	_socket_postit = io.connect('http://61.43.139.69:50002/group');
	_socket_mindmap = io.connect('http://61.43.139.69:50003/group');
	_socket_vote = io.connect('http://61.43.139.69:50004/group');
	_socket_matrix = io.connect('http://61.43.139.69:50005/group');
	_socket_board = io.connect('http://61.43.139.69:50006/group');
}

function resetSizeInfo()
{
	_window_width = $(window).width();
	_window_height = $(window).height();
}

function resizeWhiteBoardControlBox()
{
	var whiteboard_control_box = $("#whiteboard_control_box");

	if (_is_rightpanel_open == true)
	{
		var rightpanel = $("#rightpanel");
		var width = _window_width - rightpanel.width();
		whiteboard_control_box.width(width);
	}
	else
	{
		whiteboard_control_box.width(_window_width);
	}
}

function getFileTypeInfo(filetype)
{
	var result = {};

	switch(filetype)
	{
	case "application/pdf":
		result.category = "document";
		result.iconurl = "../images/pdf.png";	
		break;
	case "application/haansofthwp":
		result.category = "document";
		result.iconurl = "../images/hangul.png";
		break;
	case "image/jpeg":
	case "image/png":
		result.category = "image";
		result.iconurl = "../images/image.png";
		break;
	default:
		result.category = "unknown";
		result.iconurl = "../images/unknown.png";
	}

	return result;
}



var share_box = ( function() {
		function _addEventListeners() {
			$('#whiteboard_control_box #btn_show_share_box').click(function() {
				$('#window_share_box').jqxWindow('open');
				console.log("open share_box");
			});
		};
		function _createElements() {
			$('#whiteboard_control_box #btn_show_share_box')
				.jqxButton({ theme: share_box.config.theme, width: '50px' });
		};
		function _createWindow() {
			$('#window_share_box').jqxWindow({
				showCollapseButton : true,
				maxHeight : 1000,
				maxWidth : 1000,
				minHeight : 200,
				minWidth : 200,
				height : 300,
				width : 500,
				theme : share_box.config.theme,
				initContent : function() {
					$('#window_share_box #tab').jqxTabs({
						height : '100%',
						width : '100%',
						theme : share_box.config.theme
					});
					$('#window_share_box').jqxWindow('focus');
				}
			});
		};
		return {
			config : {
				dragArea : null,
				theme : null
			},
			init : function() {
				_createElements();
				_addEventListeners();
				_createWindow();
			}
		};
	}());


function onFileDragEnter(event)
{
	event.stopPropagation();
	event.preventDefault();

	if (event.dataTransfer.dropEffect == "move")
    	event.preventDefault();
}    

function onFileDragOver(event)
{
    event.stopPropagation();
    event.preventDefault(); 
    
    if (event.dataTransfer.dropEffect == "move")
      event.preventDefault();      
}                  

function onFileDrop(event)
{
    event.stopPropagation();
    event.preventDefault(); 
    
	console.log(event);

    var file = event.dataTransfer.files[0];      
           
    var imageType = /image.*/;
    var textType = /text.*/;
    var isImage;
    
    if(file.type.match(imageType)){
      isImage = true; 
    }
    else if(file.type.match(textType)){
      isImage = false;
    } 
             
    var reader = new FileReader();    
    
    reader.onload = (function(aFile){return function(e) {         
			var result = e.target.result;  
			if(isImage)
			{
				dropImage.src = result;                                                                            
				dropBox.appendChild(dropImage)
			}
			else
			{
				dropBox.innerHTML = result;
			}        
		};
    })(file);
      
    if(isImage){ reader.readAsDataURL(file); }
    else { reader.readAsText(file,"utf-8"); }
}


function addLinkList(title, link)
{
	var link_list = $('#window_share_box #link_list');
	var newlink = "<li>";
		newlink += "<span>";
		newlink += title;
		newlink += "</span> ";
		newlink += "<span><a href=\"";
		newlink += link;
		newlink += "\">";
		newlink += link;
		newlink += "</a></span>";
		newlink += "</li>";
		link_list.append(newlink);
}

// 오른쪽 메뉴 전환
function setRightpanel(panel)
{
	$("#rightpanel #tabbar li").css("background-color", "");
	$("#rightpanel #tabbar #" + panel).css("background-color", "#111111");

	switch (panel)
	{
	case "participants":
		break;
	case "tools":
		break;
	case "info":
		break;
	}

	$("#rightpanel #panelcontents div").hide();
	$("#rightpanel #panelcontents #" + panel).show();
}


var _tool_type = "";
/* 도구별 소스를 동적으로 가져옴 */
function getToolSource(tool_type, initFuncName)
{
	var source_url = "";
	var tool_index = "";
	_tool_type = tool_type;
	
	switch (tool_type)
	{
	case "list":
		tool_index = _tool_list_count++;
		break;
	case "postit":
		tool_index = _tool_postit_count++;
		break;
	case "mindmap":
		tool_index = _tool_mindmap_count++;
		break;
	case "vote":
		tool_index = _tool_vote_count++;
		break;
	case "matrix":
		tool_index = _tool_matrix_count++;
		break;
	}
	
	source_url = "../tool/" + _tool_type + "/" + _group_id + "/" + tool_index;
	console.log("부른 도구의 Source url :: " + source_url);
	
	$.ajax({
		type: "GET",
		url: source_url,
//		data: {tool_index: tool_index, group_id: _group_id},
		dataType: "html",
		success: function(data) {
			initFuncName(tool_index, _group_id);
			if (_is_added_socket_listener_for_list == false)
			{
				addSocketListenerForList();
				_is_added_socket_listener_for_list = true;
			}
//			includeFileDynamically(data.include_list);
			addTool(_tool_type, data);
		},
		error: function(err) {
			console.log(err);
			return false;
		}
	});
}

/* 동적으로 파일 추가 */
function includeFileDynamically(list) {
	console.log("call lncludeFileDynamically");
	for (var i = 0; i < list.length; i++)
	{
		var include_target = list[i];
	
		if (include_target.indexOf(".js") != -1)
		{
			var oScript = document.createElement("script");
			oScript.type = "text/javascript";
			oScript.charset ='utf-8';
			oScript.src = include_target;			
			document.getElementsByTagName("head")[0].appendChild(oScript);
		}
		else if (include_target.indexOf(".css") != -1)
		{
			var oCSS = document.createElement("link");
			oCSS.rel = "stylesheet";
			oCSS.href = include_target;
			oCSS.type = "text/css";
			document.getElementsByTagName("head")[0].appendChild(oCSS);
		}
	}

}


function addTool(type, source)
{
	console.log("CALL addTool [type=" + type + ", source=" + source + "]");

	var tool = new Array();

	var list_window_width = 600;
	var list_window_height = 400;
	var postit_window_width = 600;
	var postit_window_height = 400;
	var mindmap_window_width = 600;
	var mindmap_window_height = 400;
	var vote_window_width = 500;
	var vote_window_height= 400;

	console.log('addToolWindow 호출됨, type:' + type);
	switch (type)
	{
	case "list":
		tool['type'] = 'list';
		tool['name'] = 'list' + _tool_list_count;
		tool['title'] = '리스트 ' + _tool_list_count;
		tool['width'] = list_window_width;
		tool['height'] = list_window_height;
		tool['left'] = _common_windot_left;
		tool['top'] = _common_window_top;
		tool['variables'] = ""; 
		break;
	case "postit":
		tool['type'] = 'postit';
		tool['name'] = 'postit' + _tool_postit_count;
		tool['title'] = '포스트잇 ' + _tool_postit_count;
		tool['width'] = postit_window_width;
		tool['height'] = postit_window_height;
		tool['left'] = _common_windot_left;
		tool['top'] = _common_window_top;
		tool['variables'] = "";
		break;
	case "mindmap":
		tool['type'] = 'mindmap';
		tool['name'] = 'mindmap' + _tool_mindmap_count;
		tool['title'] = '마인드맵 ' + _tool_mindmap_count;
		tool['width'] = mindmap_window_width;
		tool['height'] = mindmap_window_height;
		tool['left'] = _common_windot_left;
		tool['top'] = _common_window_top;
		tool['variables'] = "";
		break;
	case "vote":
		tool['type'] = 'vote';
		tool['name'] = 'vote' + _tool_vote_count;
		tool['title'] = '투표 ' + _tool_vote_count;
		tool['width'] = vote_window_width;
		tool['height'] = vote_window_height;
		tool['left'] = _common_windot_left;
		tool['top'] = _common_window_top;
		tool['variables'] = "";
		break;
	case "matrix":
		tool['type'] = 'matrix';
		tool['name'] = 'matrix' + _tool_matrix_count;
		tool['title'] = 'matrix ' + _tool_matrix_count;
		tool['width'] = matrix_window_width;
		tool['height'] = matrix_window_height;
		tool['left'] = _common_windot_left;
		tool['top'] = _common_window_top;
		tool['variables'] = "";
		break;
	}
	tool['source'] = source;
	
	_common_windot_left += 10;
	_common_window_top += 10;

		console.log('addTool source : ', tool['source']);

	_toolWindowList.push(tool);
	showToolWindow(_toolWindowList.length - 1);
}

// 도구창 보여주는 함수
function showToolWindow(idx)
{
	var titlebarHeight = 29;
	var statusbarHeight = 20;
	var toolname = _toolWindowList[idx]['name'];
	var tooltitle = _toolWindowList[idx]['title'];
	var tooltop = _toolWindowList[idx]['top'];
	var toolleft = _toolWindowList[idx]['left'];
	var toolsource = '<div class="toolwindow" onmousemove="switchToolVariables(\'' + toolname + '\')" id="' + toolname + '" onclick="upToFrontWindow(\'' + toolname + '\')">';
		toolsource += '<div class="title">';
			toolsource += '<div class="title_text">' + tooltitle + '</div>';
			//toolsource += '<div class="closewindow" onclick="closeToolWindow(\'' + idx + '\')">닫기</div>';
			//toolsource += '<div class="closewindow" onclick="transWindow(\'' + toolname + '\')">투명</div>';
			//toolsource += '<div class="clearboth"></div>';
		toolsource += '</div>';
		toolsource += _toolWindowList[idx]['source'];
		toolsource += '</div>';
	var toolwidth = _toolWindowList[idx]['width'];
	var toolheight = _toolWindowList[idx]['height'] + titlebarHeight + statusbarHeight;

	$('#' + toolname).css('z-index', _new_z_index);
	_new_z_index++;

	switch (_toolWindowList[idx]['type'])
	{
	case "list":
		$('#meetingboard').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		break;
	case "postit":
		$('#meetingboard').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		break;
	case "mindmap":
		$('#meetingboard').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		break;
	case "matrix":
		$('#meetingboard').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		break;
	case "vote":
		$('#meetingboard').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		break;
	}
	toolsource += '<div class="statusbar">ㄹㄴㅁㅇㄹㅇㄴ</div></div></div>';

	//$('#' + _toolWindowList[idx]['name']).draggable(); // Jquery-ui 기본 드래그 기능

	$('#' + _toolWindowList[idx]['name']).jqxWindow({
		showCollapseButton : true,
		maxHeight : 1000,
		maxWidth : 1000,
		minHeight : 200,
		minWidth : 200,
		height : 300,
		width : 500,
		theme : share_box.config.theme,
        initContent: function () {
        	console.log('INIT #' + _toolWindowList[idx]['name']);
        	
			switch (_toolWindowList[idx]['type'])
			{
				case "list":
					break;
				case "postit":
					break;
				case "mindmap":
					break;
				case "matrix":
					_tmpGroup = "group1";	//현재 그룹
					_toolName = _toolWindowList[idx]['name'];
					resizeMatrix();
					$(window).resize(function(){
						resizeMatrix();
					});
					_socket_matrix.emit('join_room', { group: _tmpGroup });
					////  서버에 초기 데이터 요청하는 함수  ////
					_socket_matrix.emit('set_tree_data', { group: _tmpGroup, tool: _toolName });
					_socket_matrix.emit('set_tree_option_data', { group: _tmpGroup, tool: _toolName });

					/*
					resizeMatrix();
					$(window).resize(function(){
						resizeMatrix();
					});

					socket.emit('join_room', { group: tmpGroup });
					////  서버에 초기 데이터 요청하는 함수  ////
					socket.emit('set_tree_data', { group: tmpGroup, tool: toolName });
					socket.emit('set_tree_option_data', { group: tmpGroup, tool: toolName });

					$(window).focus(function(){
						$('.writing').focus();
					});
					$('.matrix').click(function(){
						//console.log("focus");
						//$('.writing').focus();
					});
					*/
					break;
			}
			
			$('#window_share_box').jqxWindow('focus');
		}
    });

                
	$('#' + _toolWindowList[idx]['name']).css('left', toolleft + 'px');
	$('#' + _toolWindowList[idx]['name']).css('top', tooltop + 'px');

	console.log('toolsource : ' + toolsource);
}

var _now_toolname = "";
function switchToolVariables(toolname)
{
	_now_toolname = toolname;
	console.log("CALL switchToolInstance : " + _now_toolname);	
	/*

	if (toolname.substr(0,4) == "list")
	{
		
	}
	else if (toolname.substr(0,6) == "postit")
	{
		
	}
	else if (toolname.substr(0,7) == "mindmap")
	{
		
	}
	else if (toolname.substr(0,4) == "vote"")
	{
		
	}
	else if (toolname.substr(0,6) == "matrix")
	{
		
	}
	*/
}

// 도구창 닫는 함수
function closeToolWindow(idx)
{
	$('#' + _toolWindowList[idx].name).hide();
}

function resumeToolWindow(idx)
{
	$('#' + _toolWindowList[idx].name).show();
}


// 팝업창 추가하고 여는 함수
var _popupcount = 0;
function showPopupWindow(content, popuptype)
{
	var nowpopupcount = _popupcount;
	var source = '<div id="popup' + nowpopupcount + '" class="splashpopup">';
		source += '<div class="title"><span class="closepopup" onmousedown="closePopupWindow(' + nowpopupcount + ')">닫기</span></div>';
		source += '<div class="popupcontent">' + content + '</div>';
		source += '</div>';
	$('#splashpopup_wrapper').prepend(source);
	$('#popup' + nowpopupcount).fadeIn('slow');

	setTimeout("closePopupWindow(" + nowpopupcount + ")", 3000);
	_popupcount++;
}

function closePopupWindow(idx)
{
	$('#popup' + idx).fadeOut('slow');
}

setInterval("showRunTime()", 1000);
var _runTime = 0;
var _totalTime = "30:00:00";	// 회의 전체 시간
var _alarmList = new Array();
function showRunTime()
{
	var hour = parseInt(_runTime / 60 / 60);
	var minute = parseInt(_runTime / 60);
	var second = parseInt(_runTime % 60);
	var tHour, tMinute, tSecond;

	if (hour < 10)	tHour = "0" + hour;
	else	tHour = tHour;

	if (minute < 10)	tMinute = "0" + minute;
	else	tMinute = minute;

	if (second < 10)	tSecond = "0" + second;
	else	tSecond = second;

	var nowRunTime = tHour + ":" + tMinute + ":" + tSecond;

	$('#runTime').html(nowRunTime + " / " + _totalTime);

	catchAlarmTime();
	
	_runTime++;
}

function addAlarmTime(hour, minute, second)
{
	// var newtime = new Array();
	// newtime["hour"] = hour;
	// newtime["minute"] = minute;
	// newtime["second"] = second;
	var newtime = hour * 60 * 60 + minute * 60 + second;
	_alarmList.push(newtime);
}

function catchAlarmTime()
{
	for (var i = 0; i < _alarmList.length; i++)
	{
		if (_runTime == _alarmList[i])
		{
			console.log("알람 발생");
		}
	}
}


function upToFrontWindow(name)
{
	var size = _toolWindowList.length;
	for (var i = 0; i < size; i++)
	{
		if (_toolWindowList[i].name == name)
		{
			var now_z = parseInt($('#' + _toolWindowList[i].name).css('z-index'));
			$('#' + _toolWindowList[i].name).css('z-index', (now_z + size) );
			_new_z_index += size;
			break;
		}
	}
}

function transWindow(name)
{
	$('#' + name).removeClass('toolwindow');
	$('#' + name).addClass('toolwindow_trans');
}


function showEvaluateMeetingWindow()
{
	var html = "";
		html += "<div>";
			html += "<div >How was your meeting? Please evaluate your experience for the meeting.</div>";
			html += "<div>How are you satisfied with the meeting?"
				html += "<div id=\"meeting_rating\"></div>";
			html += "</div>";
			html += "<div>How are you satisfied with the facilitation?";
				html += "<div id=\"fac_rating\"></div>";
			html += "</div>";
			html += "<div>How are you satisfied with yourself in the meeting?";
				html += "<div id=\"self_rating\"></div>";
			html += "</div>";
		html += "</div>";

	console.log(html);

	dialog = bootbox.dialog(html, [{
							"label" : "Finish",
							"class" : "btn-success",
							"callback": function() {
								var meeting_satisfaction_point = $("#meeting_rating").jqxRating('getValue');
								var fac_satisfaction_point = $("#fac_rating").jqxRating('getValue');
								var self_satisfaction_point = $("#self_rating").jqxRating('getValue');
								// 페이지 이동
								return true;
							}
						}]);

	$("#meeting_rating").jqxRating({ width: 600, height: 60, theme: 'classic'});
	$("#fac_rating").jqxRating({ width: 600, height: 60, theme: 'classic'});
	$("#self_rating").jqxRating({ width: 600, height: 60, theme: 'classic'});
}


function changePenColor(color)
{
	_pen_color = color;
}


var _pen_color = "#000000";
var _fill_color = "#000000";

if(window.addEventListener) {
	var dBoard;

	function init()
	{
		var canvas = document.getElementById("canvasView");

		if(!canvas)
		{
			alert('캔버스 참조 실패');
			return;
		}

		if(!canvas.getContext){
			alert("canvas.getContext를 사용할 수 없음");
			return;
		}

		dBoard = new DrawBoard(canvas);
		dBoard.initBoard();
	}

	window.addEventListener( "load", init, false );



	function DrawBoard( objCanvas ){
		var canvas = objCanvas;
		var pen	= new GraphicPen(canvas);
		var prev_point;

		this.initBoard	=function() {
			canvas.addEventListener("mousedown", onMouseDown_Canvas, false);
		}
		function registMouseInteraction()
		{
			window.removeEventListener("mouseup", onMouseUp_Canvas, false);
			canvas.removeEventListener("mousemove", onMouseMove_Canvas, false);
		}
		function clearMouseInteraction()
		{
			window.removeEventListener("mouseup", onMouseUp_Canvas, false);
			canvas.removeEventListener("mousemove", onMouseMove_Canvas, false);
		}

		// 마우스 이벤트 등록 및 pen의 위치를 마우스 좌표로 이동
		function onMouseDown_Canvas(event)
		{
			console.log("Call onMouseDown_Canvas");
			canvas.addEventListener("mousemove", onMouseMove_Canvas, false);
			window.addEventListener("mouseup", onMouseUp_Canvas, false);
			switch (_drawtool)
			{
				case 'pen':
					var point = getMousePoint(event);
					pen.moveTo( point );
					break;
				case 'rect':
					prev_point = getMousePoint(event);
					console.log("[Prev] x : " + prev_point.x + ", y : " + prev_point.y); 
					break;
				case 'ellipse':
					prev_point = getMousePoint(event);
					console.log("[Prev] x : " + prev_point.x + ", y : " + prev_point.y); 
					break;
			}
		}

		// 마우스 업시 등록한 마우스 이벤트 해지 
		function onMouseUp_Canvas( event ){
			console.log("Call onMouseUp_Canvas");
			var now_point = getMousePoint(event);
			switch (_drawtool)
			{
				case 'pen':
					console.log(now_point);
					break;
				case 'rect':
					var width = now_point.x - prev_point.x;
					var height = now_point.y - prev_point.y;
					GraphicRect('canvasView', prev_point.x, prev_point.y, width, height);
					break;
				case 'ellipse':
					var width = now_point.x - prev_point.x;
					var height = now_point.y - prev_point.y;
					GraphicCircle('canvasView', prev_point.x, prev_point.y, width, height);
					break;
				case 'text':
					addTextToCanvas(now_point.x, now_point.y);
					break;
			}
			window.removeEventListener("mouseup", onMouseUp_Canvas, false);
			canvas.removeEventListener("mousemove", onMouseMove_Canvas, false);
		}

		// pen에 draw요청
		function onMouseMove_Canvas( event ){
			switch (_drawtool)
			{
				case 'pen':
					var point = getMousePoint( event );
					pen.draw( point );
					break;
				case 'ellipse':

					break;
			}
		}

		// 마우스 좌표를 브라우저에 따라 반환
		function getMousePoint( event ){
			var x,y;
			if( event.layerX || event.layerY == 0 ){ // fireFox
				x	=event.layerX;
				y	=event.layerY;
			} else if( event.offsetX || event.offsetY == 0 ){ // opera
				x	=event.offsetX;
				y	=event.offsetY;
			}
			return {x:x, y:y};
		}
	}
}

function addTextToCanvas(x, y)
{
	console.log("call addTextToCanvas");
	var drawtext_container = $('#meetingboard #drawtext_container');
	var inputbox = $('#meetingboard #drawtext_container #inputbox');
	inputbox.val("");
	inputbox.focus();
	drawtext_container.css('display', 'block');
	drawtext_container.css('left', x + 'px');
	drawtext_container.css('top', y + 'px');
	console.log();
}


function GraphicPen(objBoard)
{
	this.pen	= objBoard.getContext('2d');

	this.moveTo	= function(point) {
		this.pen.beginPath();
		this.pen.strokeStyle = _pen_color;
		this.pen.moveTo( point.x, point.y );
	}

	this.draw = function(point) {
		this.pen.lineTo( point.x, point.y );
		this.pen.stroke();
	}

}

function GraphicRect(objBoard, left, top, width, height)
{
    var canvas = document.getElementById(objBoard);
    if (canvas.getContext) {
      var context = canvas.getContext('2d');
      
      context.fillStyle = _fill_color;
      context.fillRect(left, top, width, height);
    } else {
    	console.log("canvas 안 됨");
    }
}

function GraphicCircle(objBoard, x, y, width, height)
{
	var canvas = document.getElementById(objBoard);
	var ctx = canvas.getContext('2d');
	var startAngle = 0;
	var endAngle = 360 * Math.PI / 180;

	ctx.fillStyle = _fill_color;
	ctx.fillRect(x, y, width, height);
	ctx.beginPath();
    ctx.arc(x, y, startAngle, endAngle, Math.PI*2, true);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    //ctx.closePath();
}

function GraphicText(objBoard, x, y, text)
{
	var canvas = document.getElementById(objBoard);
	var canvas_context = canvas.getContext("2d");
	canvas.fillText(text, x, y);
}