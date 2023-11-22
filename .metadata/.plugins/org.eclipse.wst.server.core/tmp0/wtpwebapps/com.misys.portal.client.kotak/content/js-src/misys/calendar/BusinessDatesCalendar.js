dojo.provide("misys.calendar.BusinessDatesCalendar");
dojo.experimental("misys.calendar.BusinessDatesCalendar");

dojo.require("dijit.Calendar");

	/*Widget BusinessDatesCalendar Overrides dijit.Calendar
	Description : calendar which pops out of the BusinessdateDateTextBox and allows user to select only
	business days and not closing days*/
	
	    //flag to indicate whether the response of the ajax call is error
		var _isError = false;
		
		// flag to indicate whether method is called or not
		//var _isExecuted = false;
		
		// variable to store min and max offset for recurring payment
//		var minOffSet = 0;
//		var maxOffSet = 0;
		
		//count for dates to disable ajax call when _isError is true
		var _countOfDates = 0;
		
		//get the currency code from the xsl page
		function _currencyCode(){
			if(dijit.byId(misys.curCodeWidgetId))
			{
				return dijit.byId(misys.curCodeWidgetId).get('value');
			}
			else
			{
				return "";
			}
		}
		//get the country code from the xsl page
		function _countryCode(){
			if(dijit.byId(misys.countryWidgetId))
			{
				return dijit.byId(misys.countryWidgetId).get('value');
			}
			else
			{
				return "";
			}
		}
		
		//get the product code or sub-product code from the xsl page
		function _productCode(){
			if(dijit.byId(misys.productCodeWidgetId))
			{
				return dijit.byId(misys.productCodeWidgetId).get('value');
			}
			else
			{
				return "";
			}
		}
		
		//get the sub product code 
		function _subProductCode(){
			if(dijit.byId(misys.subProductCodeWidgetId))
			{
				return dijit.byId(misys.subProductCodeWidgetId).get('value');
			}
			else
			{
				return "";
			}
		}
		
		//get the Bank Abbv Name
		function _bankAbbvName(){
			if(dijit.byId(misys.bankAbbvNameWidgetId))
			{
				return dijit.byId(misys.bankAbbvNameWidgetId).get('value');
			}
			else
			{
				return "";
			}
		}
			
		//Extend dijit.Calendar
		dojo.declare(
			"misys.calendar.BusinessDatesCalendar",
			[dijit.Calendar],
			{
				//method called to return a css class for each date in the calendar
				//based on the css class the date is scratched out or enabled
				getClassForDate: function(/*Date*/ dateObject, /*String?*/ locale)
				{
					//Format the date to send through ajax call
					var day = dateObject.getDate();
					var month = dateObject.getMonth();
					month = month + 1;
					var year = dateObject.getFullYear(); 
					var tempDate = dateObject;
					var convertToConfiguredDatePattern = dojo.date.locale.format(tempDate, {
						selector :'date',
						datePattern : misys.getLocalization('g_strGlobalDateFormat')
					});
					var currentDate = convertToConfiguredDatePattern;
					if(!convertToConfiguredDatePattern)
					{
						currentDate = day+"/"+month+"/"+year;
					}
					
//					var currentDate2 = new Date();
//					currentDate2.setDate(currentDate2.getDate() - 1);
//					currentDate2.setHours(1);
//					currentDate2.setMinutes(0);
//					currentDate2.setSeconds(0);
//					
//					// Recurring Date Filter : START
//					if(!_isExecuted && (this.id === 'recurring_start_date_popup') && dojo.attr('recurring_flag', 'aria-pressed'))
//					{
//						this._getRecurringDetails();
//						if(!minOffSet)
//						{
//							minOffSet = 0;
//						}
//						_isExecuted = true;
//					}
//					
//					if((this.id === 'recurring_start_date_popup') && maxOffSet)
//					{
//						var currentDateMin = new Date();
//						currentDateMin.setDate(currentDateMin.getDate() + minOffSet - 1);
//						currentDateMin.setHours(1);
//						currentDateMin.setMinutes(0);
//						currentDateMin.setSeconds(0);
//						
//						var currentDateMax = new Date();
//						currentDateMax.setDate(currentDateMax.getDate() + maxOffSet - 1);
//						currentDateMax.setHours(1);
//						currentDateMax.setMinutes(0);
//						currentDateMax.setSeconds(0);
//						
//						if(dojo.byId('widget_recurring_end_date') && dojo.attr('recurring_flag', 'aria-pressed') && !(dateObject.getTime() >= currentDateMin.getTime() && dateObject.getTime() <= currentDateMax.getTime()))
//						{
//							return "dijitCalendarDisabledDate";
//						}
//					}
//					// Recurring Date Filter : END
//					
//					// disable past dates
//					if(dateObject.getTime() < currentDate2.getTime())
//					{
//						return "dijitCalendarDisabledDate";
//					}
					
					//response flag of the ajax call
					var status = false;
					misys._config = misys._config || {};
					if(!misys._config.dateCache)
					{
						dojo.mixin(misys._config,{
							dateCache : [],
							dateStatusCache :[]
						});
					}
					
					//when date cache is empty and index of the current date in date cache is -1
					if (misys._config.dateCache.length === 0 || dojo.indexOf(misys._config.dateCache, currentDate)=== -1)
					{
						//increment count
						_countOfDates++;
						
						//previous ajax call is not errorneous
						if(!_isError)
						{
							status = this._getHolidays(currentDate);
							_countOfDates--;
						}
						//previous ajax call is errorneous
						else
						{
							//count for 30 days before making another ajax call
							if(_countOfDates == 50)
							{
								status = this._getHolidays(currentDate);
								_countOfDates = 0;
							}
						}
						//Ajax call successfull
						if(status)
						{
							if(misys._config.dateStatusCache[dojo.indexOf(misys._config.dateCache, currentDate)] == "false")
							{
								return "dijitCalendarDisabledDate";
							}
							else
							{
								return " ";
							}
						
						}
						else
						{
							return "dijitCalendarDisabledDate";
							
						}
					}
					//date cache is not empty
					else
					{
						if(misys._config.dateStatusCache[dojo.indexOf(misys._config.dateCache, currentDate)] == "false")
						{
							return "dijitCalendarDisabledDate";
						}
						else
						{
							return "";
						}
					}
						
				},
				//private
				//method to make a ajax call to query the business days
				_getHolidays : function( /*String*/ currentDate)
				{
					//  summary:
				    //         Gets the dates which are holidays between start_date and end_date.
				    //  tags:
				    //         public
					var status = true;
					misys.xhrPost( {
						url : misys.getServletURL("/screen/AjaxScreen/action/GetHolidaysForBusinessCalendar"),
						handleAs : "json",
						sync : true,
						content : {
							productCode : misys._config.productCode,
							subProductCode : _subProductCode(),
							currencyCode : _currencyCode(),
							countryCode : _countryCode(),
							bankAbbvName : _bankAbbvName(),
							date: currentDate
						},
						load : function(response, args){
							misys._config = misys._config || {};
							if(!misys._config.dateCache)
							{
								dojo.mixin(misys._config,{
									dateCache : response.calendarDays,
									dateStatusCache : response.statusCalendarDays
								});
							}
							else
							{
								misys._config.dateCache = response.calendarDays;
								misys._config.dateStatusCache = response.statusCalendarDays;
							}
							_isError = false;
							status = true;
						},
						error : function(response, args){
							console.error('[misys.Calendar.BusinessDatesCalendar] Technical error while getting holidays for Business Calendar');
							console.error(response);
							_isError = true;
							status = false;
							misys._config = misys._config || {};
							if(!misys._config.dateCache)
							{
								dojo.mixin(misys._config,{
									dateCache : [ ],
									dateStatusCache : [ ]
								});
							}
							else
							{
								misys._config.dateCache = [ ];
								misys._config.dateStatusCache = [ ];
							}
						}
					});
					if(!status){
						var domNode = this.id;
						var dateTextBoxId = domNode.replace("_popup","");
						var newDomNode = dijit.byId(dateTextBoxId).domNode;
						var displayMessage = misys.getLocalization('businessCalendarTechnicalError');
						dijit.hideTooltip(newDomNode);
						dijit.showTooltip(displayMessage, newDomNode, 0);
					}
					return status;
				}
				
				 // AJAX call to get minimum and maximum offset 
				 // Used to configure minimum and maximum offset for start date
				 // under Recurring payment
//				_getRecurringDetails : function()
//				{
//					misys.xhrPost( {
//						url : misys.getServletURL("/screen/AjaxScreen/action/GetRecurringDetails"),
//						handleAs : "json",
//						sync : true,
//						content : {
//							productCode : misys._config.productCode,
//							subProductCode : _subProductCode(),
//							bankAbbvName : _bankAbbvName()
//						},
//						load : function(response, args){
//							misys._config = misys._config || {};
//							if(!misys._config.dateCache)
//							{
//								minOffSet = response.minOffSet;
//								maxOffSet = response.maxOffSet;
//							}
//							else
//							{
//								minOffSet = response.minOffSet;
//								maxOffSet = response.maxOffSet;
//							}
//							_isError = false;
//						},
//						error : function(response, args){
//							console.error('[misys.Calendar.BusinessDatesCalendar] Technical error while getting Recurring details');
//							console.error(response);
//							_isError = true;
//							misys._config = misys._config || {};
//							if(!misys._config.dateCache)
//							{
//								dojo.mixin(misys._config,{
//									dateCache : [ ],
//									dateStatusCache : [ ]
//								});
//							}
//							else
//							{
//								misys._config.dateCache = [ ];
//								misys._config.dateStatusCache = [ ];
//							}
//						}
//					});
//				}
			}
		);
	