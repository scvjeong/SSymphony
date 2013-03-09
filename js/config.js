	$(document).ready( function() {   
		/* draw calendar */
		setup_calendar();

		setup_all_buttons();

		setup_widgets_desktop();
	}); 

	/* ---------------------------------------------------------------------- */
	/*	Calendar
	/* ---------------------------------------------------------------------- */

	function setup_calendar() {
		
		if ($("#calendar").length) {
			var date = new Date();
			var d = date.getDate();
			var m = date.getMonth();
			var y = date.getFullYear();
			
			var calendar = $('#calendar').fullCalendar({
				header: {
					left: 'title', //,today
					center: 'prev, next, today',
					right: 'month, agendaWeek, agenDay' //month, agendaDay, 
				},
				selectable: true,
				selectHelper: true,
				select: function(start, end, allDay) {
					var title = prompt('Event Title:');
					if (title) {
						calendar.fullCalendar('renderEvent',
							{
								title: title,
								start: start,
								end: end,
								allDay: allDay
							},
							true // make the event "stick"
						);
					}
					calendar.fullCalendar('unselect');
				},
				
				editable: true,
				events: [
					{
						title: 'All Day Event',
						start: new Date(y, m, 1)
					},
					{
						title: 'Long Event',
						start: new Date(y, m, d-5),
						end: new Date(y, m, d-2)
					},
					{
						id: 999,
						title: 'Repeating Event',
						start: new Date(y, m, d-3, 16, 0),
						allDay: false
					},
					{
						id: 999,
						title: 'Repeating Event',
						start: new Date(y, m, d+4, 16, 0),
						allDay: false
					},
					{
						title: 'Meeting',
						start: new Date(y, m, d, 10, 30),
						allDay: false
					},
					{
						title: 'Lunch',
						start: new Date(y, m, d, 12, 0),
						end: new Date(y, m, d, 14, 0),
						allDay: false
					},
					{
						title: 'Birthday Party',
						start: new Date(y, m, d+1, 19, 0),
						end: new Date(y, m, d+1, 22, 30),
						allDay: false
					},
					{
						title: 'Click for Google',
						start: new Date(y, m, 28),
						end: new Date(y, m, 29),
						url: 'http://google.com/'
					}
				]
			});

		};
		
		/* hide default buttons */
		$('.fc-header-right, .fc-header-center').hide();
	}	
	/* end calendar */

	/* ---------------------------------------------------------------------- */
	/*	All button functions
	/* ---------------------------------------------------------------------- */	
	
	function setup_all_buttons() {
		/* calendar buttons */

		$('div#calendar-buttons #btn-prev').click(function(){
		    $('.fc-button-prev').click();
		    return false;
		});
		
		$('div#calendar-buttons #btn-next').click(function(){
		    $('.fc-button-next').click();
		    return false; 
		});

		$('div#calendar-buttons #btn-today').click(function(){
		    $('.fc-button-today').click();
		    return false; 
		});
		
		$('div#calendar-buttons #btn-month').click(function(){
		    $('#calendar').fullCalendar('changeView', 'month');
		});
		
		$('div#calendar-buttons #btn-agenda').click(function(){
		    $('#calendar').fullCalendar('changeView', 'agendaWeek');
		});
		
		$('div#calendar-buttons #btn-day').click(function(){
		   $('#calendar').fullCalendar('changeView', 'agendaDay');
		});
		
		/* end calendar buttons */

		/* reset widget */
		$('a#reset-widget').click(function(){
			resetWidget();
			return false;
		});
	}
	/* end all button functions */

	/* ---------------------------------------------------------------------- */
	/*	Widgets Desktop
	/* ---------------------------------------------------------------------- */	
	
	function setup_widgets_desktop() {
		
		if ($('#widget-grid').length){
			
			$('#widget-grid').jarvisWidgets({	
							
				grid: 'article',
				widgets: '.jarviswidget',
				localStorage: true,
				deleteSettingsKey: '#deletesettingskey-options',
				settingsKeyLabel: 'Reset settings?',
				deletePositionKey: '#deletepositionkey-options',
				positionKeyLabel: 'Reset position?',
				sortable: true,
				buttonsHidden: false,
				toggleButton: true,
				toggleClass: 'min-10 | plus-10',
				toggleSpeed: 200,
				onToggle: function(){},
				deleteButton: true,
				deleteClass: 'trashcan-10',
				deleteSpeed: 200,
				onDelete: function(){},
				editButton: true,
				editPlaceholder: '.jarviswidget-editbox',
				editClass: 'pencil-10 | edit-clicked',
				editSpeed: 200,
				onEdit: function(){},
				fullscreenButton: true,
				fullscreenClass: 'fullscreen-10 | normalscreen-10',	
				fullscreenDiff: 3,		
				onFullscreen: function(){},
				customButton: false,
				customClass: 'folder-10 | next-10',
				customStart: function(){ alert('Hello you, this is a custom button...') },
				customEnd: function(){ alert('bye, till next time...') },
				buttonOrder: '%refresh% %delete% %custom% %edit% %fullscreen% %toggle%',
				opacity: 1.0,
				dragHandle: '> header',
				placeholderClass: 'jarviswidget-placeholder',
				indicator: true,
				indicatorTime: 600,
				ajax: true,
				timestampPlaceholder:'.jarviswidget-timestamp',
				timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
			    refreshButton: true,
			    refreshButtonClass: 'refresh-10',
				labelError:'Sorry but there was a error:',
				labelUpdated: 'Last Update:',
				labelRefresh: 'Refresh',
				labelDelete: 'Delete widget:',
				afterLoad: function(){},
				rtl: false
				
			});
			
		} // end if
		
	}	
	/* end widgets desktop */