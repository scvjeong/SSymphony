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