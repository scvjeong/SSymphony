function getMindmapSize(mWidth, mHeight) {
	/*var myWidth = 0;
	var myHeight = 0;

	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		myWidth = 200; //window.innerWidth;
		myHeight = 200; //window.innerHeight;
	} else if( document.documentElement &&
				( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	}*/

	return {"width": mWidth, "height": mHeight}
}

function resizeMindmap() {
	var size = getMindmapSize();
	var w = size.width;
	var h = size.height;

	var topDiv = document.getElementById("top");
	if(!topDiv) topDiv = 0;
	var bottomDiv = document.getElementById("bottom");
	if(!bottomDiv) bottomDiv = 0;
	var mapDiv = document.getElementById("jinomap");
	mapDiv.style.width = w + "px";
	mapDiv.style.height = h + "px"; //(h - topDiv.offsetHeight - bottomDiv.offsetHeight) + "px";
}

var jMap;
function newMindmapTool()
{
	jMap = new JinoMap("jinomap", 5000, 3000, 1);
	jMap.cfg.lazyLoading = false;
	jMap.cfg.realtimeSave = false;
	jMap.newMap();
}