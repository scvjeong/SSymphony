$.extend({
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name) {
        return $.getUrlVars()[name];
    }
});

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

function showMeetingResultWindow()
{
	var source_url = "/page/meeting_result";
	$.ajax({
		type: "GET",
		url: source_url,
		dataType: "html",
		success: function(data) {
			dialog = bootbox.dialog(data);
	
			var bootbox_select = $('.bootbox');
			bootbox_select.addClass("meeting_result_bootbox");
			
			setupUserListChart();
			setupWordChart();
			
			var meeting_val = $("#meeting_val").text();
			var ft_val = $("#proceeding_val").text();

			$("#meeting_rating").jqxRating({ width: 100, height: 60, theme: 'classic', disabled: true, value: meeting_val });
			$("#ft_rating").jqxRating({ width: 100, height: 60, theme: 'classic', disabled: true, value: ft_val });
			
			//도구 결과 이미지 불러오는 부분
			var params = [];
			params['idx_process'] = 0;
			getToolsImage(params);

		},
		error: function(err) {
			console.log(err);
			return false;
		}
	});		
}

function clickAgendaTitle(num)
{
	console.log(num);
	var tmp_result_num = "result"+num;
	var tmp_selector = $('#'+tmp_result_num);
	var tmp_display = tmp_selector.css("display");
	if ( tmp_display == "block" )
	{
		tmp_selector.css("display", "none");
	}
	else if ( tmp_display == "none" )
	{
		tmp_selector.css("display", "block");
	
	}
	//console.log( $('#'+tmp_result_num).attr('id') );
}

function getToolsImage(params)
{
	var idx_process = params['idx_process'];
	
	var send_params = {
		idx_process: idx_process
	};	
					
	$.ajax({
		url: '/page/get_tools_image',
		type: 'POST',		
		data: send_params,
		dataType: 'json',
		success: function(json_data) {
			console.log("Success");
			console.log("json length: "+json_data.length);
			var i=0;
			for ( i=0; i<json_data.length; i++)
			{
				//console.log("[json_data] -> "+json_data[i].image_value);
				drawToolsImage(idx_process, json_data[i].idx_tool, json_data[i].tool_num, json_data[i].image_value);
			}		
		}
	});
}

function drawToolsImage(idx_process, idx_tool, tool_num, image_value)
{
	console.log("idx_tool->"+idx_tool);
	console.log("tool_num->"+tool_num);
	console.log("image_value->"+image_value);

	var tool_name = "";

	switch ( tool_num ) {
		case 1 : tool_name = "List"; break;
		case 2 : tool_name = "Postit"; break;
		case 3 : tool_name = "Mindmap"; break;
		case 4 : tool_name = "Vote"; break;
		case 5 : tool_name = "Matrix"; break;	
		default : tool_name = ""; break;
	}
	

	//console.log("tool_name->"+tool_name);

	var tmp_canvas = tool_name+idx_tool;
	
	var result_tag = "<div class='agenda_result_box'>";
	result_tag += "<div class='agenda_result_title'>"+tool_name+"</div>";
	result_tag += "<canvas class='agenda_result_canvas' id="+tmp_canvas+"></canvas>";
	result_tag += "</div>";

	var tmp_result_selector = $('.agenda_result:eq('+idx_process+')');
	tmp_result_selector.append(result_tag);
	
	var image = new Image();
	image.src = image_value;
	
	var canvas_selector =document.getElementById(tmp_canvas);
	//console.log(canvas_selector);
	var ctx = canvas_selector.getContext("2d");
	ctx.drawImage(image,0,0, image.width, image.height,0,0,300,150);

}


function hideMeetingResultWindow()
{
	var bootbox_select = $('.meeting_result_bootbox');
	bootbox_select.modal('hide');
}



function setupWordChart()
{
	var d1 = [[20,20,10], [40,50,20], [70,10,5], [80,80,7]];
	var d2 = [[60,25,15], [70,40,6], [30,80,4]];
	var d3 = [[30,25,15], [24,40,6], [30,43,4]];
	var d4 = [[20,23,10], [43,24,20], [23,65,5], [60,80,4]];
	var options = { 
		series:{bubbles:{active:true,show:true,linewidth:2},editMode:'xy'},
		grid:{hoverable:true,clickable:true,editable:true }
	};
	$.plot( $("#placeholder") , [d1,d2,d3,d4], options );
}

function setupUserListChart()
{
	if ($(".bar-chart").length) {
		var data1 = [];
		for (var i = 0; i <= 4; i += 1)
			data1.push([i, parseInt(Math.random() * 100)]);

		var data2 = [];
		for (var i = 0; i <= 4; i += 1)
			data2.push([i, parseInt(Math.random() * 100)]);

		var data3 = [];
		for (var i = 0; i <= 4; i += 1)
			data3.push([i, parseInt(Math.random() * 100)]);

		var ds = new Array();

		ds.push({
			data : data1,
			bars : {
				show : true,
				barWidth : 0.2,
				order : 1,
			}
		});
		ds.push({
			data : data2,
			bars : {
				show : true,
				barWidth : 0.2,
				order : 2
			}
		});
		ds.push({
			data : data3,
			bars : {
				show : true,
				barWidth : 0.2,
				order : 3
			}
		});
		//Display graph
		$.plot($(".bar-chart"), ds, {
			colors : [$chrt_second, $chrt_fourth, "#666", "#BBB"],
			grid : {
				show : true,
				hoverable : true,
				clickable : true,
				tickColor : $chrt_border_color,
				borderWidth : 0,
				borderColor : $chrt_border_color,
			},
			legend : true,
			tooltip : true,
			tooltipOpts : {
				content : "<b>%x</b> = <span>%y</span>",
				defaultTheme : false
			}
		});
	}
}
