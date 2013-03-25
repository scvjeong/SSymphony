var _toolWindowList = new Array();	// 도구창 저장하는 배열
var _tool_list_count = 0;
var _tool_postit_count = 0;
var _tool_mindmap_count = 0;
var _tool_vote_count = 0;
var _common_window_top = 50;
var _common_windot_left = 20;

$(document).ready(function() {
	// 최초에는 오른쪽 패널에 참가자 탭을 보여줌
	setRightpanel("participants");
});

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
		tool['source'] = '<iframe src="../postit/index.html" width="' + tool['width'] + '" height="' + tool['height'] + '"></iframe>';	// 포스트잇 도구 소스 들어갈 부분		
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
	var toolsource = '<div class="toolwindow" id="' + toolname + '"><div>';
		toolsource += '<div class="title">';
			toolsource += '<div class="title_text">' + tooltitle + '</div>';
			toolsource += '<div class="closewindow" onclick="closeToolWindow(\'' + idx + '\')">닫기</div>';
			toolsource += '<div class="clearboth"></div>';
		toolsource += '</div>';
	var toolwidth = _toolWindowList[idx]['width'];
	var toolheight = _toolWindowList[idx]['height'] + titlebarHeight + statusbarHeight;
	
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

	$('#' + _toolWindowList[idx]['name']).draggable();
	$('#' + _toolWindowList[idx]['name']).css('left', toolleft + 'px');
	$('#' + _toolWindowList[idx]['name']).css('top', tooltop + 'px');
	
	console.log('toolsource : ' + toolsource);
}

// 도구창 닫는 함수
function closeToolWindow(idx)
{
	$('#' + _toolWindowList[idx].name).hide();
}


// 팝업창 추가하고 여는 함수
var _popupcount = 0;
function showPopupWindow(content, popuptype)
{
	var nowpopupcount = _popupcount;
	var source = '<div id="popup' + nowpopupcount + '" class="splashpopup">';
		source += '<div class="title"><span class="closepopup" onclick="closePopupWindow(' + nowpopupcount + ')">닫기</span></div>';
		source += '<div class="popupcontent">' + content + '</div>';
		source += '</div>';
	$('#splashpopup_wrapper').prepend(source);
	$('#popup' + nowpopupcount).fadeIn('slow');
	
	setTimeout("closePopupWindow(" + nowpopupcount + ")", 3000);
	_popupcount++;
}
showPopupWindow("회의가 시작되었습니다.");
setTimeout('showPopupWindow("정용기님이 입장하셨습니다.")', 300);
setTimeout('showPopupWindow("김태하님이 입장하셨습니다.")', 4000);
setTimeout('showPopupWindow("임종혁님이 입장하셨습니다.")', 5000);
setTimeout('showPopupWindow("김정호님이 입장하셨습니다.")', 5500);
setTimeout('showPopupWindow("정용기님이 퇴장하셨습니다.")', 12000);
setTimeout('showPopupWindow("고동현님이 입장하셨습니다.")', 20000);
setTimeout('showPopupWindow("올바른 회의 진행을 위해서는 서로를 존중하는 마음을 가져야 합니다.")', 22000);

function closePopupWindow(idx)
{
	$('#popup' + idx).fadeOut('slow');
}

setInterval("showRunTime()", 1000);
var _runTime = 0;
var _totalTime = "30:00:00";	// 회의 전체 시간
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
	
	_runTime++;
}