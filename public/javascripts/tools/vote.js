var _voteid = "";
var _votelistnum = 0;

var _tmpLastId = 101;
var _group_id = 0;
var _client_id = 0;

/* 서버로부터 받는 변수들 */
var _question_title = "";
var _is_multi_vote = "";
var _votelist = [];
var _is_voting = false;

function initVote(group, tool)
{
	console.log("CALL initVote(" + group + ", " + tool + ")");
	
	_socket_vote = io.connect('http://61.43.139.69:50004/group');

	tool = "vote" + tool;
	group = "group" + group;
	_voteid = tool;
	_group_id = group;
	
	_socket_vote.emit('join_room', {group: _group_id});						// 그룹에 join
	_socket_vote.emit('set_vote_data', {group: _group_id, tool: tool});		// 서버에 초기 데이터 요청
	//_socket_vote.emit('set_client', {group: _group_id, user: 'user1'});
	_socket_vote.emit('set_tree_option_data', {group:_group_id, tool: tool, option: 'is_multi_vote'});
	
	
	// 투표 시작 버튼 작동
	$('.btn_votestart').click(function() {
		_socket_vote.emit('set_last_id', { group: _group_id, tool: tool});	
	});
	
	$('#btn_votefinish').click(function() {
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
}

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
	_is_multi_vote = $('#chk_multi_vote').is(":checked");
	//alert(_is_multi_vote);
	_socket_vote.emit('set_option_data', {group:_group_id, tool: _voteid,
													id: 0, option: 'is_multi_vote', val: _is_multi_vote});

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
			console.log(i+1);
			_socket_vote.emit('set_insert_vote_data', { group: _group_id, tool: _voteid, id: _tmpLastId, parent: i+1, index: 1, val: this_title, client: _client_id } );
		}
	}
	
	initVoteProcess();
}


function addSocketListenerForVote()
{
	/*
	_socket_vote.on('get_client', function (data) {
		_client_id = data.client;
	});
*/

	////  투표 데이터 불러오는 함수  ////
	_socket_vote.on('get_vote_data', function (data) { 
		console.log("get_vote_data");
		var tmpTool = data.tool;
		var tmpId = data.id;
		var tmpParent = data.parent;
		var tmpVal = data.val;
		console.log(tmpId);
		if ( tmpId != 100 )
		{		
			if ( _is_voting == false ) {
				_question_title = data.val;
				$('.vote_make_container').css('display', 'none');
				$('.vote_processing_container').css('display', 'block');	
				$('.vote_processing_container .question_title').html(_question_title);
				var question_list = $('.vote_processing_container .question_list ul');
				question_list.html("");
				_is_voting=true;
			}
			else {
				var question_list = $('.vote_processing_container .question_list ul');
				var newitem = "<li>";
		
				if (_is_multi_vote == "true")							
					newitem += "<input type=\"checkbox\" class=\"verticalmiddle\" />";
				else 
					newitem += "<input type=\"radio\" class=\"verticalmiddle\" />";	
				newitem += "<span class=\"item_text\">";
				newitem += tmpVal;
				newitem += "</span>"
				newitem += "</li>";
					 
				question_list.append(newitem);			
			}		
		}
	});

	////  lastId 얻어오는 함수  ////
	_socket_vote.on('get_last_id', function (data) { 
		//// 투표 도구에서 100번 ID는 버리는 ID ////
		_tmpLastId = data.last;
		$('.question_title').attr('id', _tmpLastId);
		var title_val = $('.question_title').val();
		_socket_vote.emit('set_insert_vote_data', { group: _group_id, tool: _voteid, id: _tmpLastId, parent: '0', index: '0', val: title_val, client: _client_id} );
		startVote();
	});
	
	/*	일단은 주석처리(필요할 수도?)
	_socket.on('get_insert_vote_data', function(data) {
		console.log("get_insert_vote_data : " + data.val);
				
		if ( _is_voting == false ) {
			_question_title = data.val;
			$('.vote_make_container').css('display', 'none');
			$('.vote_processing_container').css('display', 'block');	
			$('.vote_processing_container .question_title').html(_question_title);
			var question_list = $('.vote_processing_container .question_list ul');
			question_list.html("");
			_is_voting=true;
		}
		else {
			var question_list = $('.vote_processing_container .question_list ul');
			var newitem = "<li>";
				if (_is_multi_vote == true) newitem += "<input type=\"checkbox\" class=\"verticalmiddle\" />";
				else newitem += "<input type=\"radio\" class=\"verticalmiddle\" />";	
				newitem += "<span class=\"item_text\">";
				newitem += data.val;
				newitem += "</span>"
				newitem += "</li>";
				 
			question_list.append(newitem);			
		}
				
	});
	*/

	_socket_vote.on('get_tree_option_data', function(data) {
		console.log("get_tree_option_data: "+data.val);
		if (data.option = "is_multi_vote")
		{
			_is_multi_vote = data.val;
		}
	});

	// 투표 결과가 받아짐
	_socket_vote.on('get_voting_data', function(data) {
		console.log("CALL get_voting_data");

		var vote_text = data.text;
		var vote_num = data.num;
		console.log("text: "+vote_text+" // num: "+vote_num);
		$('body').append("<div>val: "+vote_text+" // "+"num: "+vote_num+"</div>");
	});
}

/* 데이터를 서버로 전송함 */
function sendVoteDataToServer()
{
	//  옵션 데이터로 서버에 투표 결과 전송__투표 관리하는 함수 서버측에 새로 작성-> 클라이언트 번호로 투표 여부 확인(투표 완료되면 특정 이벤트 전송)  //
	var $question_list = $('.question_list');
	var $question_item = $question_list.children('ul').children('li:first');

	var vote_result = [];

	while ( $question_item.children('.item_text').length > 0  )
	{
		if ( $question_item.children('input').is(":checked") ) {
			//console.log( $question_item.children('.item_text').text() );	
			var vote_item = $question_item.children('.item_text').text();
			vote_result.push(vote_item);
		}

		$question_item = $question_item.next();				
	}
	
	var str_result = JSON.stringify(vote_result);
	
	console.log("multi: "+_is_multi_vote);
	console.log("lastId: "+_tmpLastId);
	_socket_vote.emit('set_voting_data', {group: _group_id, tool: _voteid,
													id: _tmpLastId, val: str_result, option: _is_multi_vote, user: 'user1'});
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

	sendVoteDataToServer();	// 서버로 투표데이터 전송
}

