var _toolWindowList = new Array();	// 도구창 저장하는 배열
var _tool_list_count = 0;
var _tool_postit_count = 0;
var _tool_mindmap_count = 0;
var _tool_vote_count = 0;
var _common_window_top = 50;
var _common_windot_left = 20;
var _new_z_index = 0;
var _drawtool = 'pen';

$(document).ready(function() {
	setRightpanel("participants");	// 최초에는 오른쪽 패널에 참가자 탭을 보여줌
	
	// 콘텐트 관리 상자 초기화
	cm_box.init();
	addLinkList("네이버", "http://naver.com");
	addLinkList("다음", "http://daum.net");
	
	// 화이트보드 초기화
	$('#meetingboard #whiteboard_control_box').draggable();	// 화이트보드 도구 상자 움직이기 가능
	$('#meetingboard #btn_drawtool_pen').click(function() {
		_drawtool = 'pen';
	});
	$('#meetingboard #btn_drawtool_rect').click(function() {
		_drawtool = 'rect';
	});
	$('#meetingboard #btn_drawtool_ellipse').click(function() {
		_drawtool = 'ellipse';
	});
		
	// 알림 예시
	showPopupWindow("회의가 시작되었습니다.");
	setTimeout('showPopupWindow("정용기님이 입장하셨습니다.")', 300);
	setTimeout('showPopupWindow("김태하님이 입장하셨습니다.")', 4000);
	setTimeout('showPopupWindow("임종혁님이 입장하셨습니다.")', 5000);
	setTimeout('showPopupWindow("김정호님이 입장하셨습니다.")', 5500);
	setTimeout('showPopupWindow("정용기님이 퇴장하셨습니다.")', 12000);
	setTimeout('showPopupWindow("고동현님이 입장하셨습니다.")', 20000);
	setTimeout('showPopupWindow("올바른 회의 진행을 위해서는 서로를 존중하는 마음을 가져야 합니다.")', 22000);

});



var cm_box = ( function() {
		function _addEventListeners() {
			$('#whiteboard_control_box #btn_show_cm_box').click(function() {
				$('#content_manage_box').jqxWindow('open');
				console.log("open cm_box");
			});
		};
		function _createElements() {
			$('#whiteboard_control_box #btn_show_cm_box')
				.jqxButton({ theme: cm_box.config.theme, width: '50px' });
		};
		function _createWindow() {
			$('#content_manage_box').jqxWindow({
				showCollapseButton : true,
				maxHeight : 400,
				maxWidth : 700,
				minHeight : 200,
				minWidth : 200,
				height : 300,
				width : 500,
				theme : cm_box.config.theme,
				initContent : function() {
					$('#content_manage_box #tab').jqxTabs({
						height : '100%',
						width : '100%',
						theme : cm_box.config.theme
					});
					$('#content_manage_box').jqxWindow('focus');
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

function addLinkList(title, link)
{
	var link_list = $('#content_manage_box #link_list');
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

function addTool(type)
{
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
		_tool_list_count++;
		tool['type'] = 'list';
		tool['name'] = 'list' + _tool_list_count;
		tool['title'] = '리스트 ' + _tool_list_count;
		tool['width'] = list_window_width;
		tool['height'] = list_window_height;
		tool['left'] = _common_windot_left;
		tool['top'] = _common_window_top;
		tool['source'] = '<div id="container" class="listtool" style="height: ' + tool['height'] + 'px; width: ' + tool['width'] + 'px; overflow-y: scroll">';
			tool['source'] += '<section id="main_section" style="height: ' + tool['height'] + 'px; width: ' + tool['width'] + 'px">';
				tool['source'] += '<article>';
/*				tool['source'] += '<header>';
					tool['source'] += '<div class="home_line">';
						tool['source'] += '<div class="home_box">';
							tool['source'] += '<div id="homeButton"><h2>Home</h2></div>';
						tool['source'] += '</div>';
						tool['source'] += '<div class="init_box">';
							tool['source'] += '<div id="initButton" onClick="initData()"><h2>Clear</h2></div>';
						tool['source'] += '</div>';
					tool['source'] += '</div>';
				tool['source'] += '</header>';*/
				tool['source'] += '<div class="list_space">';
					tool['source'] += '<div class="children">';
					tool['source'] += '</div>';
				tool['source'] += '</div>';
				tool['source'] += '</article>';
			tool['source'] += '</section>';
		tool['source'] += '</div>'; 	// 리스트 도구 소스 들어갈 부분
		break;
	case "postit":
		_tool_postit_count++;
		tool['type'] = 'postit';
		tool['name'] = 'postit' + _tool_postit_count;
		tool['title'] = '포스트잇 ' + _tool_postit_count;
		tool['width'] = postit_window_width;
		tool['height'] = postit_window_height;
		tool['left'] = _common_windot_left;
		tool['top'] = _common_window_top;
		tool['source'] = '<iframe src="../tools/postit/postit.html" width="' + tool['width'] + '" height="' + tool['height'] + '"></iframe>';	// 포스트잇 도구 소스 들어갈 부분		
		break;
	case "mindmap":
		_tool_mindmap_count++;
		tool['type'] = 'mindmap';
		tool['name'] = 'mindmap' + _tool_mindmap_count;
		tool['title'] = '마인드맵 ' + _tool_mindmap_count;
		tool['width'] = mindmap_window_width;
		tool['height'] = mindmap_window_height;
		tool['left'] = _common_windot_left;
		tool['top'] = _common_window_top;
		/*tool['source'] = '<div id="main">';
			tool['source'] += '<div id="jinomap" tabindex="-1" style="outline:none; border: none; position:relative; overflow:hidden; background:#f4f4f4;">';
			tool['source'] += '</div>';
		tool['source'] += '</div>';	// 마인드맵 도구 소스 들어갈 부분*/
		tool['source'] = '<iframe src="../mindmap/start.html" width="' + tool['width'] + '" height="' + tool['height'] + '"></iframe>';	// 포스트잇 도구 소스 들어갈 부분
		break;
	case "vote":
		_tool_vote_count++;
		tool['type'] = 'vote';
		tool['name'] = 'vote' + _tool_vote_count;
		tool['title'] = '투표 ' + _tool_vote_count;
		tool['width'] = vote_window_width;
		tool['height'] = vote_window_height;
		tool['left'] = _common_windot_left;
		tool['top'] = _common_window_top;
		tool['source'] = '';	// 투표 도구 소스 들어갈 부분
		break;
	}
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
	var toolsource = '<div class="toolwindow" id="' + toolname + '" onclick="upToFrontWindow(\'' + toolname + '\')"><div>';
		toolsource += '<div class="title">';
			toolsource += '<div class="title_text">' + tooltitle + '</div>';
			toolsource += '<div class="closewindow" onclick="closeToolWindow(\'' + idx + '\')">닫기</div>';
			toolsource += '<div class="closewindow" onclick="transWindow(\'' + toolname + '\')">투명</div>';
			toolsource += '<div class="clearboth"></div>';
		toolsource += '</div>';
	var toolwidth = _toolWindowList[idx]['width'];
	var toolheight = _toolWindowList[idx]['height'] + titlebarHeight + statusbarHeight;

	$('#' + toolname).css('z-index', _new_z_index);
	_new_z_index++;

	switch (_toolWindowList[idx]['type'])
	{
	case "list":
		toolsource += _toolWindowList[idx]['source'];
		$('#meetingboard').append(toolsource);
	//	$('.' + _toolWindowList[idx]).show();

		newListTool();
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		break;
	case "postit":
		toolsource += _toolWindowList[idx]['source'];
		$('#meetingboard').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		break;
	case "mindmap":
		toolsource += _toolWindowList[idx]['source'];
		$('#meetingboard').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);

//		newMindmapTool();
//		resizeMindmap(toolwidth, toolheight);
		break;
	}
	toolsource += '<div class="statusbar">ㄹㄴㅁㅇㄹㅇㄴ</div></div></div>';

	//$('#' + _toolWindowList[idx]['name']).draggable(); // Jquery-ui 기본 드래그 기능
	$('#' + _toolWindowList[idx]['name']).jqxWindow({
        showCollapseButton: true, maxHeight: 400, maxWidth: 700,
        		minHeight: 200, minWidth: 200, height: 300, width: 500,
        initContent: function () {
        }
    });
                
	$('#' + _toolWindowList[idx]['name']).css('left', toolleft + 'px');
	$('#' + _toolWindowList[idx]['name']).css('top', tooltop + 'px');

	console.log('toolsource : ' + toolsource);
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
			console.log(canvas);
			switch (_drawtool)
			{
				case 'pen':
					break;
				case 'rect':
					var now_point = getMousePoint(event);
					console.log("[Now] x : " + now_point.x + ", y : " + now_point.y);
					var width = now_point.x - prev_point.x;
					var height = now_point.y - prev_point.y;
					GraphicRect('canvasView', prev_point.x, prev_point.y, width, height);
					break;
				case 'ellipse':
					var now_point = getMousePoint(event);
					console.log("[Now] x : " + now_point.x + ", y : " + now_point.y);
					var width = now_point.x - prev_point.x;
					var height = now_point.y - prev_point.y;
					GraphicCircle('canvasView', prev_point.x, prev_point.y, width, height);
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
