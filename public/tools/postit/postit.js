<script type="text/JavaScript" src="/tools/postit/lib/jquery.ui.touch-punch.min.js"></script>
<script type="text/JavaScript" src="/tools/postit/lib/jquery.shapeshift.js"></script>	
<script>

var socket = io.connect('http://61.43.139.69:8000/group');	// socket.io 서버에 접속
		var tmpLastId = 100;	
		var tmpGroup = 0;
		$(document).ready(function() {
			tmpGroup = "group1";
			
			////  그룹에 join하는 함수  ////
			socket.emit('join_room', { group: tmpGroup });

			////  서버에 초기 데이터 요청하는 함수  ////
			socket.emit('set_data', { group: tmpGroup, tool: 'postit1' });

			socket.on('get_client', function (data) {
				console.log("client: "+data.client);
			});
			
			////  ADD 버튼 클릭 이벤트 등록 - 데이터 전송  ////
			$('.container').delegate('.add_button', 'click', function() {
				var tmpSelect = $(this).parent().parent();
		
				var addId = tmpSelect.attr('taskid');
				var addVal = tmpSelect.children('textarea').val();	
				var addIndex = $('.object').index(tmpSelect);	 // 현재 Index 구함
				////  추가된 데이터 서버에 전달  ////
				socket.emit('set_insert_data', { group: tmpGroup, tool: 'postit1', id: addId, index: addIndex, val: addVal });
				
			});

			////  X 버튼 클릭 이벤트 등록 - 포스트잇 삭제  ////
			$('.container').delegate('.del_button', 'click', function() {
				var tmpSelect = $(this).parent().parent();
				var delId = tmpSelect.attr('taskid');
			
				////  삭제한 포스트잇 ID 서버에 전달  ////
				socket.emit('set_delete_data', { group: tmpGroup, tool: 'postit1', id: delId });
				tmpSelect.remove();
			});
			
			////  입력창에서 포커스 잃었을 때 이벤트 등록  ////
			$('.container').delegate('.input_area', 'blur', function() {
				//데이터 전달하는 부분 작성
			});
  
		});

		////  포스트잇 추가하는 함수 - valId: 추가할 ID, valData: 추가할 데이터  ////
		function renderChildren(valId, valData) {
			
			//현재 ID 존재하는지 검사
			var tmpIdClass = $('[taskid='+valId+']');
			if ( tmpIdClass.length > 0 )
			{
				tmpIdClass.children('textarea').val(valData);
				console.log(tmpIdClass);
			}
			else {
				var $containers = $(".container");
				$containers.each(function(container_i) {
					var $element = $("<div class='object task' taskid="+valId+"></div>"),
							height = 160,
							width = $containers.children().first().width();
					$element.css({ background: "#FFFFCC", height: height });		
					$containers.append($element);		
						
					var tmpPostit = $('[taskid='+valId+']');
					var $titleArea = $("<div class='title_area'><div class='add_button'>ADD</div><div class='del_button'>X</div><div>");
					tmpPostit.append($titleArea);
					var $inputArea = $("<textarea class='input_area'  onClick='mouseFocus()'>"+valData+"</textarea>"); 
					tmpPostit.append($inputArea);
				});

				$containers.shapeshift({
					paddingY: 20
				  });
				  
				  // ----------------------------------------------------------------------
				  // - Drag and Drop events for shapeshift
				  // ----------------------------------------------------------------------

				  $containers.on("ss-event-dropped", function(e, selected) {
					//드롭 이벤트에 따라 위치 변경 클라이언트에 전달
					var $selected = $(selected)
					 //console.log("The dropped item is:", $selected)

					// Get the index position of each object
					$objects = $(this).children();
					$objects.each(function(i) {
					  //console.log("Get the index position:", i)
					  //console.log("Get the current element:", $(this))
					});
				  });

				  $containers.on("ss-event-dragged", function(e, selected) {
					var $selected = $(selected);
					 //console.log("This is the item being dragged:", $selected);
				  });
			}
		}
		
		////  서버에서 lastID 받는 함수  ////
		socket.on('get_last_id', function (data) {
			var tmpTool = data.tool; 
			tmpLastId = data.last;
			renderChildren(tmpLastId, "");
		});

		////  서버에서 데이터 받는 함수  ////
		socket.on('get_data', function (data) {

			var tmpTool = data.tool;
			tmpLastId = data.id;
			var tmpVal = data.val;			
			renderChildren(tmpLastId, tmpVal);
		});
		
		////  서버에서 추가된 데이터 받는 함수  ////
		socket.on('get_insert_data', function (data) {
			console.log("get_data");
			var tmpTool = data.tool;
			var tmpId = data.id;
			var tmpIndex = data.index;
			var tmpVal = data.val;
			
			renderChildren(tmpId, tmpVal);
		});
		
		////  서버에서 삭제된 데이터 받는 함수  ////
		socket.on('get_delete_data', function (data) {
			var tmpTool = data.tool;
			var delId = data.id;
			
			var delSelect = $('[taskid='+delId+']');

			delSelect.remove();
		});

		////  포스트잇 추가하는 함수  ////
		function addPostit() {	
			////  lastId 서버에 요청  ////
			socket.emit('set_last_id', { group: tmpGroup, tool: 'postit1' });		
		}

		////  마우스 포커스 이동시 처리하는 함수  ////
		function mouseFocus() {
			var focusClass = $('textarea:focus').parent();
			var focusClassId = focusClass.attr('taskid');
			//console.log(focusClass.attr('taskid'));
			var preClass = $('.container').find('.open');
			var preClassId = preClass.attr('taskid'); 
			if ( focusClassId != preClassId ) {		// 다른 포스트잇 선택했을 때
				preClass.attr('class', 'object task');
				focusClass.attr('class', 'object open');
				
				var preIndex = $('.object').index(preClass);	 // 이전 Index 구함
				if ( preIndex >= 0 ) {
					var preVal = preClass.children('textarea').val();
					//console.log(preVal);
					////  추가된 데이터 서버에 전달  ////
					socket.emit('set_insert_data', { group: tmpGroup, tool: 'postit1', id: preClassId, index: preIndex, val: preVal });
				}
			}
			
		}

		</script>