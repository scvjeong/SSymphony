Orchestra
=========

회의 진행 코칭 서비스


API References


◇ Common
=======
◎ join_room : 그룹에 join하는 함수
- Server
	: on('join_room', data)
- Client API
	: emit('join_room', {group: 'group'}) 
- Parameter
	: group(그룹명)

	ex) socket.emit('join_room', { group: 'group1' });



◎ get_client : 자신의 클라이언트 번호 가져오는 함수
- Server
	: emit('get_client', {client: 'client'})
- Client API
	: on('get_client', data) 
- Parameter
	: client(자신의 클라이언트 번호)



◎ set_last_id : 현재 tool의 lastId 서버에 요청하는 함수
- Server
	: on('set_last_id', data)
- Client API
	: emit('set_last_id', {group: 'group', tool: 'tool'}) 
- Parameter
	: group(그룹명), tool(도구명)



◎ get_last_id : 현재 tool의 lastId 서버에서 응답 받는 함수
- Server
	: emit('get_last_id', {tool: 'tool', last: 'last'})
- Client API
	: on('get_last_id', data)
- Parameter
	: tool(도구명), last(현재 tool의 lastId)



◎ set_option_data : 현재 tool의 옵션 데이터 전달
- Server
	: on('set_option_data', data)
- Client API
	: emit('set_option_data', {group: 'group', tool: 'tool', id: 'id', option: 'option', val: 'val'})
- Parameter
	: group(그룹명), tool(도구명), id(옵션 Id), option(옵션명), val(옵션값)



◎ get_option_data : 현재 tool의 옵션 데이터 응답 받는 함수
- Server
	: emit('get_option_data', {tool: 'tool', id: 'id', option: 'option', val: 'val'})
- Client API	
	: on('get_option_data', data)
- Parameter
	: tool(도구명), id(옵션 Id), option(옵션명), val(옵션값)



◎ set_init_tool_data : 현재 tool의 데이터 초기화
- Server
	: on('set_init_tool_data', data)
- Client API
	: emit('set_init_tool_data', {group: 'group', tool: 'tool'})
- Parameter
	: group(그룹명), tool(도구명)



◎ get_init_tool_data : 현재 tool의 데이터 초기화 응답 받는 함수
- Server
	: emit('get_init_tool_data', {tool: 'tool'})
- Client API
	: on('get_init_tool_data', data)
- Parameter
	: tool(도구명)




◇ Tree Structure Tool
=======
◎ set_tree_data : 현재 group, tool에 해당하는 데이터 서버에 요청하는 함수(tree)
- Server
	: on('set_tree_data', data)
- Client API
	: emit('set_tree_data', {group: 'group', tool: 'tool'}) 
- Parameter
	: group(그룹명), tool(도구명)



◎ get_tree_data : 현재 tool에 해당하는 데이터 서버에서 응답 받는 함수(tree)
- Server
	: emit('get_tree_data', {tool: 'tool', id: 'id', parent: 'parent', val: 'val'})
- Client API
	: on('get_tree_data', data)
- Parameter
	: tool(도구명), id(Id 값), parent(Parent 값), val(데이터 값)



◎ set_tree_option_data : 현재 group, tool에 해당하는 옵션 데이터 서버에 요청하는 함수(tree)
- Server
	: on('set_tree_data', data)
- Client API
	: emit('set_tree_data', {group: 'group', tool: 'tool'}) 
- Parameter
	: group(그룹명), tool(도구명)



◎ get_tree_option_data : 현재 tool에 해당하는 옵션 데이터 서버에서 응답 받는 함수(tree)
- Server
	: emit('get_tree_data', {tool: 'tool', id: 'id', option: 'option', val: 'val'})
- Client API
	: on('get_tree_data', data)
- Parameter
	: tool(도구명), id(옵션 Id), option(옵션명), val(옵션값)



◎ set_input_tree_data : 클라이언트가 입력 시작한 경우 서버로 데이터 전달(tree)
- Server
	: on('set_input_tree_data', data)
- Client API
	: emit('set_input_data', {group: 'group', tool: 'tool', id: 'id', parent: 'parent', index: 'index', client: 'client'}) 
- Parameter
	: group(그룹명), tool(도구명), id(Id 값), parent(Parent 값), index(인덱스 값), client(클라이언트 번호) 



◎ get_input_tree_data : 다른 클라이언트 입력 내용 서버에서 응답 받는 함수(tree)
- Server
	: emit('get_input_tree_data', {tool: 'tool', id: 'id', parent: 'parent', index: 'index', client: 'client'})
- Client API
	: on('get_input_tree_data', data)
- Parameter
	: tool(도구명), id(Id 값), parent(Parent 값), index(인덱스 값), client(클라이언트 번호) 



◎ set_change_depth : 데이터의 depth 변경된 경우 서버로 데이터 전달(tree)
- Server
	: on('set_change_depth', data)
- Client API
	: emit('set_change_depth', {group: 'group', tool: 'tool', id: 'id', depth: 'depth'}) 
 - Parameter
	: group(그룹명), tool(도구명), id(Id 값), depth(depth 값) 



◎ get_change_depth : 데이터의 depth 변경된 내용 서버에서 응답 받는 함수(tree)
- Server
	: emit('get_change_depth', {tool: 'tool', id: 'id', depth: 'depth'}) 
- Client API
	: on('get_change_depth', data)
- Parameter
	: tool(도구명), id(Id 값), depth(depth 값) 



◎ set_change_parent : 데이터의 parent 변경된 경우 서버로 데이터 전달(tree)
- Server
	: on('set_change_parent', data)
- Client API
	: emit('set_change_parent', {group: 'group', tool: 'tool', id: 'id', parent: 'parent', val: 'val'}) 
- Parameter
	: group(그룹명), tool(도구명), id(Id 값), parent(Parent 값), val(데이터 값) 



◎ get_change_parent : 데이터의 parent 변경된 내용 서버에서 응답 받는 함수(tree)
- Server
	: emit('get_change_parent', {tool: 'tool', id: 'id', parent: 'parent'}) 
- Client API
	: on('get_change_parent', data)
- Parameter
	: tool(도구명), id(Id 값), parent(Parent 값) 



◎ set_insert_tree_data : 현재 tool의 추가된 값 서버에 저장(tree)
- Server
	: on('set_insert_tree_data', data)
- Client API
	: emit('set_insert_tree_data', {group: 'group', tool: 'tool', id: 'id', parent: 'parent', index: 'index', val: 'val', client: 'client'}) 
- Parameter
	: group(그룹명), tool(도구명), id(Id 값), parent(Parent 값), index(인덱스 값), val(데이터 값), client(클라이언트 번호) 



◎ get_insert_tree_data : 현재 tool의 추가된 값 서버에서 응답 받는 함수(tree)
- Server
	: emit('get_insert_tree_data', {tool: 'tool', id: 'id', parent: 'parent', index: 'index', val: 'val', client: 'client'})
- Client API
	: on('get_insert_data', data)
- Parameter
	: tool(도구명), id(Id 값), parent(Parent 값), index(인덱스 값), val(데이터 값), client(클라이언트 번호) 



◎ set_delete_tree_data : 현재 tool의 삭제된 값 서버에서 삭제(tree)
- Server
	: on('set_delete_tree_data', data)
- Client API
	: emit('set_delete_tree_data', {group: 'group', tool: 'tool', id: 'id'}) 
- Parameter
	: group(그룹명), tool(도구명), id(Id 값)



◎ get_delete_tree_data : 현재 tool의 삭제된 값 서버에서 응답 받는 함수(tree)
- Server
	: emit('get_delete_tree_data', {tool: 'tool', id: 'id'})
- Client API
	: on('get_delete_tree_data', data)
- Parameter
	: tool(도구명), id(Id 값)



◎ set_change_tree_data : 현재 tool의 데이터 다른 tool 형태로 변경(tree)
- Server
	: on('set_change_tree_data', data)
- Client API
	: emit('set_delete_tree_data', {group: 'group', tool: 'tool', change: 'change'}) 
- Parameter
	: group(그룹명), tool(현재 도구명), change(변경하는 도구명)



◎ get_change_tree_data : 새로운 tool로 변경된 데이터 서버에서 응답 받는 함수(tree)
- Server
	: emit('get_change_tree_data', {tool: 'tool', change: 'change'})
- Client API
	: on('get_delete_tree_data', data)
- Parameter
	: tool(현재 도구명), change(변경하는 도구명)




◇ Normal Structure Tool
=======
◎ set_data : 현재 group, tool에 해당하는 데이터 서버에 요청하는 함수
- Server
	: on('set_data', data)
- Client API
	: emit('set_data', {group: 'group', tool: 'tool'}) 
- Parameter
	: group(그룹명), tool(도구명)



◎ get_data : 현재 tool에 해당하는 데이터 서버에서 응답 받는 함수
- Server
	: emit('get_data', {tool: 'tool', id: 'id', val: 'val'})
- Client API
	: on('get_data', data)
- Parameter
	: tool(도구명), id(Id 값), val(데이터 값)



◎ set_input_data : 클라이언트가 입력 시작한 경우 서버로 데이터 전달
- Server
	: on('set_input_data', data)
- Client API
	: emit('set_input_data', {group: 'group', tool: 'tool', id: 'id', index: 'index', client: 'client'}) 
- Parameter
	: group(그룹명), tool(도구명), id(Id 값), index(인덱스 값), client(클라이언트 번호)



◎ get_input_data : 다른 클라이언트 입력 내용 서버에서 응답 받는 함수
- Server
	: emit('get_input_data', {tool: 'tool', id: 'id', index: 'index', client: 'client'})
- Client API
	: on('get_input_data', data)
- Parameter
	: tool(도구명), id(Id 값), index(인덱스 값), client(클라이언트 번호)



◎ set_insert_data : 현재 tool의 추가된 값 서버에 저장
- Server
	: on('set_insert_data', data)
- Client API
	: emit('set_insert_data', {group: 'group', tool: 'tool', id: 'id', index: 'index', val: 'val', client: 'client'}) 
- Parameter
	: group(그룹명), tool(도구명), id(Id 값), index(인덱스 값), val(데이터 값), client(클라이언트 번호)



◎ get_insert_data : 현재 tool의 추가된 값 서버에서 응답 받는 함수
- Server
	: emit('get_insert_data', {tool: 'tool', id: 'id', index: 'index', val: 'val', client: 'client'})
- Client API
	: on('get_insert_data', data)
- Parameter
	: tool(도구명), id(Id 값), index(인덱스 값), val(데이터 값), client(클라이언트 번호)



◎ set_delete_data : 현재 tool의 삭제된 값 서버에서 삭제
- Server
	: on('set_delete_data', data)
- Client API
	: emit('set_delete_data', {group: 'group', tool: 'tool', id: 'id'}) 
- Parameter
	: group(그룹명), tool(도구명), id(Id 값)



◎ get_delete_data : 현재 tool의 삭제된 값 서버에서 응답 받는 함수
- Server
	: emit('get_delete_data', {tool: 'tool', id: 'id'})
- Client API
	: on('get_delete_data', data)	
- Parameter
	: tool(도구명), id(Id 값)



◎ set_change_data : 현재 tool의 데이터 다른 tool 형태로 변경
- Server
	: on('set_change_data', data)
- Client API
	: emit('set_delete_tree_data', {group: 'group', tool: 'tool', change: 'change'}) 
- Parameter
	: group(그룹명), tool(현재 도구명), change(변경하는 도구명)



◎ get_change_data : 새로운 tool로 변경된 데이터 서버에서 응답 받는 함수
- Server
	: emit('get_change_data', {tool: 'tool', change: 'change'})
- Client API
	: on('get_delete_tree_data', data)
- Parameter
	: tool(현재 도구명), change(변경하는 도구명)

