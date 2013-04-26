var _voteid = "vote1";
var _votelistnum = 0;
var _votelist = [];

var _socket;
var _tmpLastId = 100;
var _tmpGroup = 0;
var _clientId = 0;

$(document).ready(function()
{
	// 투표 시작
	$('.btn_votestart').click(function() {
		startVote();
	});
	
	// 투표 옵션 추가하기
	$('.underbar .txt_init_votereadylist').click(function() {
		// 새 옵션 3개 추가
		newVoteReadyList();
		newVoteReadyList();
		newVoteReadyList();
		
		// 누구나 옵션을 추가할 수 있도록 허용 보이게
		$('.underbar .txt_init_votereadylist').hide();
		$('.underbar .container_checkboxes').show(); 
	});
});

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

function startVote()
{
	initSocket();
	
	var listcount = $('.voteReadyList input').length; //[1].value == ""
	var question_title = $(".vote_make_container .question_title").val();
	
	console.log("listcount : " + listcount);
	console.log("question_title : " + question_title);
	
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
	
	///////////////////////////////////////////////////////////////////////////////
	
	var is_addpermit_to_all = $('#chk_addpermit_to_all').is(":checked");		// 누구나 투표 항목 추가 가능
		if(is_addpermit_to_all == true) $('.vote_processing_container .container_add_item').css('display', 'block');
		else $('.vote_processing_container .container_add_item').css('display', 'none');
	var is_multi_vote = $('#chk_multi_vote').is(":checked");						// 중복 투표
	var is_realtime_result = $('#chk_realtime_result').is(":checked");			// 실시간 투표 결과 공유
		if(is_realtime_result == true) $('.vote_processing_container .underbar').css('display', 'none');
		else $('.vote_processing_container .underbar').css('display', 'block');
	
	$('.vote_processing_container .question_title').html(question_title);
	
	var question_list = $('.vote_processing_container .question_list ul');
	question_list.html("");
	for (var i = 0; i < _votelist.length; i++)
	{
		var newitem = "<li>";
			if (is_multi_vote == true) newitem += "<input type=\"checkbox\" class=\"verticalmiddle\" />";
			else newitem += "<input type=\"radio\" class=\"verticalmiddle\" />";	
			newitem += "<span class=\"item_text\">";
			newitem += _votelist[i].title;
			newitem += "</span>"
			newitem += "</li>";
			 
		question_list.append(newitem);
	}
}

function initSocket()
{
	console.log('Call initSocket()');
	
	_socket = io.connect('http://61.43.139.69:8000/group');
	_tmpGroup = "group1";
	
	_socket.emit('join_room', {group: _tmpGroup});					// 그룹에 join
	_socket.emit('set_data', {group: _tmpGroup, tool: _voteid});	// 서버에 초기 데이터 요청
	
	_socket.on('get_client', function (data) {
		_clientId = data.client;
		console.log("_clientId: "+_clientId);
	});
	
	_socket.emit('set_option_data', {group:_tmpGroup, tool: _voteid, id:'123', option: 'testoption', val: 'valval'});
	
	_socket.on('get_option_data', function(data) { console.log(data); console.log("over"); });
}
