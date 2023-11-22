dojo.provide("misys.calendar.Calendar");
dojo.experimental("misys.calendar.Calendar"); 
dojo.require("dojo.cache");
dojo.require("dijit.Tooltip");
dojo.require("dijit.Calendar");

dojo.declare("misys.calendar.Calendar",
        [ dijit.Calendar ],
        {
			// summary:
			//		A dynamic calendar for the main page
			//
			// description:
			//		Creates a calendar, similar to the one that pops up in form fields
			//		except in this instance MTP events will be highlighted, with details
			//		in a balloon popup.
			//
			// example:
			// |	<div dojoType='misys.calendar.MTPCalendar' monthOffset='0' style='width:100%'></div>
			//

		 templateString: dojo.cache("misys.calendar", "templates/Calendar.html"),
		 
		 tooltipTemplateString : "<span class=\'cal-event\'>{content}</span>",
		 
		 tooltipDuration : 10000,
		 
		 // Tooltips active for the current month
		 activeTooltips : [],
		 
		 // monthOffset: Integer
		 //             How many months to offset the calendar to
		 monthOffset: 0,

		 // calendarDateHasChanged: boolean
		 //	                Whether the user has changed the calendar by clicking on a next/prev date/year
		 calendarDateHasChanged: false,
		 
		 // Max number of events to show
		 eventLimit: 10,
		 
		 eventsLoaded: false,
		 
		 // TODO Find a better solution to this
		 _onDayClick: function(/*Event*/ evt){
			// summary:
			//      Handler for when user clicks a day
			// tags:
			//      protected
			for(var node = evt.target; node && !node.dijitDateValue; node = node.parentNode){
				/*jsl:pass*/
			}
			 
			if(node && !dojo.hasClass(node, "dijitCalendarDisabledDate")){
				this.set('value', node.dijitDateValue);
			}
			
			var calDate = dojo.date.locale.format(this.value, {
				selector :'date',
				datePattern : 'yyyyMMdd'
			});
			console.debug("[misys.calendar] Forwarding to Full Events screen for " + calDate);
			dojo.global.location = misys.getServletURL("/screen/FullEventsScreen?operation=LIST_FEATURES&date=" + calDate);
		 },
		 
		 postCreate: function(){
			var relatedIdBefore = 0;
			var calendarId = this.id;
			if(calendarId.indexOf('_', 1)>0){
				currentId = calendarId.substring(9, calendarId.length);
				relatedIdBefore = parseInt(currentId, 10) - 1;
				if(relatedIdBefore < 0){
					relatedIdBefore=11;
				}
			}
			if(dijit.byId('calendar_'+relatedIdBefore)){
				console.debug('[misys.calendar] Hide navigation buttons for calendar with id : ' + this.id);
				dojo.style(this.incrementMonth, "display", "none");
				dojo.style(this.decrementMonth, "display", "none");
				dojo.style(this.nextYearLabelNode, "display", "none");
				dojo.style(this.previousYearLabelNode, "display", "none");
				this.monthLabel.setAttribute("colSpan", 7);
			}
			 this.inherited(arguments);
			 if(this.monthOffset !== 0)
			 {
				this._adjustDisplay("month", this.monthOffset);
			 }
			 var onGoingTaskDIv = dojo.byId('CustomerOngoingTasksList')?true:false;
			 var internalNewsDiv= dojo.byId('InternalNewsPortlet')?true:false;
			 var outstandingChartDiv = dojo.byId('OutstandingPerProductChartPortlet')?true:false;
			 var tradeEventDiv = dojo.byId('TradeEventsGridPortlet')?true:false;
			 var accountSummaryDiv = dojo.byId("HomeAccountSummaryListPortlet")?true:false;
			 var actionRequiredDiv = dojo.byId("ActionRequiredPortlet")?true:false;
			 var opicsListBalanceDiv = dojo.byId("OpicsAccountListPortletPlusBalance")?true:false;
			 var tradecalDiv = dojo.byId("TradeCalendarPortlet")?true:false; 
			 if(!onGoingTaskDIv && !internalNewsDiv && !outstandingChartDiv && !tradeEventDiv && !accountSummaryDiv && !actionRequiredDiv && !opicsListBalanceDiv)
			 {
				 /** MPS-59116 To show the Calender on home page if customer has less/limited permissions **/ 	
				 var currentCalendar = this.id;
				 var calendarIndex;
				 if(currentCalendar.indexOf('_', 1) > 0){
					 calendarIndex = currentCalendar.substring(9, currentCalendar.length);
				 }
				 var currentCalendarId = 'calendar_'+calendarIndex;
				 if(dijit.byId(currentCalendarId)){
					 if(tradecalDiv){
						 dojo.style(currentCalendarId, "width", 0);
						 dojo.style(currentCalendarId, "position", "relative");
						 dojo.style(currentCalendarId, "left", "100%");
					 }
				 }
			 }
		 },

		 _onMonthToggle: function(/*Event*/ evt){
				// catch the event
				dojo.stopEvent(evt);
				// get the date
				var dateValue = dojo.date.locale.format(this.currentFocus, {
					selector :'date',
					datePattern : 'yyyyMM'
				});
				// open the appropriate screen.
				// test if it has a next or previous calendar ; add Milestones option to the url.
				var relatedIdNext = 0;
				var relatedIdBefore = 0;
				var calendarId = this.id;
				if(calendarId.indexOf('_', 1)>0){
					currentId = calendarId.substring(9, calendarId.length);
					relatedIdNext = parseInt(currentId, 10) + 1;
					relatedIdBefore = parseInt(currentId, 10) - 1;
					if(relatedIdNext > 11)
					{
						relatedIdNext=0;
					}
					if(relatedIdBefore < 0)
					{
						relatedIdBefore=11;
					}
				}
				
				var suffix = '&date=' + dateValue;
//				if(dijit.byId('calendar_' + relatedIdNext) || dijit.byId('calendar_' + relatedIdBefore)){
//					suffix = '&option=MILESTONE' + suffix;
//				}
				
				console.debug("[misys.calendar] Forwarding to Full Events screen for " + dateValue);
				dojo.global.location = misys.getServletURL("/screen/FullEventsScreen?operation=LIST_FEATURES" + suffix);
			},

		 _adjustDisplay: function(/*String*/ part, /*int*/ amount){
			    // summary:
				//      Moves calendar forwards or backwards by months or years
				// part:
				//      "month" or "year"
				// amount:
				//      Number of months or years
				// tags:
				//      private
		    this.calendarDateHasChanged = true;
			this.inherited(arguments);
		 },

		 _updateNextDisplay: function(currentId, dateProp, adj, nodeProp){
				var relatedIdNext = currentId + 1;
				if(dijit.byId('calendar_'+relatedIdNext)){
					this._updateNextDisplay(relatedIdNext, dateProp, adj);
					dijit.byId('calendar_'+relatedIdNext)._adjustDisplay(dateProp, adj);
				}
		 },

		 _populateGrid: function(){
				// summary:
				//      Fills in the calendar grid with each day (1-31)
				// tags:
				//      private
		 
			 	// Add event CSS and tooltips
			 	//this._populateCalendar('', '');
			 
				var month = new this.dateClassObj(this.currentFocus);
				month.setDate(1);
				var firstDay = month.getDay(),
				daysInMonth = this.dateFuncObj.getDaysInMonth(month),
				daysInPreviousMonth = this.dateFuncObj.getDaysInMonth(this.dateFuncObj.add(month, "month", -1)),
				today = null;
				if(misys && misys._config && misys._config.bankBusinessDate && misys._config.bankBusinessDate !== ""){
					var yearServer = misys._config.bankBusinessDate.substring(0,4);
					var monthServer = misys._config.bankBusinessDate.substring(5,7);
					var dateServer = misys._config.bankBusinessDate.substring(8,10);
					today = new this.dateClassObj(yearServer,monthServer - 1,dateServer);
				}
				else{
					today = new this.dateClassObj();
				}
				var dayOffset = dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
				if(dayOffset > firstDay){ 
					dayOffset -= 7; 
				}

				// Iterate through dates in the calendar and fill in date numbers and style info
				var activeDates = dojo.query(".dijitCalendarDateTemplate", this.domNode);
				activeDates.forEach(function(template, i){
					i += dayOffset;
					var date = new this.dateClassObj(month),
					number, clazz = "dijitCalendar", adj = 0;

					if(i < firstDay){
						number = daysInPreviousMonth - firstDay + i + 1;
						adj = -1;
						clazz += "Previous";
					}else if(i >= (firstDay + daysInMonth)){
						number = i - firstDay - daysInMonth + 1;
						adj = 1;
						clazz += "Next";
					}else{
						number = i - firstDay + 1;
						clazz += "Current";
					}

					if(adj){
						date = this.dateFuncObj.add(date, "month", adj);
					}
					date.setDate(number);

					if(!this.dateFuncObj.compare(date, today, "date")){
					clazz = "dijitCalendarCurrentDate " + clazz;
					}

					if(this._isSelectedDate(date, this.lang)){
						clazz = "dijitCalendarSelectedDate " + clazz;
					}

					if(this.isDisabledDate(date, this.lang)){
						clazz = "dijitCalendarDisabledDate " + clazz;
					}

					var clazz2 = this.getClassForDate(date, this.lang);
					if(clazz2){
						clazz = clazz2 + " " + clazz;
					}
					
					// Keep any event classes, if we haven't clicked on a next/prev month/year
					var eventClass = '';
					if(!this.calendarDateHasChanged && template.className.indexOf('calevent') !== -1)
					{
							eventClass = template.className.substring(template.className.indexOf('calevent'));
					}
					
					template.className = clazz + "Month dijitCalendarDateTemplate " + eventClass;
					template.dijitDateValue = date.valueOf();				// original code
					dojo.attr(template, "dijitDateValue", date.valueOf());	// so I can dojo.query() it
					var label = dojo.query(".dijitCalendarDateLabel", template)[0],
						text = date.getDateLocalized ? date.getDateLocalized(this.lang) : date.getDate();
					this._setText(label, text);
				}, this);
				
				// Fill in localized month name
				var monthNames = dojo.date.locale.getNames('months', 'wide', 'standAlone', this.lang);
				this._setText(this.monthLabelNode, monthNames[month.getMonth()]);

				// Fill in localized prev/current/next years
				var y = month.getFullYear() - 1;
				var d = new this.dateClassObj();
				dojo.forEach(["previous", "current", "next"], function(name){
					d.setFullYear(y++);
					this._setText(this[name+"YearLabelNode"],
						this.dateLocaleModule.format(d, {selector:'year', locale:this.lang}));
				}, this);
				
				dojo.query('.calendarLoader').forEach(function(d){
					dojo.replaceClass(d, '');
					});
				
				// Populate calendar	
				var _this = this;
				if(!this.eventsLoaded) {
					console.debug('[misys.calendar] Loading events for calendar with id=' + this.id);
					var onGoingTaskDIv = dojo.byId('CustomerOngoingTasksList')? true:false;
					 var internalNewsDiv= dojo.byId('InternalNewsPortlet')? true:false;
					 var outstandingChartDiv = dojo.byId('OutstandingPerProductChartPortlet')? true:false;
					 var tradeEventDiv = dojo.byId('TradeEventsGridPortlet')? true:false;
					 var accountSummaryDiv = dojo.byId("HomeAccountSummaryListPortlet")? true:false;
					 var actionRequiredDiv = dojo.byId("ActionRequiredPortlet")? true:false;
					 var opicsListBalanceDiv = dojo.byId("OpicsAccountListPortletPlusBalance")? true:false;
					 if(!onGoingTaskDIv && !internalNewsDiv && !outstandingChartDiv && !tradeEventDiv && !accountSummaryDiv && !actionRequiredDiv && !opicsListBalanceDiv)
						 {
						 if(dojo.byId("EventsPortlet"))
							 {
							 dojo.style("EventsPortlet", "width", 10);
								dojo.style("EventsPortlet", "position", "relative");
								dojo.style("EventsPortlet", "left", "100%");
							 }
						 
						 }
					var startDateLong = '';
          var endDateLong = '';
					var events = [];
		        	var deferred = misys.xhrPost( {
		        		url : misys.getServletURL("/screen/AjaxScreen/action/GetCalendarEvents"),
		        		handleAs : "json",
		        		content : {
		        			inputdate: this.currentFocus.getTime(),
		        			startdate: startDateLong,
		        			enddate: endDateLong
		        		},
		        		load : function(response, ioArgs){
		        			dojo.forEach(response.events, function(ev){
		        				events.push(ev);
		        			});
		        		}
		        	});
		        
		        	deferred.then(function(){
		        		// Destroy any existing tooltips
		        		dojo.forEach(_this.activeTooltips, function(tId)
		        			{
		        			dijit.byId(tId).destroy();
		        			});
		        		_this.activeTooltips = [];
		        		
		        		setTimeout(function(){
		        			var calendarMonth = _this.currentFocus.getMonth();
		        			activeDates.forEach(function(td){
		        				var calendarCellDate = new Date(td.dijitDateValue);
	        					 
	        					 // Don't create events or tooltips for ghosted months
	        					 if(calendarCellDate.getMonth() === calendarMonth)
	        					 {
	        						// Get events for this date
	        						 var filteredEvents = dojo.filter(events, function(event) {	
	        					            return (dojo.date.compare(calendarCellDate, new Date(event.DATE), "date") === 0);
	        					     });
	        						 
	        						 if(filteredEvents.length > 0) {
	        							 var tooltipText = '';
	        							 var lastTdId = '';
	        							 // Limit number of events shown to EVENT_LIMIT
	        							 console.debug('[misys.calendar] Iterating over ' + filteredEvents.length + ' for the date ' + calendarCellDate + ' and limit ' + _this.eventLimit);
	        							 dojo.forEach(filteredEvents, function(event, i){
	        								 if(i <= _this.eventLimit)
	        								 {
	        								  // For first event, set the id and appropriate CSS class
	        								  if(i === 0) {
	        									 lastTdId = _this.id + event.DATE;
	        									 td.id = lastTdId;
	        									 td.className += ' ' + event.CSS;
	        								  }

	        								  tooltipText += event.TITLE;
	        								  if(event.REF_ID) {
	        									tooltipText += ' - ' + event.REF_ID;
	        								  }
	        								  tooltipText += '<br/>';
	        								 }
	        							 });
	        							 
	        							 if(filteredEvents.length > _this.eventLimit){
	        								 tooltipText += ' ...';
	        							 }

	        							 // Add the tooltip
	        							 var tooltipId = lastTdId + calendarCellDate.getTime();
	        							 _this.activeTooltips.push(tooltipId);
	        					    	 new dijit.Tooltip({
	        						          connectId : [lastTdId],
	        						          id: tooltipId, 
	        						          duration : _this.tooltipDuration,
	        						          label : dojo.replace(_this.tooltipTemplateString, {content: tooltipText})
	        						     });
	        						 }
	        					 }
		        			});
		        		}, 500);
		        	});
		        	this.eventsLoaded = true;
				}

				// Set up repeating mouse behavior
				var typematic = function(nodeProp, dateProp, adj){
					_this._connects.push(
						dijit.typematic.addMouseListener(_this[nodeProp], _this, function(count){
							if(count >= 0){
								var currentId = parseInt(this.id.substring(9, this.id.length), 10);
								
							    // FIXME : post update milestone view using dojo widgets.
								// stop recursive update for the moment
								_this._updateNextDisplay(currentId, dateProp, adj, nodeProp);
								_this._adjustDisplay(dateProp, adj);

								var relatedIdNext = parseInt(currentId, 10) + 1;
								var relatedIdNextPlus = parseInt(currentId, 10) + 2;
								var relatedIdBefore = parseInt(currentId, 10) - 1;
								var relatedCalendar = dijit.byId('calendar_'+relatedIdNext);

								if(relatedIdNext > 11)
								{
									relatedIdNext=0;
								}
								if(relatedIdBefore < 0)
								{
									relatedIdBefore=11;
								}
								var newDate = dojo.date.locale.format(_this.currentFocus, {
									selector :'date',
									datePattern : 'yyyyMM'
								});
								var currentMonth = new _this.dateClassObj(_this.currentFocus);
								currentMonth.setDate(1);
								var currentDate = dojo.date.locale.format(currentMonth, {
									selector :'date',
									fullYear : true
								});
								var range = 1;
								if(relatedCalendar){
									range = 3;
								}

								var endDate = dojo.date.add(currentMonth, "month", range);
								endDate = dojo.date.add(endDate, "day", -1);
								endDate = dojo.date.locale.format(endDate, {
									selector :'date',
									fullYear : true
								});
								var endPeriod = "";
								var product_code = "";
								var ref_id = "";
								var entity = "";
								// if search form exist
								if(dojo.byId('TransactionSearchForm')){
									//get search params
									product_code = dijit.byId('product_code') ? dijit.byId('product_code').get('value') : ''; 
									ref_id = dijit.byId('ref_id') ? dijit.byId('ref_id').get('value') : ''; 
									entity = dijit.byId('entity') ? dijit.byId('entity').get('value') : ''; 
									//set new date params
									if(dijit.byId('startdate') && dijit.byId('enddate'))
									{
										if(adj !== -1)
											{
												dijit.byId('enddate').set('displayedValue', currentDate);
											}
										dijit.byId('startdate').set('displayedValue', currentDate);
										dijit.byId('enddate').set('displayedValue', endDate);
									}
								}
								
								misys.grid.reloadForSearchTerms();
								
								_this.eventsLoaded = false;
								_this._populateGrid();
								if(relatedCalendar) {
									relatedCalendar.eventsLoaded = false;
									relatedCalendar._populateGrid();
									var relatedCalendarPlus = dijit.byId('calendar_'+relatedIdNextPlus);
									relatedCalendarPlus.eventsLoaded = false;
									relatedCalendarPlus._populateGrid();
								}
							}
						}, 0.8, 500));
				};
				typematic("incrementMonth", "month", 1);
				typematic("decrementMonth", "month", -1);
				typematic("nextYearLabelNode", "year", 1);
				typematic("previousYearLabelNode", "year", -1);

				this.calendarDateHasChanged = false;
			}
        } 
);