dojo.provide("misys.form.BusinessDateTextBox");
dojo.experimental("misys.form.BusinessDateTextBox");

dojo.require("misys.calendar.BusinessDatesCalendar");
dojo.require("dijit.form.DateTextBox");

	/*Widget BusinessdateDateTextBox Overrides dijit.form.DateTextBox
	Description : Input field to enter the date which also pops out a calendar 
	from which only business date can be selected*/

		
	//flag to indicate whether the response of the ajax call is error
	var _isError = false;
	
	//flag to indicate the status of the TextBox (Valid or Error state)
	var _status ;
	
	//get the currency code 
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
	//get the country code 
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
	
	//get the product code 
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
	
	//Extend dijit.form.DateTextBox
	dojo.declare(
		"misys.form.BusinessDateTextBox",
		[dijit.form.DateTextBox],
		{
			curCodeWidgetId : "",
			countryWidgetId : "",
			productCodeWidgetId : "",
			subProductCodeWidgetId : "",
			bankAbbvNameWidgetId : "",
			bankAbbvNameDynamic : "",
			postCreate: function(){
				//Call the super class 'postCreate' method 
				this.inherited(arguments);
				//make the curCodeWidgetId ,productCodeWidgetId and countryWidgetId global 
				dojo.mixin(misys, {
					curCodeWidgetId : this.curCodeWidgetId,
					countryWidgetId  : this.countryWidgetId,
					productCodeWidgetId : this.productCodeWidgetId,
					subProductCodeWidgetId : this.subProductCodeWidgetId,
					bankAbbvNameWidgetId : this.bankAbbvNameWidgetId
				});
			},
			  
			//Override the popup class dijit.Calendar with misys.calendar.BusinessDatesCalendar
			popupClass: "misys.calendar.BusinessDatesCalendar",
			
			//Overrides dijit.form.ValidationTextBox's validate method
			validate: function(/*Boolean*/ isFocused){
				
				//call super class 'validate' method
				var isValid = this.inherited(arguments);
				
				//when widget not in focus or onBlur
				if (isValid && !isFocused)
				{
					console.debug('AJAX validation now for BusinessDateTextBox');
					_status = this._fncGetDateStatus(this.get('value'));
					
					var displayMessage;
					var date = this.get('value');
					var displayedValue = "";
					//Format the date to display in the error message
					if(date)
					{
						var month = date.getMonth();
						month = month + 1;
						var year = date.getFullYear(); 
						var day = date.getDate();
						displayedValue = day +"/"+month+"/"+year;
					
						var widget = dijit.byId(this.id);
						if(this.required)
						{
							//if ajax response is not errorneous
							if(!_isError)
							{
								//if status of the widget is error
								if(!_status)
								 {
									if(widget.get("state") != "Error")
									{
										displayMessage = misys.getLocalization('dateIsHoliday', [displayedValue]);
										//focus on the widget and set state to error and display a tooltip indicating the same
										widget.set("state","Error");
										dijit.hideTooltip(this.domNode);
										dijit.showTooltip(displayMessage, this.domNode, 0);
									}
								}
							}
							//ajax response is errorneous
							else
							{
								if(widget.get("state") != "Error")
								{
									displayMessage = misys.getLocalization('holidayValidateError', [displayedValue]);
									//focus on the widget and set state to error and display a tooltip indicating the same
									widget.set("state","Error");
									dijit.hideTooltip(this.domNode);
									dijit.showTooltip(displayMessage, this.domNode, 0);
								}
								
							}
						}
					}
				}
				
				return isValid;
			  
			},
			_fncGetDateStatus : function( /* String */ currentDate)
			{
				// summary:
			    // Gets the status of the present date value enter. i.e whether it is a holiday or not
				// private
				
				//check if current date is undefined
				if(!currentDate)
				{
					return false;
				}
				
				var isValid = true;
				var objPresentDate = currentDate;
				//format the date to send through ajax
				var month = objPresentDate.getMonth();
				month = month + 1;
				var year = objPresentDate.getFullYear(); 
				var day = objPresentDate.getDate();
				var date = day +"/"+month+"/"+year;
				//AJAX Call
				misys.xhrPost( {
					url : misys.getServletURL("/screen/AjaxScreen/action/GetDateStatus"),
					sync : true,
					handleAs : "json",
					content : {
						productCode : misys._config.productCode,
						subProductCode : _subProductCode(),
						currencyCode : _currencyCode(),
						countryCode : _countryCode(),
						bankAbbvName : _bankAbbvName(),
						date : date
					},
					load : function(response, args){
						
						//Response 
						var closingDayResult = response.closingDayResult;
						_isError = false;
		
						if(closingDayResult == false)
						{
							isValid = true;
						}
						else 
						{
							isValid = false;
						}
				    },
					customError : function(response, args){
						console.error('[misys.Calendar.DateTextBox] Technical error while getting valid business day ');
						console.error(response);
						_isError = true;
					}
				});
			return isValid;
		  }
			
		}
	);
	
	