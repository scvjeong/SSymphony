var _toolWindowList = new Array();	// 도구창 저장하는 배열
var _tool_list_count = 0;
var _tool_postit_count = 0;
var _tool_mindmap_count = 0;
var _tool_vote_count = 0;
var _tool_matrix_count = 0;
var _common_window_top = 50;
var _common_window_left = 20;
var _new_z_index = 0;
//var _drawtool = 'pen';
var _group_id = 1;
var _is_rightpanel_open = true;
var _window_width = 0;
var _window_height = 0;

var _client_id;	// 클라이언트 아이디

var _socket_common;
var _socket_list;
var _socket_postit;
var _socket_mindmap;
var _socket_vote;
var _socket_matrix;

var _is_added_socket_listener_for_list = false;
var _is_added_socket_listener_for_postit = false;
var _is_added_socket_listener_for_mindmap = false;
var _is_added_socket_listener_for_vote = false;
var _is_added_socket_listener_for_matrix = false;

var _notice_bar_idx = 1;

$(document).ready(function() {
	// 크기 조정
	$(window).resize();

	setRightpanel("participants");	// 최초에는 오른쪽 패널에 참가자 탭을 보여줌

	// 소켓 열기
	openSocket();

	// 콘텐트 관리 상자 초기화
	share_box.init();
	/*
	addLinkList("네이버", "http://naver.com");
	addLinkList("다음", "http://daum.net");
	addLinkList("인트라넷 소마", "http://intranet.swmaestro.kr");
	*/
	$('#btn_addlink').click(function() {
		var linktitle = $('#txt_linktitle').val();
		var linkurl = $('#txt_linkurl').val();
		addLinkList(linktitle, linkurl);
	});

	// 화이트보드 초기화
	switchDrawingTool('pen');
	$("[data-toggle='tooltip']").tooltip();

	changeFillColor('#000000');
	changeLineColor('#000000');
	//$("#colorPicker").jqxColorPicker({ color: "ffaabb", colorMode: 'hue', width: 220, height: 200, theme: null });

	$("#white-board #btn_drawtool_pen").tooltip('show');
	//$('#white-board #whiteboard_control_box').draggable();	// 화이트보드 도구 상자 움직이기 가능
	$('#white-board #btn_drawtool_pen').click(function() {
		_drawtool = 'pen';
	});
	$('#white-board #btn_drawtool_rect').click(function() {
		_drawtool = 'rect';
	});
	$('#white-board #btn_drawtool_ellipse').click(function() {
		_drawtool = 'ellipse';
	});

	$('#white-board #btn_text_add').click(function() {
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
            	
            	var fileObject = JSON.stringify(response);
            	console.log("fileObject : " + fileObject);
            	_socket_common.emit('set_option_data', {group:_group_id, option:'new_share_box_item', tool:"0", id:"0", val:fileObject});
            	
            	var newfileitem = "";
            	var filetypeinfo = getFileTypeInfo(response.filetype);
            	var target_list = "";
            	
            	/*
				<li class="item">
					<div class="icon"></div>
					<div class="text">테스트</div>
				</li>
				*/
				switch (filetypeinfo.category)
            	{
            	case "document":
            		target_list = "section_documents";
            		break;
            	case "image":
            		target_list = "section_photos";
            		break;
            	default:
					target_list = "section_others";
            	}
            	newfileitem += "<a href=\"";
            	newfileitem += "/tmp/";
            	newfileitem += response.filename;
            	newfileitem += "\" target=\"_blank\">";
	            	newfileitem += "<li class=\"item\">";
		            	newfileitem += "<div class=\"icon\" style=\"background-image:url('";
		            	newfileitem += filetypeinfo.iconurl;
		            	newfileitem += "')\"></div>";
		            	newfileitem += "<div class=\"text\">";
			            	newfileitem += response.filename;
		            	newfileitem += "</div>";
	            	newfileitem += "</li>";
            	newfileitem += "</a>";
				//$('#file_list').append(newfileitem);
				
				$("#" + target_list + " .list").append(newfileitem);
				console.log("Added : " + "#" + target_list + " .list");
            }
		});

		return false;
    });

	// notice bar
	noticeBarMoving();
	
	// 회의 종료 버튼
	$("#result-btn").click(function(){
		if( confirm("Are you sure?") )
		{
			$.ajax({
				url: '/page/meeting_close',
				type: 'POST',
				dataType: 'json',
				success: function(json) {
					if( json.result == "failed" )
					{
						console.log(json.msg);
					}
					else if( json.result == "successful" )
					{
						showMeetingResultWindow();
					}
				},
				error: function(err) {
					console.log(err);
					return false;
				}
			});			
		}
	});
});

$(window).resize(function() {
	resetSizeInfo();
	resizeWhiteBoardControlBox();
	resizeWhiteBoardCanvas();
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
	
	_socket_common.emit('join_room', {group:_group_id});

	_socket_common.on('get_client', function (data) {
		_client_id = data.client;
		//console.log("client: "+data.client);
	});

	_socket_common.on('get_option_data', function(data) {
		// data.tool/id/option/val
		console.log('GET get_option_data');
		if (data.option === 'new_tool')
		{
			console.log('새 도구 도착 : ' + data)
			switch (data.tool)
			{
			case 'list':
				getToolSource('list', initList);
				break;
			case 'mindmap':
				getToolSource('mindmap', initMindmap);
				break;
			case 'postit':
				getToolSource('postit', initPostit);
				break;
			case 'matrix':
				getToolSource('matrix', initMatrix);
				break;
			case 'vote':
				getToolSource('vote', initVote);
				break;
			}
		}
		else if (data.option === 'new_share_box_item')
		{
			console.log('새 쉐어박스 아이템 도착 : ');
			console.log(data);
			addShareItem(data.val);
		}
		else if (data.option === 'new_canvas_draw')
		{
			console.log("GET_OPTION_DATA new_canvas_draw");
			console.log(data);
			drawArrived(data.tool, data.val);
		}
	});
}


// 쉐어박스 아이템 추가
function addShareItem(response)
{
	console.log("CALL addShareItem [response:" + response + "]");
	console.log("filename:" + response.filename);
	response = JSON.parse(response);
	//testtest = response;
	var newfileitem = "";
	var filetypeinfo = getFileTypeInfo(response.filetype);
	var target_list = "";
	
	switch (filetypeinfo.category)
	{
	case "document":
		target_list = "section_documents";
		break;
	case "image":
		target_list = "section_photos";
		break;
	default:
		target_list = "section_others";
	}
	newfileitem += "<a href=\"";
	newfileitem += "/tmp/";
	newfileitem += response.filename;
	newfileitem += "\" target=\"_blank\">";
    	newfileitem += "<li class=\"item\">";
        	newfileitem += "<div class=\"icon\" style=\"background-image:url('";
        	newfileitem += filetypeinfo.iconurl;
        	newfileitem += "')\"></div>";
        	newfileitem += "<div class=\"text\">";
            	newfileitem += response.filename;
        	newfileitem += "</div>";
    	newfileitem += "</li>";
	newfileitem += "</a>";
	//$('#file_list').append(newfileitem);
	
	$("#" + target_list + " .list").append(newfileitem);
	
	showPopupWindow(response.filename + " is added on Share Box.");
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

function resizeWhiteBoardCanvas()
{
	var width = $(document).width();
	var height = $(document).height() - 52;

	$('#white-board').width(width);
	$('#white-board').height(height);
	$('#cv_whiteboard').attr('width', width);
	$('#cv_whiteboard').attr('height', height);
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

var _is_share_box_open = false;
var share_box = ( function() {
		function _addEventListeners() {
			$('#btn_show_share_box').click(function() {
				if (_is_share_box_open == false)
				{
					$('#window_share_box').jqxWindow('open');
					$('#white-board .navbar .nav #btn_show_share_box').addClass('active');
					_is_share_box_open = true;
				}
				else
				{
					$('#window_share_box').css('display', 'none');
					$('#white-board .navbar .nav #btn_show_share_box').removeClass('active');
					_is_share_box_open = false;
				}
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

					$('#window_share_box .jqx-window-close-button').click(function() {
						_is_share_box_open = false;
						$('#white-board .navbar .nav #btn_show_share_box').removeClass('active');
						console.log("closed");
					});
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
		newlink += "\" target=\"_blank\">";
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


var _tool_type = "";
/* 도구별 소스를 동적으로 가져옴 */
function getToolSource(tool_type, initFuncName, is_broadcaster)
{
	if (is_broadcaster == true)
		_socket_common.emit('set_option_data', {group:_group_id, option:'new_tool', tool:tool_type, id:"0", val:"0"});

	var source_url = "";
	var tool_index = "";
	_tool_type = tool_type;
	
	switch (tool_type)
	{
	case "list":
		tool_index = _tool_list_count;
		if (_is_added_socket_listener_for_list == false)
		{
			addSocketListenerForList();
			_is_added_socket_listener_for_list = true;
		}
		break;
	case "postit":
		tool_index = _tool_postit_count;
		if (_is_added_socket_listener_for_postit == false)
		{
			addSocketListenerForPostit();
			_is_added_socket_listener_for_postit = true;
		}
		break;
	case "mindmap":
		tool_index = _tool_mindmap_count;
		if (_is_added_socket_listener_for_mindmap == false)
		{
			addSocketListenerForMindmap();
			_is_added_socket_listener_for_mindmap = true;
		}
		break;
	case "vote":
		tool_index = _tool_vote_count;
		if (_is_added_socket_listener_for_vote == false)
		{
			addSocketListenerForVote();
			_is_added_socket_listener_for_vote = true;
		}
		break;
	case "matrix":
		tool_index = _tool_matrix_count;
		if (_is_added_socket_listener_for_matrix == false)
		{
			addSocketListenerForMatrix();
			_is_added_socket_listener_for_matrix = true;
		}
		break;
	}
	console.log("Now Creating " + tool_type + tool_index);
	
	source_url = "../tool/" + _tool_type + "/" + _group_id + "/" + tool_index;
	console.log("부른 도구의 Source url :: " + source_url);
	
	$.ajax({
		type: "GET",
		url: source_url,
//		data: {tool_index: tool_index, group_id: _group_id},
		dataType: "html",
		success: function(data) {
			console.log("CALL initFuncName [_group_id:" + _group_id + " / tool_index:" + tool_index + "]");
//			includeFileDynamically(data.include_list);
			addTool(_tool_type, data);
			console.log("tool_index = " + tool_index);
			initFuncName(_group_id, tool_index);
		},
		error: function(err) {
			console.log(err);
			return false;
		}
	});
}

function addTool(type, source)
{
	console.log("CALL addTool [type=" + type + "]");

	var tool = new Array();

	var list_window_width = 600;
	var list_window_height = 400;
	var postit_window_width = 600;
	var postit_window_height = 400;
	var mindmap_window_width = 600;
	var mindmap_window_height = 400;
	var vote_window_width = 500;
	var vote_window_height= 400;
	var matrix_window_width = 500;
	var matrix_window_height= 400;

	console.log('addToolWindow 호출됨, type:' + type);
	switch (type)
	{
	case "list":
		tool['type'] = 'list';
		tool['name'] = 'list' + _tool_list_count;
		tool['title'] = '리스트 ' + _tool_list_count;
		tool['width'] = list_window_width;
		tool['height'] = list_window_height;
		tool['left'] = _common_window_left;
		tool['top'] = _common_window_top;
		tool['variables'] = {
			tmpIndent: 0,	// 현재 들여쓰기 상태
			tmpLastId: 0,	// 마지막 ID 관리
			tmpClient: 0,	//현재 클라이언트 번호
			tmpGroup: 0,	//현재 그룹
			tmpTool: 0,  //현재 도구
			tmpToolSelect: 0,
			clientColor: new Array( "none", "#99FF99", "#CCCC99",
									"#0099FF", "#CCFFCC", "#FFFF66",
									"#FF9999", "#669999", "#9999FF",
									"#00CCCC", "#CC9900"),
			inputFlag: 0
		}; 
		break;
	case "postit":
		tool['type'] = 'postit';
		tool['name'] = 'postit' + _tool_postit_count;
		tool['title'] = '포스트잇 ' + _tool_postit_count;
		tool['width'] = postit_window_width;
		tool['height'] = postit_window_height;
		tool['left'] = _common_window_left;
		tool['top'] = _common_window_top;
		tool['variables'] = {
			tmpLastId: 100,
			tmpGroup: 0,
			tmpTool: 0,
			tmpItemGroup: 0,
			tmpClient: 0,
			tmpToolSelect: 0,
			preSelectGroup: 0
		};
		break;
	case "mindmap":
		tool['type'] = 'mindmap';
		tool['name'] = 'mindmap' + _tool_mindmap_count;
		tool['title'] = '마인드맵 ' + _tool_mindmap_count;
		tool['width'] = mindmap_window_width;
		tool['height'] = mindmap_window_height;
		tool['left'] = _common_window_left;
		tool['top'] = _common_window_top;
		tool['variables'] = {
			moveFlag: 0,
			preX: 0,
			preY: 0,
			dataLinks: [],
			dataNodes: [],
			tmpIndent: 0,	// 현재 들여쓰기 상태 
			tmpLastId: 100,	// 마지막 ID 관리
			tmpClient: 0,	//현재 클라이언트 번호
			tmpGroup: 0,	//현재 그룹
			tmpTool: 0,
			inputFlag: 0	//키입력 감지하기 위한 변수	
		};
		break;
	case "vote":
		tool['type'] = 'vote';
		tool['name'] = 'vote' + _tool_vote_count;
		tool['title'] = '투표 ' + _tool_vote_count;
		tool['width'] = vote_window_width;
		tool['height'] = vote_window_height;
		tool['left'] = _common_window_left;
		tool['top'] = _common_window_top;
		tool['variables'] = {
			
		};
		break;
	case "matrix":
		tool['type'] = 'matrix';
		tool['name'] = 'matrix' + _tool_matrix_count;
		tool['title'] = 'matrix ' + _tool_matrix_count;
		tool['width'] = matrix_window_width;
		tool['height'] = matrix_window_height;
		tool['left'] = _common_window_left;
		tool['top'] = _common_window_top;
		tool['variables'] = {
			tmpClient: 0,	//현재 클라이언트 번호
			tmpGroup: 0,	//현재 그룹
			setupData: {
						row: 0,
						col: 0
						}, // matrix 행, 열
			setupFlag: {
						data_init: true,
						row: false,
						col: false
						},
			optionId: {
						set: 999999,
						row: 999998,
						col: 999997
						},
			_key_code: null, // 키 입력 값 저장
			_box_count: 0,
			inputFlag: 0	//키입력 감지하기 위한 변수
		};
		break;
	}
	tool['source'] = source;
	
	_common_window_left += 100;
	_common_window_top += 100;

	_toolWindowList.push(tool);
	showToolWindow(_toolWindowList.length - 1);
	
	console.log('AFTER _socket_common.emit-set_option_data : ' + type);
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
	var toolsource = '<div class="toolwindow" id="' + toolname + '" onclick="upToFrontWindow(\'' + toolname + '\')">';
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
    
	switch (_toolWindowList[idx]['type'])
	{

	case "list":
		$('#white-board').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		_tool_list_count++;
		break;
	case "postit":
		$('#white-board').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		_tool_postit_count++;
		break;
	case "mindmap":
		$('#white-board').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		_tool_mindmap_count++;
		break;
	case "vote":
		$('#white-board').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		_tool_vote_count++;
		break;
	case "matrix":
		$('#white-board').append(toolsource);
		$('#' + toolname).css('width', toolwidth);
		$('#' + toolname).css('height', toolheight);
		_tool_matrix_count++;
		break;
	}

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
			$('#window_share_box').jqxWindow('focus');
		}
    });

	$('#' + _toolWindowList[idx]['name']).css('left', toolleft + 'px');
	$('#' + _toolWindowList[idx]['name']).css('top', tooltop + 'px');
	
	$('#' + toolname).on('mouseenter', function() {
		switchToolVariables(toolname);
	});
	
	switchToolVariables(toolname);
}

var _now_toolname = "";
var _pre_toolname = "";
function switchToolVariables(toolname)
{
	if (toolname == _now_toolname)
		return;

	_pre_toolname = _now_toolname;
	_now_toolname = toolname;
	
	var pre_tool_idx = 0;
	var now_tool_idx = 0;
	for (var i = 0; i < _toolWindowList.length; i++)
	{
		if (_toolWindowList[i]['name'] == _pre_toolname)
		{
			pre_tool_idx = i;
		}
		
		if (_toolWindowList[i]['name'] == _now_toolname)
		{
			now_tool_idx = i;
		}
	}
	
	
	// 기존 변수 저장하기 
	if (_pre_toolname.substr(0,4) == "list")
	{
		_toolWindowList[pre_tool_idx]['variables'].tmpIndent = tmpIndent;
		_toolWindowList[pre_tool_idx]['variables'].tmpLastId = tmpLastId; // 마지막 ID 관리
		_toolWindowList[pre_tool_idx]['variables'].tmpClient = tmpClient;	//현재 클라이언트 번호
		_toolWindowList[pre_tool_idx]['variables'].tmpGroup = tmpGroup;	//현재 그룹
		_toolWindowList[pre_tool_idx]['variables'].tmpTool = tmpTool;  //현재 도구
		_toolWindowList[pre_tool_idx]['variables'].tmpToolSelect = tmpToolSelect;
		_toolWindowList[pre_tool_idx]['variables'].inputFlag = inputFlag;	//키입력 감지하기 위한 변수
	}
	else if (_pre_toolname.substr(0,6) == "postit")
	{ 
		_toolWindowList[pre_tool_idx]['variables'].tmpLastId = tmpLastId;
		_toolWindowList[pre_tool_idx]['variables'].tmpGroup = tmpGroup;
		_toolWindowList[pre_tool_idx]['variables'].tmpTool = tmpTool;
		_toolWindowList[pre_tool_idx]['variables'].tmpItemGroup = tmpItemGroup;
		_toolWindowList[pre_tool_idx]['variables'].tmpClient = tmpClient;
		_toolWindowList[pre_tool_idx]['variables'].tmpToolSelect = tmpToolSelect;
		_toolWindowList[pre_tool_idx]['variables'].preSelectGroup = preSelectGroup;
	}
	else if (_pre_toolname.substr(0,7) == "mindmap")
	{
		_toolWindowList[pre_tool_idx]['variables'].moveFlag = moveFlag;
		_toolWindowList[pre_tool_idx]['variables'].preX = preX;
		_toolWindowList[pre_tool_idx]['variables'].preY = preY;
		_toolWindowList[pre_tool_idx]['variables'].dataLinks = dataLinks;
		_toolWindowList[pre_tool_idx]['variables'].dataNodes = dataNodes;
		_toolWindowList[pre_tool_idx]['variables'].tmpIndent = tmpIndent;
		_toolWindowList[pre_tool_idx]['variables'].tmpLastId = tmpLastId;
		_toolWindowList[pre_tool_idx]['variables'].tmpClient = tmpClient;
		_toolWindowList[pre_tool_idx]['variables'].tmpGroup = tmpGroup;
		_toolWindowList[pre_tool_idx]['variables'].tmpTool = tmpTool;
		_toolWindowList[pre_tool_idx]['variables'].inputFlag = inputFlag;
	}
	else if (_pre_toolname.substr(0,4) == "vote")
	{
		
	}
	else if (_pre_toolname.substr(0,6) == "matrix")
	{
		_toolWindowList[pre_tool_idx]['variables'].tmpClient = tmpClient;
		_toolWindowList[pre_tool_idx]['variables'].tmpGroup = tmpGroup;

		_toolWindowList[pre_tool_idx]['variables'].setupData = setupData;
		_toolWindowList[pre_tool_idx]['variables'].setupFlag = setupFlag;
		_toolWindowList[pre_tool_idx]['variables'].optionId = optionId;
		_toolWindowList[pre_tool_idx]['variables']._key_code = _key_code;
		_toolWindowList[pre_tool_idx]['variables']._box_count = _box_count;
		_toolWindowList[pre_tool_idx]['variables'].inputFlag = inputFlag;
	}
	
	// 사용할 변수 불러오기
	if (_now_toolname.substr(0,4) == "list")
	{
		tmpIndent = _toolWindowList[now_tool_idx]['variables'].tmpIndent;
		tmpLastId = _toolWindowList[now_tool_idx]['variables'].tmpLastId; // 마지막 ID 관리
		tmpClient = _toolWindowList[now_tool_idx]['variables'].tmpClient;	//현재 클라이언트 번호
		tmpGroup = _toolWindowList[now_tool_idx]['variables'].tmpGroup;	//현재 그룹
		tmpTool = _toolWindowList[now_tool_idx]['variables'].tmpTool;  //현재 도구
		tmpToolSelect = _toolWindowList[now_tool_idx]['variables'].tmpToolSelect;
		inputFlag = _toolWindowList[now_tool_idx]['variables'].inputFlag;	//키입력 감지하기 위한 변수
	}
	else if (_now_toolname.substr(0,6) == "postit")
	{
		tmpLastId = _toolWindowList[now_tool_idx]['variables'].tmpLastId;
		tmpGroup = _toolWindowList[now_tool_idx]['variables'].tmpGroup;
		tmpTool = _toolWindowList[now_tool_idx]['variables'].tmpTool;
		tmpItemGroup = _toolWindowList[now_tool_idx]['variables'].tmpItemGroup;
		tmpClient = _toolWindowList[now_tool_idx]['variables'].tmpClient;
		tmpToolSelect = _toolWindowList[now_tool_idx]['variables'].tmpToolSelect;
		preSelectGroup = _toolWindowList[now_tool_idx]['variables'].preSelectGroup;
	}
	else if (_now_toolname.substr(0,7) == "mindmap")
	{
		moveFlag = _toolWindowList[now_tool_idx]['variables'].moveFlag;
		preX = _toolWindowList[now_tool_idx]['variables'].preX;
		preY = _toolWindowList[now_tool_idx]['variables'].preY;
		dataLinks = _toolWindowList[now_tool_idx]['variables'].dataLinks;
		dataNodes = _toolWindowList[now_tool_idx]['variables'].dataNodes;
		tmpIndent = _toolWindowList[now_tool_idx]['variables'].tmpIndent;
		tmpLastId = _toolWindowList[now_tool_idx]['variables'].tmpLastId;
		tmpClient = _toolWindowList[now_tool_idx]['variables'].tmpClient;
		tmpGroup = _toolWindowList[now_tool_idx]['variables'].tmpGroup;
		tmpTool = _toolWindowList[now_tool_idx]['variables'].tmpTool;
		inputFlag = _toolWindowList[now_tool_idx]['variables'].inputFlag;
	}
	else if (_now_toolname.substr(0,4) == "vote")
	{
		
	}
	else if (_now_toolname.substr(0,6) == "matrix")
	{
		tmpClient = _toolWindowList[now_tool_idx]['variables'].tmpClient;
		tmpGroup = _toolWindowList[now_tool_idx]['variables'].tmpGroup;

		setupData = _toolWindowList[now_tool_idx]['variables'].setupData;
		setupFlag = _toolWindowList[now_tool_idx]['variables'].setupFlag;
		optionId = _toolWindowList[now_tool_idx]['variables'].optionId;
		_key_code = _toolWindowList[now_tool_idx]['variables']._key_code;
		_box_count = _toolWindowList[now_tool_idx]['variables']._box_count;
		inputFlag = _toolWindowList[now_tool_idx]['variables'].inputFlag;	
	}
	
	console.log("CALL switchToolVariables [_pre_toolname : " + _pre_toolname 
									+ " /  _now_toolname : " + _now_toolname
									+ " / tmpToolSelect : ");
									console.log(tmpToolSelect);
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

<!--setInterval("showRunTime()", 1000);
var _runTime = 1000;
var _totalTime = "00:50:00";	// 회의 전체 시간-->

var _alarmList = new Array();
function showRunTime()
{
	var hour = parseInt(_runTime / 60 / 60);
	var minute = parseInt((_runTime / 60) % 60);
	var second = parseInt(_runTime % 60);
	var tHour, tMinute, tSecond;

	if (hour < 10)	tHour = "0" + hour;
	else	tHour = hour;

	if (minute < 10)	tMinute = "0" + minute;
	else	tMinute = minute;

	if (second < 10)	tSecond = "0" + second;
	else	tSecond = second;

	var nowRunTime = tHour + ":" + tMinute + ":" + tSecond;

	$('.meeting .time').html(nowRunTime + " / " + _totalTime);

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
	var source_url = "/page/meeting_evaluation";
	$.ajax({
		type: "GET",
		url: source_url,
		dataType: "html",
		success: function(data) {
			dialog = bootbox.dialog(data);
	
			var bootbox_select = $('.bootbox');
			bootbox_select.addClass("meeting_evaluate_bootbox");
			
			
		//	var meeting_val = $("#meeting_val").text();
		//	var ft_val = $("#proceeding_val").text();

			$("#eval_input_meeting_rating_val").jqxRating({ width: 100, height: 60, theme: 'classic', disabled: true, value: "0" });
			$("#eval_input_ft_rating_val").jqxRating({ width: 100, height: 60, theme: 'classic', disabled: true, value: "0" });
	
			$('#eval_input_meeting_rating_val').bind('change', function (event) { 
				$('#meeting_val').val(event.value);
				//console.log($('#meeting_val').val());
			}); 
			$('#eval_input_ft_rating_val').bind('change', function (event) { 
				$('#ft_val').val(event.value);
				//console.log($('#ft_val').val());
			}); 	
		},
		error: function(err) {
			console.log(err);
			return false;
		}
	});	

}

function hideMeetingResultWindow()
{
	var bootbox_select = $('.meeting_result_bootbox');
	bootbox_select.modal('hide');
}


function hideEvaluateWindow()
{
	var bootbox_select = $('.meeting_evaluate_bootbox');
	bootbox_select.modal('hide');
	showMeetingResultWindow();
}

function makeCanvasImg(params)
{
	var tool_name = params['tool_name'];
	var tool_idx = params['tool_idx'];
	
	var send_params = [];

	// set_meeting_save_options
// params['idx_meeting']
// params['idx_group']
// params['idx_tool']
// params['idx_process']
// params['tool_num']
// params['image_value']

	switch ( tool_name ) {
		case 'list' : send_params['idx_tool'] = 1; break;
		case 'postit' : send_params['idx_tool'] = 2; break;
		case 'mindmap' : send_params['idx_tool'] = 3; break;
		case 'vote' : send_params['idx_tool'] = 4; break;
		case 'matrix' : send_params['idx_tool'] = 5; break;	
	}
	send_params['idx_process'] = '0';
	send_params['tool_num'] = tool_idx;
	

	html2canvas( [ document.getElementById(tool_name) ], {
          onrendered: function(canvas) {
			//$('.container').prepend(canvas);

			//$('canvas:first').attr('id', 'myCanvas');
			//var can =document.getElementById("myCanvas");
			
			var canvas_image = canvas.toDataURL();
		
			console.log(canvas_image);
			
			send_params['image_value'] = canvas_image;
			
			//var image = new Image();
			//image.src = canvas_image;
			//var ctx = can.getContext("2d");
			//ctx.drawImage(image,10,10,250,200);
			console.log("Params: "+params);

			$.ajax( {
				type: 'POST',
				asyn: true,
				url: '/page/save_tools_image',
				data: send_params,
				dataType: 'json',
				success: function(json_data) {


				}
			});

			
		  }
	});
	
}

function setupWordChart()
{
	var d1 = [[20,20,10], [40,50,20], [70,10,5], [80,80,7]];
	var d2 = [[60,25,15], [70,40,6], [30,80,4]];
	var d3 = [[30,25,15], [24,40,6], [30,43,4]];
	var d4 = [[20,23,10], [43,24,20], [23,65,5], [60,80,4]];
	var options = { 
		series:{bubbles:{active:true,show:true,linewidth:2},editMode:'xy'},
		grid:{hoverable:true,clickable:true,editable:true }
	};
	$.plot( $("#placeholder") , [d1,d2,d3,d4], options );
}

function setupUserListChart()
{
	if ($(".bar-chart").length) {
		var data1 = [];
		for (var i = 0; i <= 4; i += 1)
			data1.push([i, parseInt(Math.random() * 100)]);

		var data2 = [];
		for (var i = 0; i <= 4; i += 1)
			data2.push([i, parseInt(Math.random() * 100)]);

		var data3 = [];
		for (var i = 0; i <= 4; i += 1)
			data3.push([i, parseInt(Math.random() * 100)]);

		var ds = new Array();

		ds.push({
			data : data1,
			bars : {
				show : true,
				barWidth : 0.2,
				order : 1,
			}
		});
		ds.push({
			data : data2,
			bars : {
				show : true,
				barWidth : 0.2,
				order : 2
			}
		});
		ds.push({
			data : data3,
			bars : {
				show : true,
				barWidth : 0.2,
				order : 3
			}
		});
		//Display graph
		$.plot($(".bar-chart"), ds, {
			colors : [$chrt_second, $chrt_fourth, "#666", "#BBB"],
			grid : {
				show : true,
				hoverable : true,
				clickable : true,
				tickColor : $chrt_border_color,
				borderWidth : 0,
				borderColor : $chrt_border_color,
			},
			legend : true,
			tooltip : true,
			tooltipOpts : {
				content : "<b>%x</b> = <span>%y</span>",
				defaultTheme : false
			}
		});
	}
}


var _drawing_tool = "pen";
var _fill_color = "#000000";
var _line_color = "#000000";
var _line_width = "1";
var _font_family = "serif";
var _font_size = 10;
var _canvas = $('#cv_whiteboard');
var _canvas_context = document.getElementById('cv_whiteboard').getContext('2d');
var _is_mousedown = false;

var _now_position = {x:0, y:0};
var _pre_position = {x:0, y:0};

var _pen_data = {points:[], line_width:1, line_color:"#000000"};
var _drawtextbox = $('#drawtext_container #inputbox');

_canvas.mousedown(function(e) {
	//console.log("mousedown");
	_is_mousedown = true;

	_now_position.x = e.offsetX;
	_now_position.y = e.offsetY;

	switch(_drawing_tool)
	{
	case "pen":
		_pen_data.points = [];	// 펜 데이터 초기화
		_canvas_context.beginPath();
		_canvas_context.moveTo(_now_position.x, _now_position.y);
		_pen_data.points.push({x: _now_position.x, y: _now_position.y});
		break;
	case "rect":
		_pre_position.x = e.offsetX;
		_pre_position.y = e.offsetY;
		break;
	case "ellipse":
		_pre_position.x = e.offsetX;
		_pre_position.y = e.offsetY;
		break;
	case "text":
		console.log(e);

		$('#drawtext_container').css({
			'display': 'block',
			'left': e.clientX + 'px',
			'top': (e.clientY - 15) + 'px'
		});
		_drawtextbox.css({
			'color': _fill_color,
			'font-family': _font_family,
			'font-size': _font_size + 'pt'
		});
		_drawtextbox.val('');
		_drawtextbox.focus();
		
		break;
	}
});
_canvas.mousemove(function(e) {
	//console.log("mousemove");

	if (_is_mousedown == true)
	{
		switch (_drawing_tool)
		{
		case "pen":
			//_pre_position = _now_position;
			_now_position.x = e.offsetX;
			_now_position.y = e.offsetY;

			_canvas_context.lineTo(_now_position.x, _now_position.y);
			_pen_data.points.push({x: _now_position.x, y: _now_position.y});
			_canvas_context.strokeStyle = _line_color;
			_canvas_context.lineWidth = _line_width;
			_canvas_context.stroke();
			break;
		}
	}
});
_canvas.mouseup(function(e) {
	//console.log("mouseup");
	_is_mousedown = false;

	switch(_drawing_tool)
	{
	case "pen":
		// 동기화 데이터 전송
		_pen_data.line_width = _line_width;
		_pen_data.line_color = _line_color;
		_socket_common.emit('set_option_data',
			{
				group:_group_id,
				option:'new_canvas_draw',
				tool:'pen',
				id:"0",
				val:_pen_data
			});
		_pen_data.points = [];	// 다음 사용을 위해 펜 데이터 초기화
		break;
	case "rect":
		var rect_data = {};

		_now_position.x = e.offsetX;
		_now_position.y = e.offsetY;

		var width = _now_position.x - _pre_position.x;
		var height = _now_position.y - _pre_position.y;

		_canvas_context.beginPath();
		_canvas_context.rect(_pre_position.x, _pre_position.y, width, height);
		_canvas_context.fillStyle = _fill_color;
		_canvas_context.fill();
		_canvas_context.strokeStyle = _line_color;
		_canvas_context.lineWidth = _line_width;
		_canvas_context.stroke();


		// 동기화 데이터 전송
		rect_data.x = _pre_position.x;
		rect_data.y = _pre_position.y;
		rect_data.width = width;
		rect_data.height = height;
		rect_data.fill_color = _fill_color;
		rect_data.line_color = _line_color;
		rect_data.line_width = _line_width;

		_socket_common.emit('set_option_data',
			{
				group:_group_id,
				option:'new_canvas_draw',
				tool:'rect',
				id:"0",
				val:rect_data
			});
		break;
	case "ellipse":
		var ellipse_data = {};

		_now_position.x = e.offsetX;
		_now_position.y = e.offsetY;

		var width = _now_position.x - _pre_position.x;
		var height = _now_position.y - _pre_position.y;
		var radius;

		_canvas_context.beginPath();
		if (width <= height)
		{
			radius = width / 2;
			_canvas_context.arc(_pre_position.x + radius, _pre_position.y + radius, radius, 0, 2 * Math.PI);
		}
		else
		{
			radius = height / 2;
			_canvas_context.arc(_pre_position.x + radius, _pre_position.y + radius, radius, 0, 2 * Math.PI);
		}

		_canvas_context.fillStyle = _fill_color;
		_canvas_context.fill();
		_canvas_context.strokeStyle = _line_color;
		_canvas_context.lineWidth = _line_width;
		_canvas_context.stroke();

		// 동기화 데이터 전송
		ellipse_data.x = _pre_position.x;
		ellipse_data.y = _pre_position.y;
		ellipse_data.radius = radius;
		ellipse_data.fill_color = _fill_color;
		ellipse_data.line_color = _line_color;
		ellipse_data.line_width = _line_width;

		_socket_common.emit('set_option_data',
			{
				group:_group_id,
				option:'new_canvas_draw',
				tool:'ellipse',
				id:"0",
				val:ellipse_data
			});
		break;
	}
});


// 도착한 도구 그리기
function drawArrived(tool, val)
{
	switch(tool)
	{
	case "pen":
		_canvas_context.beginPath();
		_canvas_context.moveTo(val.points[0].x, val.points[0].y);

		for (var i = 1; i < val.points.length; i++)
		{
			_canvas_context.lineTo(val.points[i].x, val.points[i].y);
			_canvas_context.strokeStyle = val.line_color;
			_canvas_context.lineWidth = val.line_width;
			_canvas_context.stroke();
		}
		break;
	case "rect":
		_canvas_context.beginPath();
		_canvas_context.rect(val.x, val.y, val.width, val.height);
		_canvas_context.fillStyle = val.fill_color;
		_canvas_context.fill();
		_canvas_context.strokeStyle = val.line_color;
		_canvas_context.lineWidth = val.line_width;
		_canvas_context.stroke();
		break;
	case "ellipse":
		_canvas_context.beginPath();
		_canvas_context.arc(val.x + val.radius, val.y + val.radius, val.radius, 0, 2 * Math.PI);
		_canvas_context.fillStyle = val.fill_color;
		_canvas_context.fill();
		_canvas_context.strokeStyle = val.line_color;
		_canvas_context.lineWidth = val.line_width;
		_canvas_context.stroke();
		break;
	case "text":
		break;
	}
}


// 선 색상 변경
function changeLineColor(color)
{
	_line_color = color;
	$('#linecolor_preview').css('background-color', color);
}

// 선 두께 변경
function changeLineWidth(width)
{
	_line_width = width;
	$('#linewidth_preview').css('height', width + 'px');
	$('#linewidth_text_preview').html(width + 'px');
}

// 채우기 색상 변경
function changeFillColor(color)
{
	_fill_color = color;
	$('#fillcolor_preview').css('background-color', color);
}

// 글꼴 변경
function changeFontFamily(font)
{
	_font_family = font;
	$('#fontfamily_preview').css('font-family', font);
	$('#fontfamily_preview').html(font);
}

function changeFontSize(size)
{
	_font_size = size;
	$('#fontsize_preview').html(size + 'pt');
}

// 도구 선택
function switchDrawingTool(tool)
{
	_drawing_tool = tool;

	$('#white-board .navbar .nav #btn_drawtool_pen').removeClass('active');
	$('#white-board .navbar .nav #btn_drawtool_rect').removeClass('active');
	$('#white-board .navbar .nav #btn_drawtool_ellipse').removeClass('active');
	$('#white-board .navbar .nav #btn_drawtool_text').removeClass('active');

	$('#white-board .navbar .nav #btn_drawtool_' + _drawing_tool).addClass('active');

	if (tool == 'text')
		$('#cv_whiteboard').css('cursor', 'text');
	else
		$('#cv_whiteboard').css('cursor', 'crosshair');
}


/*
function changePenColor(color)
{
	_pen_color = color;
}


var _pen_color = "#000000";
var _fill_color = "#000000";
var sendingData = "";

if(window.addEventListener) {
	var dBoard;

	function init()
	{
		var canvas = document.getElementById("canvasView");

		if(!canvas)
		{
			alert('캔버스 이상함');
			return;
		}

		if(!canvas.getContext){
			alert("canvas.getContext 이상함");
			return;
		}

		dBoard = new DrawBoard(canvas);
		dBoard.initBoard();
	}

	window.addEventListener("load", init, false );



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
	
					sendingData = {
				         id: _client_id,
				         action: 'pen',
				         undo: false,
				         lineWidth: 1,
				         color: _pen_color,
				         data: [{x: point.x, y: point.y}]
				        };
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

		// pen에 draw요청
		function onMouseMove_Canvas( event ){
			switch (_drawtool)
			{
				case 'pen':
					var point = getMousePoint( event );
					pen.draw(point);
					
					sendingData.data.push({x: point.x, y: point.y}); 
					break;
				case 'ellipse':

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
					sendingData.data.push({x: now_point.x, y: now_point.y});
					_socket_common.emit('set_option_data', {group:_group_id, option:'new_canvas_draw', tool:'pen', id:"0", val:sendingData});
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
	var drawtext_container = $('#white-board #drawtext_container');
	var inputbox = $('#white-board #drawtext_container #inputbox');
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


function drawArrivedPen(data)
{
	var canvas = document.getElementById(objBoard);
	var canvas_context = canvas.getContext("2d");
	canvas.draw(data);
}*/


function noticeBarMoving()
{
	var $notice_bar = $(".notice-bar ul");
	var $notice_bar_li = $("li.list", $notice_bar).length;

	if( ($notice_bar_li+1) === _notice_bar_idx )
	{
		$notice_bar.css({ top:"0px" });
		console.log($notice_bar.css('top'));
		_notice_bar_idx = 1;
	}
	var top_px = _notice_bar_idx*20;
	_notice_bar_idx++;
	$notice_bar.animate({ top:"-"+top_px+"px" }, 1500, function(){
		noticeBarMoving();
	});
}