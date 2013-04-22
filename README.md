SSymphony
=========

회의 진행 코칭 서비스


◎ API 함수 목록


◇ 공통

· join_room : 그룹에 join하는 함수
- 서버 함수
	on('join_room', data)
- 클라이언트 API
	emit('join_room', {group: 'group'}) 

예제) socket.emit('join_room', { group: 'group1' });


· get_client : 자신의 클라이언트 번호 가져오는 함수
- 서버 함수
	emit('get_client', {client: 'client'})
- 클라이언트 API
	on('get_client', data) 

예제) socket.on('get_client', function (data) {


· set_last_id : 현재 tool의 lastId 서버에 요청하는 함수
- 서버함수
	on('set_last_id', data)
- 클라이언트 API
	emit('set_last_id', {group: 'group', tool: 'tool'}) 
예제) socket.emit(

· get_last_id : 현재 tool의 lastId 서버에서 응답 받는 함수
- 서버함수
	emit('get_last_id', {tool: 'tool', last: 'last'})
- 클라이언트 API
	on('get_last_id', data)
예제) socket.on(

· set_option_data : 현재 tool의 옵션 데이터 전달
- 서버함수
	on('set_option_data', data)
- 클라이언트 API
	emit('set_option_data', {group: 'group', tool: 'tool', id: 'id', option: 'option', val: 'val'})
예제) socket.emit(

· get_option_data : 현재 tool의 옵션 데이터 응답 받는 함수
- 서버함수
	emit('get_option_data', {tool: 'tool', id: 'id', option: 'option', val: 'val'})
- 클라이언트 API	
	on('get_option_data', data)
예제) socket.on(

· set_init_tool_data : 현재 tool의 데이터 초기화
- 서버함수
	on('set_init_tool_data', data)
- 클라이언트 API
	emit('set_init_tool_data', {group: 'group', tool: 'tool'})
예제) socket.emit(

· get_init_tool_data : 현재 tool의 데이터 초기화 응답 받는 함수
- 서버함수
	emit('get_init_tool_data', {tool: 'tool'})
- 클라이언트 API
	on('get_init_tool_data', data)
예제) socket.on(


◇ 일반 도구

· set_data : 현재 group, tool에 해당하는 데이터 서버에 요청하는 함수
- 서버함수
	on('set_data', data)
- 클라이언트 API
	emit('set_data', {group: 'group', tool: 'tool'}) 
예제) socket.emit(

· get_data : 현재 tool에 해당하는 데이터 서버에서 응답 받는 함수
- 서버함수
	emit('get_data', {tool: 'tool', id: 'id', val: 'val'})
- 클라이언트 API
	on('get_data', data)
예제) socket.on(

· set_input_data : 클라이언트가 입력 시작한 경우 서버로 데이터 전달
- 서버함수
	on('set_input_data', data)
- 클라이언트 API
	emit('set_input_data', {group: 'group', tool: 'tool', id: 'id', index: 'index', client: 'client'}) 
예제) socket.emit(

· get_input_data : 다른 클라이언트 입력 내용 서버에서 응답 받는 함수
- 서버함수
	emit('get_input_data', {tool: 'tool', id: 'id', index: 'index', client: 'client'})
- 클라이언트 API
	on('get_input_data', data)
예제) socket.on(

· set_insert_data : 현재 tool의 추가된 값 서버에 저장
- 서버함수
	on('set_insert_data', data)
- 클라이언트 API
	emit('set_insert_data', {group: 'group', tool: 'tool', id: 'id', index: 'index', val: 'val', client: 'client'}) 
예제) socket.emit(

· get_insert_data : 현재 tool의 추가된 값 서버에서 응답 받는 함수
- 서버함수
	emit('get_insert_data', {tool: 'tool', id: 'id', index: 'index', val: 'val', client: 'client'})
- 클라이언트 API
	on('get_insert_data', data)
예제) socket.on(

· set_delete_data : 현재 tool의 삭제된 값 서버에서 삭제
- 서버함수
	on('set_delete_data', data)
- 클라이언트 API
	emit('set_delete_data', {group: 'group', tool: 'tool', id: 'id'}) 
예제) socket.emit(

· get_delete_data : 현재 tool의 삭제된 값 서버에서 응답 받는 함수
- 서버함수
	emit('get_delete_data', {tool: 'tool', id: 'id'})
- 클라이언트 API
	on('get_delete_data', data)	
예제) socket.on(

· set_change_data : 현재 tool의 데이터 다른 tool 형태로 변경
- 서버함수
	on('set_change_data', data)
- 클라이언트 API
	emit('set_delete_tree_data', {group: 'group', tool: 'tool', change: 'change'}) 
예제) socket.emit(

· get_change_data : 새로운 tool로 변경된 데이터 서버에서 응답 받는 함수
- 서버함수
	emit('get_change_data', {group: 'group', tool: 'tool', change: 'change'})
- 클라이언트 API
	on('get_delete_tree_data', data)
예제) socket.on(


◇ Tree 구조 도구

· set_tree_data : 현재 group, tool에 해당하는 데이터 서버에 요청하는 함수(tree)
- 서버함수
	on('set_tree_data', data)
- 클라이언트 API
	emit('set_tree_data', {group: 'group', tool: 'tool'}) 
예제) socket.emit(

· get_tree_data : 현재 tool에 해당하는 데이터 서버에서 응답 받는 함수(tree)
- 서버함수
	emit('get_tree_data', {tool: 'tool', id: 'id', parent: 'parent', val: 'val'})
- 클라이언트 API
	on('get_tree_data', data)
예제) socket.on(

· set_input_tree_data : 클라이언트가 입력 시작한 경우 서버로 데이터 전달(tree)
- 서버함수
	on('set_input_tree_data', data)
- 클라이언트 API
	emit('set_input_data', {group: 'group', tool: 'tool', id: 'id', parent: 'parent', index: 'index', client: 'client'}) 
예제) socket.emit(

· get_input_tree_data : 다른 클라이언트 입력 내용 서버에서 응답 받는 함수(tree)
- 서버함수
	emit('get_input_tree_data', {tool: 'tool', id: 'id', parent: 'parent', index: 'index', client: 'client'})
- 클라이언트 API
	on('get_input_tree_data', data)
예제) socket.on(

· set_change_depth : 데이터의 depth 변경된 경우 서버로 데이터 전달(tree)
- 서버함수
	on('set_change_depth', data)
- 클라이언트 API
	emit('set_change_depth', {group: 'group', tool: 'tool', id: 'id', depth: 'depth'}) 
예제) socket.emit(

· get_change_depth : 데이터의 depth 변경된 내용 서버에서 응답 받는 함수(tree)
- 서버함수
	emit('get_change_depth', {tool: 'tool', id: 'id', depth: 'depth'}) 
- 클라이언트 API
	on('get_input_tree_data', data)
예제) socket.on(

· set_insert_tree_data : 현재 tool의 추가된 값 서버에 저장(tree)
- 서버함수
	on('set_insert_tree_data', data)
- 클라이언트 API
	emit('set_insert_tree_data', {group: 'group', tool: 'tool', id: 'id', parent: 'parent', index: 'index', val: 'val', client: 'client'}) 
예제) socket.emit(

· get_insert_tree_data : 현재 tool의 추가된 값 서버에서 응답 받는 함수(tree)
- 서버함수
	emit('get_insert_tree_data', {tool: 'tool', id: 'id', parent: 'parent', index: 'index', val: 'val', client: 'client'})
- 클라이언트 API
	on('get_insert_data', data)
예제) socket.on(

· set_delete_tree_data : 현재 tool의 삭제된 값 서버에서 삭제(tree)
- 서버함수
	on('set_delete_tree_data', data)
- 클라이언트 API
	emit('set_delete_tree_data', {group: 'group', tool: 'tool', id: 'id'}) 
예제) socket.emit(

· get_delete_tree_data : 현재 tool의 삭제된 값 서버에서 응답 받는 함수(tree)
- 서버함수
	emit('get_delete_tree_data', {tool: 'tool', id: 'id'})
- 클라이언트 API
	on('get_delete_tree_data', data)
예제) socket.on(

· set_change_tree_data : 현재 tool의 데이터 다른 tool 형태로 변경(tree)
- 서버함수
	on('set_change_tree_data', data)
- 클라이언트 API
	emit('set_delete_tree_data', {group: 'group', tool: 'tool', change: 'change'}) 
예제) socket.emit(

· get_change_tree_data : 새로운 tool로 변경된 데이터 서버에서 응답 받는 함수(tree)
- 서버함수
	emit('get_change_tree_data', {group: 'group', tool: 'tool', change: 'change'})
- 클라이언트 API
	on('get_delete_tree_data', data)
예제) socket.on(
