var _toolWindowList = new Array();	// 도구창 저장하는 배열
var _tool_list_count = 0;
var _tool_postit_count = 0;
var _tool_mindmap_count = 0;
var _tool_vote_count = 0;

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
	
	var list_window_width = 500;
	var list_window_height = 400;
	var postit_window_width = 600;
	var postit_window_height = 600;
	var mindmap_window_width = 600;
	var mindmap_window_height = 600;
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
		tool['left'] = 20;
		tool['top'] = 20;
		tool['source'] = '';	// 리스트 도구 소스 들어갈 부분
		break;
	case "postit":
		_tool_postit_count++;
		tool['type'] = 'list';
		tool['name'] = 'postit' + _tool_postit_count;
		tool['title'] = '포스트잇 ' + _tool_postit_count;
		tool['width'] = postit_window_width;
		tool['height'] = postit_window_height;
		tool['left'] = 20;
		tool['top'] = 20;
		tool['source'] = '';	// 포스트잇 도구 소스 들어갈 부분
		break;
	case "mindmap":
		_tool_mindmap_count++;
		tool['type'] = 'mindmap';
		tool['name'] = 'mindmap' + _tool_mindmap_count;
		tool['title'] = '마인드맵 ' + _tool_mindmap_count;
		tool['width'] = mindmap_window_width;
		tool['height'] = mindmap_window_height;
		tool['left'] = 20;
		tool['top'] = 20;
		tool['source'] = '';	// 마인드맵 도구 소스 들어갈 부분
		break;
	case "vote":
		_tool_vote_count++;
		tool['type'] = 'vote';
		tool['name'] = 'vote' + _tool_vote_count;
		tool['title'] = '투표 ' + _tool_vote_count;
		tool['width'] = vote_window_width;
		tool['height'] = vote_window_height;
		tool['left'] = 20;
		tool['top'] = 20;
		tool['source'] = '';	// 투표 도구 소스 들어갈 부분
		break;
	}
	
	_toolWindowList.push(tool);
	showToolWindow(_toolWindowList.length - 1);
}

// 도구창 보여주는 함수
function showToolWindow(idx)
{
	$('.' + _toolWindowList[idx]).show();
}

// 도구창 닫는 함수
function closeToolWindow(idx)
{
	$('.' + _toolWindowList[idx]).hide();
}