/*         
     __                   .__        
    |__|____ __________  _|__| ______
    |  \__  \\_  __ \  \/ /  |/  ___/
    |  |/ __ \|  | \/\   /|  |\___ \ 
/\__|  (____  /__|    \_/ |__/____  >
\______|    \/                    \/ 

   Copyright 2013 - Jarvis : Smart Admin Template

 * This script is part of an item on wrapbootstrap.com
 * https://wrapbootstrap.com/user/myorange
 * 
 * Date 	 : Jan 2013
 * Updated	 : 19/10/2012
 * Dependency: jQuery UI core, json2(ie7)  
 * 
 * ************************************************************* *
 * 
 * Jarvis Widgets (AKA Power Widgets), is orgiginally created by 
 * Mark (www.creativemilk.net). This script may NOT be RESOLD or 
 * REDISTRUBUTED under any circumstances, and is only to be used 
 * with this purchased copy of Jarvis Smart Admin Template. 
 * 
 * ************************************************************* */

// Note: we have used .attr() instead of .data() for some parts, 
// as the .data() will not work propper(1.7.2 core bug?).
 
;(function($, window, document, undefined){
    $.fn.jarvisWidgets = function(options) { 
	
		options = $.extend({}, $.fn.jarvisWidgets.options, options); 
	 
			return this.each(function() {  
				
				/**
				* Variables.
				**/
				var obj                    = $(this);
				var objId                  = obj.attr('id');
				var pwCtrls                = '.jarviswidget-ctrls'
				var widget                 = obj.find(options.widgets);
				var widgetHeader           = obj.find(options.widgets+' > header');
				var o_widgetClass          = options.widgets;
				var o_grid                 = options.grid;
				var o_localStorage         = options.localStorage;
				var o_deleteSettingsKey    = options.deleteSettingsKey;
				var o_settingsKeyLabel     = options.settingsKeyLabel;
				var o_deletePositionKey    = options.deletePositionKey;
				var o_positionKeyLabel     = options.positionKeyLabel;
				var o_allowSortable        = options.sortable;
				var o_editPlaceholder      = options.editPlaceholder;
				var o_editSpeed            = options.editSpeed;
				var o_buttonOrder          = options.buttonOrder;
				var o_buttonsHidden        = options.buttonsHidden;
				var o_indicator            = options.indicator;
				var o_indicatorTime        = options.indicatorTime;
				var o_toggleSpeed          = options.toggleSpeed;
				var o_fullscreenDiff       = options.fullscreenDiff;
				var o_labelDelete          = options.labelDelete;
				var o_deleteSpeed          = options.deleteSpeed;
				var o_placeholderClass     = options.placeholderClass;
				var o_opacity              = options.opacity;
				var o_dragHandle           = options.dragHandle;
				var o_allowAjax            = options.ajax;
				var o_loadingLabel         = options.loadingLabel;
				var o_timestampFormat      = options.timestampFormat;
				var o_timestampPlaceholder = options.timestampPlaceholder;
				var o_refreshButton        = options.refreshButton;
				var o_refreshButtonClass   = options.refreshButtonClass;
				var o_labelError           = options.labelError;
				var o_labelRefresh         = options.labelRefresh;
				var o_deleteClass          = options.deleteClass;
				var o_toggleClass          = options.toggleClass.split('|');
				var o_editClass            = options.editClass.split('|');
				var o_fullscreenClass      = options.fullscreenClass.split('|');
				var o_customClass          = options.customClass.split('|');
				var o_allowToggle          = options.toggleButton;
				var o_allowCustom          = options.customButton;
				var o_allowDelete          = options.deleteButton;
				var o_allowEdit            = options.editButton;
				var o_allowFullscreen      = options.fullscreenButton;
				var o_rtl                  = options.rtl;
				
				//*****************************************************************//
				//////////////////////// LOCALSTORAGE CHECK /////////////////////////
				//*****************************************************************//

					var storage = !!function() {
					  var result,
						  uid = +new Date;
					  try {
						localStorage.setItem(uid, uid);
						result = localStorage.getItem(uid) == uid;
						localStorage.removeItem(uid);
						return result;
					  } catch(e) {}
					}() && localStorage;
									
				//*****************************************************************//
				/////////////////////////// SET/GET KEYS ////////////////////////////
				//*****************************************************************//
					
					if(storage && o_localStorage){  
						var keySettings    = 'jarvisWidgets_settings_'+location.pathname+'_'+objId;
						var getKeySettings = localStorage.getItem(keySettings);
							
						var keyPosition    = 'jarvisWidgets_position_'+location.pathname+'_'+objId;
						var getKeyPosition = localStorage.getItem(keyPosition);
					}
				
				//*****************************************************************//
				/////////////////////////////// INIT ////////////////////////////////
				//*****************************************************************//
		
					/**
					* Force users to use an id(it's needed for the local storage).
					**/
				    if(!objId.length){
						alert('It looks like your using a class instead of an ID, dont do that!')	
					}
					
					/**
					* Add RTL support.
					**/
					if(o_rtl === true){
						$('body').addClass('rtl');
					}
					
					/**
					* This will add an extra class that we use to store the
					* widgets in the right order.(savety)
					**/
					$(o_grid).each(function(){
						if($(this).children(o_widgetClass).length){
							$(this).addClass('sortable-grid');	
						}
					});
					
					/**
					* Check for touch support and set right click events.
					**/
					if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch){
						var clickEvent = 'click tap';	
					}else{
						var clickEvent = 'click';	
					}
					
				//*****************************************************************//
				//////////////////////// SET POSITION WIDGET ////////////////////////
				//*****************************************************************//						
						   
					/**	
					* Run if data is present.
					**/
					if(storage && o_localStorage && getKeyPosition){
							
						var jsonPosition = JSON.parse(getKeyPosition);
						
						/**	
						* Loop the data, and put every widget on the right place.
						**/	
						for(var key in jsonPosition.grid){
							var changeOrder = obj.find(o_grid+'.sortable-grid').eq(key);
							 for(var key2 in jsonPosition.grid[key].section){								
								changeOrder.append($('#'+jsonPosition.grid[key].section[key2].id));
							}
						}

					}

				//*****************************************************************//
				/////////////////////// SET SETTINGS WIDGET /////////////////////////
				//*****************************************************************//						
		   
					/**	
					* Run if data is present.
					**/
					if(storage && o_localStorage && getKeySettings){
							
						var jsonSettings = JSON.parse(getKeySettings);
						
						/**	
						* Loop the data and hide/show the widgets and set the inputs in
						* panel to checked(if hidden) and add an indicator class to the div.
						* Loop all labels and update the widget titles.
						**/			
						for(var key in jsonSettings.widget){
							var widgetId = $('#'+jsonSettings.widget[key].id);
							
							/**	
							* Set a style(if present).
							**/	
							if(jsonSettings.widget[key].style){		
								widgetId
								.addClass(jsonSettings.widget[key].style)
								.attr('data-widget-attstyle',''+jsonSettings.widget[key].style+'');
							}
							
							/**	
							* Hide/show widget.
							**/			
							if(jsonSettings.widget[key].hidden == 1){
								widgetId.hide(1);
							}else{
								widgetId.show(1).removeAttr('data-widget-hidden');				
							}
							
							/**	
							* Toggle content widget.
							**/	
							if(jsonSettings.widget[key].collapsed == 1){
								widgetId
								.addClass('jarviswidget-collapsed')
								.children('div')
								.hide(1);
							}
							
							/**	
							* Update title widget (if needed).
							**/	
							if(widgetId.children('header').children('h2').text() != jsonSettings.widget[key].title){	
								widgetId
								.children('header')
								.children('h2')
								.text(jsonSettings.widget[key].title);
							}	
						}
					}
					
				//*****************************************************************//
				////////////////////////// LOOP AL WIDGETS //////////////////////////
				//*****************************************************************//
					
					/**
					* This will add/edit/remove the settings to all widgets
					**/
					widget.each(function(){
						
						var thisHeader = $(this).children('header');
						
						/**
						* Hide the widget if the dataset 'widget-hidden' is set to true.
						**/
						if($(this).data('widget-hidden') === true){
							$(this).hide();
						}	
										
						/**
						* Hide the content of the widget if the dataset 
						* 'widget-collapsed' is set to true.
						**/
						if($(this).data('widget-collapsed') === true){
							$(this)
							.addClass('jarviswidget-collapsed')
							.children('div')
							.hide();
						}
											
						/**
						* Check for the dataset 'widget-icon' if so get the icon 
						* and attach it to the widget header.
						**/
						if($(this).data('widget-icon')){						
							thisHeader
							.prepend('<span class="jarviswidget-icon"/>')
							.children()
							.addClass($(this).data('widget-icon'));
						}
												
						/**
						* Add a delete button to the widget header (if set to true).
						**/
						if(o_allowCustom === true && $(this).data('widget-custombutton') === undefined){	
							var customBtn = '<a href="#" class="button-icon jarviswidget-custom-btn"><span class="'+o_customClass[0]+'"></span></a>';
						}else{
							    customBtn = '';
						}
						
						/**
						* Add a delete button to the widget header (if set to true).
						**/
						if(o_allowDelete === true && $(this).data('widget-deletebutton') === undefined){	
							var deleteBtn = '<a href="#" class="button-icon jarviswidget-delete-btn"><span class="'+o_deleteClass+'"></span></a>';
						}else{
							    deleteBtn = '';
						}
						
						/**
						* Add a delete button to the widget header (if set to true).
						**/
						if(o_allowEdit === true && $(this).data('widget-editbutton') === undefined){	
							var editBtn = '<a href="#" class="button-icon jarviswidget-edit-btn"><span class="'+o_editClass[0]+'"></span></a>';
						}else{
							    editBtn = '';
						}
						
						/**
						* Add a delete button to the widget header (if set to true).
						**/
						if(o_allowFullscreen === true && $(this).data('widget-fullscreenbutton') === undefined){	
							var fullscreenBtn = '<a href="#" class="button-icon jarviswidget-fullscreen-btn"><span class="'+o_fullscreenClass[0]+'"></span></a>';
						}else{
							    fullscreenBtn = ''; 
						}
																	
						/**
						* Add a toggle button to the widget header (if set to true).
						**/
						if(o_allowToggle === true && $(this).data('widget-togglebutton') === undefined){	
							if($(this).data('widget-collapsed') === true || $(this).hasClass('jarviswidget-collapsed')){
								var toggleSettings = o_toggleClass[1];
							}else{
								    toggleSettings = o_toggleClass[0];
							}
							var toggleBtn = '<a href="#" class="button-icon jarviswidget-toggle-btn"><span class="'+toggleSettings+'"></span></a>';
						}else{
							    toggleBtn = '';							
						}
						
						/**
						* Add a refresh button to the widget header (if set to true).
						**/
                        if(o_refreshButton === true && $(this).data('widget-refreshbutton') != false && $(this).data('widget-load')){
							var refreshBtn = '<a href="#" class="button-icon jarviswidget-refresh-btn"><span class="'+o_refreshButtonClass+'"></span></a>';	
						}else{
							    refreshBtn = '';
						}
						
						/**
						* Set the buttons order.
						**/
						var formatButtons = o_buttonOrder
											.replace(/%refresh%/g, refreshBtn)
										    .replace(/%delete%/g, deleteBtn)
										    .replace(/%custom%/g, customBtn)
										    .replace(/%fullscreen%/g, fullscreenBtn)
										    .replace(/%edit%/g, editBtn)
										    .replace(/%toggle%/g, toggleBtn); 
						
						/**
						* Add a button wrapper to the header.
						**/
						if(refreshBtn != '' || deleteBtn != '' || customBtn != '' || fullscreenBtn != '' || editBtn != '' || toggleBtn != ''){
							thisHeader.append('<div class="jarviswidget-ctrls">'+formatButtons+'</div>');
						}
						
						/**
						* Adding a helper class to all sortable widgets, this will be 
						* used to find the widgets that are sortable, it will skip the widgets 
						* that have the dataset 'widget-sortable="false"' set to false.
						**/
						if(o_allowSortable === true && $(this).data('widget-sortable') === undefined){
							$(this).addClass('jarviswidget-sortable');
						}
											
						/**
						* If the edit box is present copy the title to the input.
						**/
						if($(this).find(o_editPlaceholder).length){
							$(this)
							.find(o_editPlaceholder)
							.find('input')
							.val(thisHeader.children('h2').text());	
						}

						/**
						* Adding roles to some parts.
						**/
						$(this)
						.attr('role','widget')
						.children('div')
						.attr('role','content')
						.prev('header')
						.attr('role','heading')
						.children('div')
						.attr('role','menu');
					});
					
				//*****************************************************************//
				////////////////////////// BUTTONS VISIBLE //////////////////////////
				//*****************************************************************//
	
					/**
					* Show and hide the widget control buttons, the buttons will be 
					* visible if the users hover over the widgets header. At default the 
					* buttons are always visible.
					**/
					if(o_buttonsHidden === true){
						
						/**
						* Hide all buttons.
						**/
						$(pwCtrls).hide();
						
						/**
						* Show and hide the buttons.
						**/
						widgetHeader.hover(function(){
							$(this)
							.children(pwCtrls)
							.stop(true, true)
							.fadeTo(100,1.0);
						},function(){
							$(this)
							.children(pwCtrls)
							.stop(true, true)
							.fadeTo(100,0.0);		
						});
					}

				//*****************************************************************//
				///////////////////////// PRELOADER FUNCTION ////////////////////////
				//*****************************************************************//
				
					/**
					* Prepend the image to the widget header.
					**/
					widgetHeader.append('<span class="jarviswidget-loader"/>');
					
					/**
					* Function for the indicator image.
					**/
					function runLoaderWidget(elm){
						if(o_indicator === true){
						  elm
						  .parents(o_widgetClass)
						  .find('.jarviswidget-loader')
						  .stop(true, true)
						  .fadeIn(100)
						  .delay(o_indicatorTime)
						  .fadeOut(100);	
						}
					}

				//*****************************************************************//
				/////////////////////////// TOGGLE WIDGETS //////////////////////////
				//*****************************************************************//
								 
					/**
					* Allow users to toggle the content of the widgets.
					**/
					widget.on(clickEvent, '.jarviswidget-toggle-btn', function(e){
						
						/**						
						* Run function for the indicator image.
						**/
						runLoaderWidget($(this));

						/**
						* Change the class and hide/show the widgets content.
						**/ 	
						if($(this).parents(o_widgetClass).hasClass('jarviswidget-collapsed')){
							$(this)
							.children()
							.removeClass(o_toggleClass[1])
							.addClass(o_toggleClass[0])							
							.parents(o_widgetClass)
							.removeClass('jarviswidget-collapsed')
							.children('div:first')
							.slideDown(o_toggleSpeed, function(){
								saveSettingsWidget();
							});
						}else{
							$(this)
							.children()
							.removeClass(o_toggleClass[0])
							.addClass(o_toggleClass[1])
							.parents(o_widgetClass)
							.addClass('jarviswidget-collapsed')
							.children('div:first')
							.slideUp(o_toggleSpeed, function(){
								saveSettingsWidget();
							});
						}
						
						/**	
						* Run the callback function.
						**/	
						if(typeof options.onToggle == 'function'){
							options.onToggle.call(this);
						}
					
						e.preventDefault();
					});
					
				//*****************************************************************//
				///////////////////////// FULLSCREEN WIDGETS ////////////////////////
				//*****************************************************************//
			 
					/**
					* Set fullscreen height function.
					**/	
					function heightFullscreen(){
						if($('#jarviswidget-fullscreen-mode').length){
						 
							/**						
							* Setting height variables.
							**/
							var heightWindow  = $(window).height();
							var heightHeader  = $('#jarviswidget-fullscreen-mode').find(o_widgetClass).children('header').height();

							/**						
							* Setting the height to the right widget.
							**/
							$('#jarviswidget-fullscreen-mode')
							.find(o_widgetClass)
							.children('div')
							.height( heightWindow - heightHeader - o_fullscreenDiff );
						}
					}
						
					/**
					* On click go to fullscreen mode.
					**/
					widget.on(clickEvent,'.jarviswidget-fullscreen-btn', function(e){

						var thisWidget        = $(this).parents(o_widgetClass);
						var thisWidgetContent = thisWidget.children('div');
						
						/**						
						* Run function for the indicator image.
						**/
						runLoaderWidget($(this));
						
						/**						
						* Wrap the widget and go fullsize.
						**/
						if($('#jarviswidget-fullscreen-mode').length){
							
							/**						
							* Remove class from the body.
							**/
							$('.nooverflow').removeClass('nooverflow');	
							
							/**						
							* Unwrap the widget, remove the height, set the right 
							* fulscreen button back, and show all other buttons.
							**/
							thisWidget
							.unwrap('<div>')
							.children('div')
							.removeAttr('style')
							.end()
							.find('.jarviswidget-fullscreen-btn')
							.children()
							.removeClass(o_fullscreenClass[1])
							.addClass(o_fullscreenClass[0])
							.parents(pwCtrls)
							.children('a')
							.show();

							/**						
							* Reset collapsed widgets.
							**/
							if(thisWidgetContent.hasClass('jarviswidget-visible')){
								thisWidgetContent.hide().removeClass('jarviswidget-visible');
							}
							
						}else{
							
							/**						
							* Prevent the body from scrolling.
							**/
							$('body').addClass('nooverflow');
							
							/**						
							* Wrap, append it to the body, show the right button
							* and hide all other buttons.
							**/
							thisWidget
							.wrap('<div id="jarviswidget-fullscreen-mode"/>')
							.parent()
							.find('.jarviswidget-fullscreen-btn')
							.children()
							.removeClass(o_fullscreenClass[0])
							.addClass(o_fullscreenClass[1])
							.parents(pwCtrls)
							.children('a:not(.jarviswidget-fullscreen-btn)')
							.hide();
							
							/**						
							* Show collapsed widgets.
							**/
							if(thisWidgetContent.is(':hidden')){
								thisWidgetContent
								.show()
								.addClass('jarviswidget-visible');
							}
						}
						
						/**	
						* Run the set height function.
						**/	
						heightFullscreen();

						/**	
						* Run the callback function.
						**/	
						if(typeof options.onFullscreen == 'function'){
							options.onFullscreen.call(this);
						}								

						e.preventDefault();
					});
											
					/**	
					* Run the set fullscreen height function when the screen resizes.
					**/	
					$(window).resize(function(){
						
						/**	
						* Run the set height function.
						**/	
						heightFullscreen();
					});

				//*****************************************************************//
				//////////////////////////// EDIT WIDGETS ///////////////////////////
				//*****************************************************************//
							 
					/**
					* Allow users to show/hide a edit box.
					**/
					widget.on(clickEvent,'.jarviswidget-edit-btn', function(e){
						
						/**						
						* Run function for the indicator image.
						**/
						runLoaderWidget($(this));
						
						/**						
						* Show/hide the edit box.
						**/
						if($(this).parents(o_widgetClass).find(o_editPlaceholder).is(':visible')){
							$(this)
							.children()
							.removeClass(o_editClass[1])
							.addClass(o_editClass[0])
							.parents(o_widgetClass)
							.find(o_editPlaceholder)	
							.slideUp(o_editSpeed,function(){
								saveSettingsWidget();
							});	
						}else{
							$(this)
							.children()
							.removeClass(o_editClass[0])
							.addClass(o_editClass[1])
							.parents(o_widgetClass)
							.find(o_editPlaceholder)	
							.slideDown(o_editSpeed);	
						}
						
						/**	
						* Run the callback function.
						**/	
						if(typeof options.onEdit == 'function'){
							options.onEdit.call(this);
						}								

						e.preventDefault();
					});
					
					/**
					* Update the widgets title by using the edit input.
					**/
					$(o_editPlaceholder).find('input').keyup(function(){
						$(this)
						.parents(o_widgetClass)
						.children('header')
						.children('h2')
						.text($(this).val());
					});
					
					/**
					* Set a custom style.
					**/
					widget.on(clickEvent,'[data-widget-setstyle]', function(e){
						
						var val    = $(this).data('widget-setstyle');
						var styles = '';
						
						/**
						* Get all other styles, in order to remove it.
						**/
						$(this).parents(o_editPlaceholder).find('[data-widget-setstyle]').each(function(){
							styles += $(this).data('widget-setstyle')+' ';
						});

						/**
						* Set the new style.
						**/
						$(this).parents(o_widgetClass).attr('data-widget-attstyle', ''+val+'').removeClass(styles).addClass(val);
						
						/**						
						* Run function for the indicator image.
						**/
						runLoaderWidget($(this));
						
						/**						
						* Lets save the setings.
						**/						
						saveSettingsWidget();	
						
						e.preventDefault();
					});	
						
				//*****************************************************************//
				/////////////////////////// CUSTOM ACTION ///////////////////////////
				//*****************************************************************//
								 
					/**
					* Allow users to show/hide a edit box.
					**/
					widget.on(clickEvent,'.jarviswidget-custom-btn', function(e){

						/**						
						* Run function for the indicator image.
						**/
						runLoaderWidget($(this));
						
						/**						
						* Start and end custom action.
						**/
						if($(this).children('.'+o_customClass[0]).length){
							$(this)
							.children()
							.removeClass(o_customClass[0])
							.addClass(o_customClass[1]);						
							
							/**	
							* Run the callback function.
							**/	
							if(typeof options.customStart == 'function'){
								options.customStart.call(this);
							}
						}else{
							$(this)
							.children()
							.removeClass(o_customClass[1])
							.addClass(o_customClass[0]);

							/**	
							* Run the callback function.
							**/	
							if(typeof options.customEnd == 'function'){
								options.customEnd.call(this);
							}					
						}
							
						/**						
						* Lets save the setings.
						**/	
						saveSettingsWidget();							

						e.preventDefault();
					});

				//*****************************************************************//
				/////////////////////////// DELETE WIDGETS //////////////////////////
				//*****************************************************************//
								 
					/**
					* Allow users to delete the widgets.
					**/
					widget.on(clickEvent,'.jarviswidget-delete-btn', function(e){

						var removeId = $(this).parents(o_widgetClass).attr('id');
						var widTitle = $(this).parents(o_widgetClass).children('header').children('h2').text();
						
						/**
						* Delete the widgets with a confirm popup.
						**/
						var cleared = confirm(o_labelDelete+' "'+widTitle+'"');
						if(cleared){ 	
							
							/**						
							* Run function for the indicator image.
							**/
							runLoaderWidget($(this));
							
							/**						
							* Delete the right widget.
							**/
							$('#'+removeId).fadeOut(o_deleteSpeed, function(){
								
								$(this).remove();
								
								/**	
								* Run the callback function.
								**/	
								if(typeof options.onDelete == 'function'){
									options.onDelete.call(this);
								}								
							});
						}
					
						e.preventDefault();
					});
						
				//******************************************************************//
				////////////////////////////// SORTABLE //////////////////////////////
				//******************************************************************//
		
					/**
					* jQuery UI soratble, this allows users to sort the widgets. 
					* Notice that this part needs the jquery-ui core to work.
					**/
					if(o_allowSortable === true){
						var sortItem = obj.find('.sortable-grid').not('[data-widget-excludegrid]');
						
						sortItem.sortable({
							items:                sortItem.find('.jarviswidget-sortable').not(''),
							connectWith:          sortItem,
							placeholder:          o_placeholderClass,
							cursor:               'move',
							revert:               true, 
							opacity:              o_opacity,
							delay:                200,
							cancel:               '.button-icon, #jarviswidget-fullscreen-mode > div',
							zIndex:               10000,
							handle:               o_dragHandle,
							forcePlaceholderSize: true,
							forceHelperSize:      true,
							stop: function(event, ui){
								/* run pre-loader in the widget */
								runLoaderWidget(ui.item.children());	
								/* store the positions of the plugins */
								savePositionWidget();
							}
						});	
					}
	
				//******************************************************************//
				//////////////////////////////// AJAX ////////////////////////////////
				//******************************************************************//
					
					/**
					* This will be used to load files in to a widget. 
					* It has a refresh button, and a timestamp.
					**/
					if(o_allowAjax === true){
						
						/**
						* This function sets an fixed timestamp.
						**/
						function getPastTimestamp(t) {
							var da = new Date(t);
							
							/**
							* Get and set the date and time.
							**/
							tsMonth   = da.getMonth() + 1;// index based
							tsDay     = da.getDate();
							tsYear    = da.getFullYear();
							tsHours   = da.getHours();
							tsMinutes = da.getMinutes();
							tsSeconds = da.getUTCSeconds();
							
							/**
							* Checking for one digit values, if so add an zero.
							**/
							if(tsMonth   < 10) { var tsMonth   = '0'+tsMonth   }
							if(tsDay     < 10) { var tsDay     = '0'+tsDay     }
							if(tsHours   < 10) { var tsHours   = '0'+tsHours   }
							if(tsMinutes < 10) { var tsMinutes = '0'+tsMinutes }
							if(tsSeconds < 10) { var tsSeconds = '0'+tsSeconds }
							
							/**
							* The output, how you want it.
							**/
							var format = o_timestampFormat
										 .replace(/%d%/g, tsDay)
										 .replace(/%m%/g, tsMonth)
										 .replace(/%y%/g, tsYear) 
										 .replace(/%h%/g, tsHours)
										 .replace(/%i%/g, tsMinutes)
										 .replace(/%s%/g, tsSeconds); 

							return format;
						}

						/**			
						* Create a ajax load function.
						**/
						function loadAjaxFile(awidget, file, loader, timestamp, refreshbutton){		
							awidget.find('.jarviswidget-ajax-placeholder').load(file, function(response, status, xhr){
								
								/**
								* If action runs into an error display an error msg.
								**/
								if(status == "error"){
								  $(this).html('<div class="inner-spacer">'+o_labelError + '<b>'+xhr.status + " " + xhr.statusText+'</b></div>');
								}
								
								/**
								* Run if there are no errors.
								**/
								if(status == "success"){
									
									/**	
									* Show a timestamp.
									**/	
                                    var aPalceholder = $(this).parents(o_widgetClass).find(o_timestampPlaceholder);
									
									if(aPalceholder.length){
										aPalceholder.html(getPastTimestamp(new Date()));
									}

									/**	
									* Run the callback function.
									**/	
									if(typeof options.afterLoad == 'function'){
										options.afterLoad.call(this);
									}
								}
							});
 
							/**
							* Run function for the indicator image.
							**/
							runLoaderWidget(loader);
							
							return true;										
						}
						
						/**
						* Loop all ajax widgets.
						**/
						obj.find('[data-widget-load]').each(function(){
							
							/**	
							* AJAX Variables.
							**/
							var thisItem       = $(this);
							var pathToFile     = thisItem.data('widget-load');
							var showTimestamp  = thisItem.data('widget-timestamp');
							var refreshButton  = thisItem.data('widget-refreshbutton');
							var reloadTime     = thisItem.data('widget-refresh') * 1000;								
							var ajaxLoader     = thisItem.children();
							
							/**	
							* Append a AJAX placeholder.
							**/
							thisItem.children('div:first').append('<div class="jarviswidget-ajax-placeholder"><span style="margin:10px">'+o_loadingLabel+'</span></div>');
							
							/**	
							* Run the ajax function.
							**/
							loadAjaxFile(thisItem, pathToFile, thisItem, showTimestamp, refreshButton);
							
							/**	
							* If widget has a reload time refresh the widget, if the value
							* has been set to 0 dont reload.
							**/
							if(thisItem.data('widget-refresh') > 0){
								
								/**	
								* Set an interval to reload the content every XXX seconds.
								**/
								setInterval(function(){	loadAjaxFile(thisItem, pathToFile, ajaxLoader, showTimestamp, refreshButton) },reloadTime);
							}else{
								
								/**	
								* Load the content just once.
								**/
								loadAjaxFile(thisItem, pathToFile, ajaxLoader, showTimestamp, refreshButton);
							}											
						});
						
						/**	
						* Refresh ajax upon clicking refresh link.
						**/
						widget.on(clickEvent, '.jarviswidget-refresh-btn', function(e){
							
							/**	
							* AJAXBAR Variables.
							**/
							var rItem           = $(this).parents(o_widgetClass);
							var pathToFile2     = rItem.data('widget-load');							
							var ajaxLoader2     = rItem.children();	
							var showTimestamp2  = rItem.data('widget-timestamp');
							var refreshButton2  = rItem.data('widget-refreshbutton');
							
							/**					
							* Run the ajax function.
							**/
							loadAjaxFile(rItem, pathToFile2, ajaxLoader2, showTimestamp2,refreshButton2);
							
							e.preventDefault();							
						});			
					}	
							
				//*****************************************************************//
				///////////////////// DELETE LOCAL STORAGE KEYS /////////////////////
				//*****************************************************************//	

					/**	
					* Delete the settings key.
					**/
					$('body').on(clickEvent, o_deleteSettingsKey, function(e){
						if(storage && o_localStorage){
							var cleared = confirm(o_settingsKeyLabel);
							if(cleared){ 					
								localStorage.removeItem(keySettings);
							}
						}
						e.preventDefault();		
					});
					
					/**	
					* Delete the position key.
					**/
					$('body').on(clickEvent, o_deletePositionKey,function(e){
						if(storage && o_localStorage){
							var cleared = confirm(o_positionKeyLabel);
							if(cleared){ 					
								localStorage.removeItem(keyPosition);
							}
						}
						e.preventDefault();		
					});	
					
				//*****************************************************************//
				///////////////////////// CREATE NEW KEYS  //////////////////////////
				//*****************************************************************//	
				
					/**
					* Create new keys if non are present.
					**/
                    if(storage && o_localStorage){ 
					
						/**
						* If the local storage key (keySettings) is empty or 
						* does not excite, create one and fill it.
						**/	
						if(getKeySettings === null || getKeySettings.length < 1){
							saveSettingsWidget();					
						}
	
						/**
						* If the local storage key (keyPosition) is empty or 
						* does not excite, create one and fill it.
						**/		
						if(getKeyPosition === null || getKeyPosition.length < 1){					
							savePositionWidget();					
						}
					}
					
				//*****************************************************************//
				/////////////////// SAVE SETTINGS WIDGET FUNCTION ///////////////////
				//*****************************************************************//		
					
					/**	
					* Function to save the stettings of the widgets.
					**/
					function saveSettingsWidget(){	
						if(storage && o_localStorage){ 
							var storeSettings = [];
							
							obj.find(o_widgetClass).each(function(){
								var storeSettingsStr          = {};
								storeSettingsStr['id']        = $(this).attr('id');
								storeSettingsStr['style']     = $(this).attr('data-widget-attstyle');
								storeSettingsStr['title']     = $(this).children('header').children('h2').text();
								storeSettingsStr['hidden']    = ($(this).is(':hidden') ? 1 : 0);
								storeSettingsStr['collapsed'] = ($(this).hasClass('jarviswidget-collapsed') ? 1 : 0);
								storeSettings.push(storeSettingsStr);
							});	
								
							var storeSettingsObj = JSON.stringify( {'widget':storeSettings} );
		
							/* Place it in the storage(only if needed) */
							if(getKeySettings != storeSettingsObj){
								localStorage.setItem(keySettings, storeSettingsObj); 
							}
						}
					}
									
				//*****************************************************************//
				/////////////////// SAVE POSITION WIDGET FUNCTION ///////////////////
				//*****************************************************************//
								
					/**	
					* Function to save the positions of the widgets.
					**/
					function savePositionWidget(){
						if(storage && o_localStorage){ 
							var mainArr = [];
							
							obj.find(o_grid+'.sortable-grid').each(function(){
								var subArr = [];
								$(this).children(o_widgetClass).each(function(){
									var subObj   = {};
									subObj['id'] = $(this).attr('id');
									subArr.push(subObj);
								});
								var out = {'section':subArr}
								mainArr.push(out);
							});	
								
							var storePositionObj = JSON.stringify( {'grid':mainArr} );
	
							/* Place it in the storage(only if needed) */
							if(getKeyPosition != storePositionObj){
								localStorage.setItem(keyPosition, storePositionObj); 
							}
						}
					}
			});		
		};
		
		/**
		* Default settings(dont change).
		* You can globally override these options
		* by using $.fn.pluginName.key = 'value';
		**/
		$.fn.jarvisWidgets.options = {
			grid: '',
			widgets: '.jarviswidget',
			localStorage: true,
			deleteSettingsKey: '',
			settingsKeyLabel: 'Reset settings?',
			deletePositionKey: '',
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
			editPlaceholder: '',
			editClass: 'pencil-10 | delete-10',
			editSpeed: 200,
			onEdit: function(){},
			fullscreenButton: true,
			fullscreenClass: 'fullscreen-10 | normalscreen-10',	
			fullscreenDiff: 3,		
			onFullscreen: function(){},
			customButton: true,
			customClass: '',
			customStart: function(){},
			customEnd: function(){},
			buttonOrder: '%refresh% %delete% %custom% %edit% %fullscreen% %toggle%',
			opacity: 1.0,
			dragHandle: '> header',
			placeholderClass: 'jarviswidget-placeholder',
			indicator: true,
			indicatorTime: 600,
			ajax: true,
			loadingLabel: 'loading...',
			timestampPlaceholder: '',
			timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
			refreshButton: true,
			refreshButtonClass: 'refresh-10',
			labelError:'Sorry but there was a error:',
			labelUpdated: 'Last Update:',
			labelRefresh: 'Refresh',
			labelDelete: 'Delete widget:',
			afterLoad: function(){},
			rtl: false					
		};
		
})(jQuery, window, document);
