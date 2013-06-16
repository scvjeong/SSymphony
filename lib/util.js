exports.regroup_post = function ( post ) {
	var keys = Object.keys( post );
	var arr = new Array;
	var len = 1;
	if( keys.length > 0 )
	{
		for( var i=0;i<keys.length; i++)
		{
			if( typeof( post[keys[i]] ) == "object" )
				len = post[keys[i]].length;
		}

		for(var i=0; i<len; i++)
		{
			arr[i] = {};
			for(var j=0; j<keys.length; j++)
			{
				if( typeof( post[keys[j]] ) == "object" )
					arr[i][keys[j]] = post[keys[j]][i];
				else
					arr[i][keys[j]] = post[keys[j]];
			}
		}
	}
	return arr;
}

exports.regroup_post_for_meeting_planning = function ( post ) {
	var keys = Object.keys( post );
	var arr = new Array;
	var len = 1;
	if( keys.length > 0 )
	{
		for( var i=0;i<keys.length; i++)
		{
			if( typeof( post[keys[i]] ) == "object" )
				len = post[keys[i]].length;
		}

		for(var i=0; i<len; i++)
		{
			arr[i] = {};
			for(var j=0; j<keys.length; j++)
			{
				if( keys[j] == "subject" || keys[j] == "goal" || keys[j] == "start_time" || keys[j] == "end_time" )
					arr[i][keys[j]] = post[keys[j]][i];
				else
					arr[i][keys[j]] = post[keys[j]];
			}
		}
	}
	return arr;
}

// t - time
// h - hours
// m - minute
// s - second
exports.getTime = function( str ){
	var t_arr = str.toString().split(":");
	if( t_arr < 3 )
		return { t:0, h:0, m:0, s:0};
	else
	{
		var t = (t_arr[0]*60*60) + (t_arr[1]*60) + t_arr[2]*1;
		var h = Math.floor(t / 3600);
		var m = Math.floor((t % 3600)/60);
		var s = Math.floor((t % 3600)%60);
		return { t:t, h:h, m:m, s:s};
	}
}

exports.getTimeFormat = function( num ){
	if( (typeof num) !== "number" )
		return "00:00:00";
	else
	{
		var h = Math.floor(num / 3600);
		var m = Math.floor((num % 3600)/60);
		var s = Math.floor((num % 3600)%60);
		if( h.toString().length < 2 ) h = "0"+h;
		if( m.toString().length < 2 ) m = "0"+m;
		if( s.toString().length < 2 ) s = "0"+s;
		return (h + ":" + m + ":" + s);
	}
}