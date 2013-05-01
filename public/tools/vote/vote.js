var _voteid = "vote1";
var _votelistnum = 0;

var _socket;
var _tmpLastId = 100;
var _tmpGroup = 0;
var _clientId = 0;

/* 서버로부터 받는 변수들 */
var _question_title = "";
var _is_multi_vote = "";
var _votelist = [];

$(document).ready(function()
{
	// 소켓 오픈
	initSocket();
	
	// 투표 시작 버튼 작동
	$('.btn_votestart').click(function() {
		startVote();
	});
	
	$('btn_votefinish').click(function() {
		finishVote();
	});
	
	// 투표 옵션 추가하기
	$('.underbar .txt_init_votereadylist').click(function() {
		// 새 옵션 3개 추가
		newVoteReadyList();
		newVoteReadyList();
		newVoteReadyList();
		
		// 체크박스 컨테이너 레이아웃 보이게
		$('.underbar .txt_init_votereadylist').hide();
		$('.underbar .container_checkboxes').show(); 
	});
});

/* 투표 리스트에 항목 새로 추가 */
function newVoteReadyList()
{
	var votereadylist = $('.voteReadyList');
	var id_lastlist = "list_" + _voteid + "_" + _votelistnum++;
	var id_thislist = "list_" + _voteid + "_" + _votelistnum;
	var newlist = "<li id=\"";
		 newlist += id_thislist;
		 newlist += "\">";
		 newlist += "<span class=\"plusicon\">+</span> <input type=\"text\" placeholder=\"옵션 추가하기\" />";
		 newlist += "<span id=\"" + "btn_del_" + _voteid + "_" + _votelistnum + "\" class=\"del_votelist\">x</span>";
		 newlist += "</li>";
		
	votereadylist.append(newlist);
	
	var countlist = $(".voteReadyList li").length;
	for (var i = 0; i < countlist; i++)
	{
		$(".voteReadyList li .del_votelist:nth(" + i + ")").click(function() {
			$(".voteReadyList li:nth(" + i + ")").remove();
		});
		
		$(".voteReadyList li input:nth(" + i + ")").unbind('click', _newlist_to_last);
		$(".voteReadyList li input:nth(" + i + ")").unbind('focus', _newlist_to_last);
		
		if (i == countlist - 1)
		{
			$(".voteReadyList li input:nth(" + i + ")").click(_newlist_to_last);
			$(".voteReadyList li input:nth(" + i + ")").focus(_newlist_to_last);
		}
	}
	/*
	$("#btn_del_" + _voteid + "_" + _votelistnum).click(function() {
		var countlist = $(".voteReadyList input").length;
		if (countlist > 1)
			$('#' + id_thislist).remove();
	});
		 
	$("#" + id_lastlist + " input").unbind('click', _newlist_to_last);
	$("#" + id_lastlist + " input").unbind('focus', _newlist_to_last);
	$("#" + id_thislist + " input").click(_newlist_to_last);
	$("#" + id_thislist + " input").focus(_newlist_to_last);*/
}
var _newlist_to_last = function() {
	newVoteReadyList();
};
var _refresh_btn_del_votelist = function() {
	$(".voteReadyList li input:nth(" + i + ")").unbind('click', _newlist_to_last);
		$(".voteReadyList li input:nth(" + i + ")").unbind('focus', _newlist_to_last);
		
		if (i == countlist - 1)
		{
			$(".voteReadyList li input:nth(" + i + ")").click(_newlist_to_last);
			$(".voteReadyList li input:nth(" + i + ")").focus(_newlist_to_last);
		}
};

/* 투표 시작 */
function startVote()
{
	var listcount = $('.voteReadyList input').length; //[1].value == ""
	_question_title = $(".vote_make_container .question_title").val();
	
	console.log("listcount : " + listcount);
	console.log("question_title : " + _question_title);
	
	_votelist = [];	// 투표 항목 목록 초기화
	for (var i = 0; i < listcount; i++)
	{
		var this_title = $('.voteReadyList input')[i].value;
		// 비어 있지 않으면 투표 리스트로 추가
		if (this_title != "")
		{
			var newitem = {};
			newitem["title"] = this_title;
			newitem["vote"] = 0;
			newitem["voterlist"] = [];
			
			_votelist.push(newitem);
		}
	}
	
	sendVoteDataToServer();	// 서버로 투표데이터 전송
	initVoteProcess();
}

/* 소켓 초기화 */
function initSocket()
{
	console.log('Call initSocket()');
	
	_socket = io.connect('http://61.43.139.69:8000/group');
	_tmpGroup = "group1";
	
	_socket.emit('join_room', {group: _tmpGroup});						// 그룹에 join
	_socket.emit('set_data', {group: _tmpGroup, tool: _voteid});		// 서버에 초기 데이터 요청
}

/* 데이터를 서버로 전송함 */
function sendVoteDataToServer()
{
	var sendingData = JSON.stringify(_votelist);						// 투표 항목들
	_is_multi_vote = $('#chk_multi_vote').is(":checked");	// 중복 투표 여부	
		
	_socket.emit('set_option_data', {group:_tmpGroup, tool: _voteid,
													id: 0, option: 'is_multi_vote', val: _is_multi_vote});
	_socket.emit('set_insert_data', {group: _tmpGroup, tool: _voteid,
													id: 'set_vote_process', index: 0, val: sendingData, client: 0});
}

/* 투표 진행 초기화 */
function initVoteProcess(data)
{
	$('.vote_make_container').css('display', 'none');
	$('.vote_processing_container').css('display', 'block');	
	$('.vote_processing_container .question_title').html(_question_title);
	
	var question_list = $('.vote_processing_container .question_list ul');
	question_list.html("");
	for (var i = 0; i < _votelist.length; i++)
	{
		var newitem = "<li>";
			if (_is_multi_vote == true) newitem += "<input type=\"checkbox\" class=\"verticalmiddle\" />";
			else newitem += "<input type=\"radio\" class=\"verticalmiddle\" />";	
			newitem += "<span class=\"item_text\">";
			newitem += _votelist[i].title;
			newitem += "</span>"
			newitem += "</li>";
			 
		question_list.append(newitem);
	}
}

/* 투표 완료 */
function finishVote()
{
	$('.vote_processing_container').css('display', 'none');
	$('.vote_result_container').css('display', 'block');
}


_socket.on('get_client', function (data) {
	_clientId = data.client;
});

_socket.on('get_insert_data', function(data) {
	console.log("get_insert_data : " + data);
	if (data.id == "set_vote_process")
	{
		_votelist = data.val;
		initVoteProcess();
	}
	else if (data.id == "end_vote")
	{
		
	}
});

_socket.on('get_option_data', function(data) {
	if (data.option = "is_multi_vote")
	{
		_is_multi_vote = data.val;
	}
});
