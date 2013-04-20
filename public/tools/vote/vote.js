var _voteid = "vote1";
var _votelistnum = 0;
var _votelist = [];

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
	
	$("#btn_del_" + _voteid + "_" + _votelistnum).click(function() {
		var countlist = $(".voteReadyList input").length;
		if (countlist > 1)
			$('#' + id_thislist).remove();
	});
		 
	$("#" + id_lastlist + " input").unbind('click', _newlist_to_last);
	$("#" + id_lastlist + " input").unbind('focus', _newlist_to_last);
	$("#" + id_thislist + " input").click(_newlist_to_last);
	$("#" + id_thislist + " input").focus(_newlist_to_last);
}
var _newlist_to_last = function() {
	newVoteReadyList();
};

function startVote()
{
	var listcount = $('.voteReadyList input').length; //[1].value == ""
	var question_title = $(".vote_make_container .question_title").val();
	
	console.log("listcount : " + listcount);
	console.log("question_title : " + question_title);
	
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
	
	var is_addpermit_to_all = $('#chk_addpermit_to_all').is(":checked");
	var is_multi_vote = $('#chk_multi_vote').is(":checked");
	var is_realtime_result = $('#chk_realtime_result').is(":checked");
	
	$('.vote_processing_container .question_title span').html(question_title);
	
	var question_list = $('.vote_processing_container .question_list ul');
	question_list.html("");
	for (var i = 0; i < _votelist.length; i++)
	{
		var newitem = "<li>";
		
			if (is_multi_vote == true)
				newitem += "<input type=\"checkbox\" />";
			else
				newitem += "<input type=\"radio\" />";
		
			 newitem += _votelist[i].title;
			 newitem += "</li>";
			 
		question_list.append(newitem);
	}
}
