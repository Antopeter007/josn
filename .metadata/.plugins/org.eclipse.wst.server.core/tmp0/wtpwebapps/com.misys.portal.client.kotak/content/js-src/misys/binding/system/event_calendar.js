dojo.provide("misys.binding.system.event_calendar");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.FilteringSelect");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	// Private functions & variables
	
	function _localizeDisplayDate( /*dijit._Widget*/ dateField) {
		//  summary:
	    //        Returns a localized display date for a date field.
		//  description:
		//        Return the date of the field in a standard format, for comparison. If the field 
		//        is hidden, we convert it to a standardized format for comparison, otherwise we 
		//        simply return the value.
		
		if(dateField.get("type") === "hidden") {
			return d.date.locale.format(m.localizeDate(dateField), {
				selector :"date"
			});
		}
		
		return dateField.get("displayedValue");
	}
	
	function _validateStartDate() {
		//  summary:
	    //        Validates the data entered as the start Date.
	    // 
	    
	   // This validation is for non-required fields
		if(!this.get("value")) {
			return true;
		}
		
		console.debug("[misys.validation.common] Validating Start Date. Value = ",
				this.get("value"));

		// Test that the start date is smaller than or equal to
		// the end date
		var displayMessage = '';
		var startDate = dj.byId("start_date");
		var endDate = dj.byId("end_date");
		if(!m.compareDateFields(this, endDate)) {

			displayMessage = m.getLocalization("startDateGreaterThanEndDateError", [_localizeDisplayDate(startDate),_localizeDisplayDate(endDate)]);
			startDate.set("state", "Error");
			dijit.hideTooltip(startDate.domNode);
			dijit.showTooltip(displayMessage,startDate.domNode, 0);
			return false;
		}

		return true;
	}
	
	function _validateEndDate() {
		//  summary:
	    //        Validates the data entered as the end Date.
	    // 
	
		// This validation is for non-required fields
		if(!this.get("value")) {
			return true;
		}
		
		console.debug("[misys.validation.common] Validating End Date. Value = ",
				this.get("value"));
		
		var displayMessage = '';
		var startDate = dj.byId("start_date");
		var endDate = dj.byId("end_date");
		if(!m.compareDateFields(startDate, this)) {
			displayMessage = m.getLocalization("endDateLessThanStartDateError", [_localizeDisplayDate(endDate),_localizeDisplayDate(startDate)]);
			endDate.set("state", "Error");
			dijit.hideTooltip(endDate.domNode);
			dijit.showTooltip(displayMessage,endDate.domNode, 0);
			return false;
		}
		return true;
	}
	
	
	
	//Function to validate values selected as part of creating recurring date event. 
	function _validateRecurringDateEventValues()
	{
		var startDate = dijit.byId('start_date').get('displayedValue');
		var endDate = dijit.byId('end_date').get('displayedValue');
		var dayOfWeek = dijit.byId('day_of_week').get('value'); 
		var dayOfMonth = dijit.byId('day_of_month').get('value');
		var weeklyOrMonthly = false;
		var status = true;
		var field = dijit.byId('day_of_month');
		
		if(dijit.byId('date_recursive_type_2') && dijit.byId('date_recursive_type_2').checked)
		{
			field = dijit.byId('day_of_week');
			weeklyOrMonthly = true;
		}

		if(startDate !== "" && endDate !== "" && (dayOfWeek !== "" || dayOfMonth !== "")){
			m.xhrPost({
				url : m.getServletURL("/screen/AjaxScreen/action/ValidateRecurringCalendarDateEvent"),
				handleAs 	: "json",
				sync 		: true,
				content : {
					startDate : startDate,
					endDate : endDate,
					dayOfWeek : dayOfWeek,
					dayOfMonth : dayOfMonth,
					isWeekly : weeklyOrMonthly
				},
				load : function(response, args){
					if(response.valid === false){
						field.invalidMessage = m.getLocalization("invalidEventDate", [field.displayedValue]);
						status = false;
					}
				}
			});
		}
		return status;
	}
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			var timeoutInMs = -1,
		  	setter = "";
			
			m.connect("end_date", "onBlur", _validateEndDate);
			m.connect("start_date", "onBlur", _validateStartDate);
			m.setValidation("day_of_week", _validateRecurringDateEventValues);
			m.setValidation("day_of_month", _validateRecurringDateEventValues);
			
			if(dj.byId("date_type_1")){
				m.connect("date_type_1", "onChange", function(){
					m.toggleFields(this.get("checked"), ["evt_date"],["evt_date"]);
					if (dj.byId("date_type_1").get("checked")){
						m.animate("fadeOut", d.byId("recursive_event_div"));
						dj.byId("date_recursive_type").reset();
					}
					if(dj.byId("date_type_2").get("checked") && dj.byId("date_recursive_type_3").get("checked")){
						dj.byId("day_of_month").set("disabled", false);
						dj.byId("day_of_month").set("required", true);
					}else{
						dj.byId("day_of_month").set("required", false);
						dj.byId("day_of_month").set("disabled", true);
					}
				});
			}
			if(dj.byId("date_recursive_type_1")){
				m.connect("date_recursive_type_1", "onChange", function(){
					if (dj.byId("date_recursive_type_1").get("checked")){
						dj.byId("date_recursive_type").set("value", "01");
					}
				});
			}
			
			if(dj.byId("date_recursive_type_2")){
				m.connect("date_recursive_type_2", "onChange", function(){
					m.toggleFields(this.get("checked"), ["day_of_week"], ["day_of_week"]);
					if (dj.byId("date_recursive_type_2").get("checked")){
						dj.byId("date_recursive_type").set("value", "02");
					}
				});
			}
			
			if(dj.byId("date_recursive_type_3")){
				m.connect("date_recursive_type_3", "onChange", function(){
					m.toggleFields(this.get("checked"), ["day_of_month"], ["day_of_month"]);
					if (dj.byId("date_recursive_type_3").get("checked")){
						dj.byId("date_recursive_type").set("value", "03");
					}
					if(this.get("checked")){
						dj.byId("day_of_month").set("disabled", false);
						dj.byId("day_of_month").set("required", true);
					}else{
						dj.byId("day_of_month").set("required", false);
						dj.byId("day_of_month").set("disabled", true);
					}
				});
			}
			
			if(dj.byId("date_type_2")){
				m.connect("date_type_2", "onChange", function(){
					m.toggleFields(
							this.get("checked"), 
							["start_date", "end_date", "date_recursive_type_1",
							 "date_recursive_type_2", "date_recursive_type_3"],
							["start_date", "end_date", "date_recursive_type_1",
							 "date_recursive_type_2", "date_recursive_type_3"]);
					setter = function() {
						if(dj.byId("date_type_2").get("checked") && dj.byId("date_recursive_type_3").get("checked")){
							dj.byId("day_of_month").set("disabled", false);
							dj.byId("day_of_month").set("required", true);
							m.toggleFields((dj.byId("date_type_2").get("checked") && dj.byId("date_recursive_type_3").get("checked")),
									["day_of_month"], ["day_of_month"]);
						}else{
							dj.byId("day_of_month").set("required", false);
							dj.byId("day_of_month").set("disabled", true);
						}
					};
					timeoutInMs = 500;
					setTimeout(setter, timeoutInMs);
					
					if (dj.byId("date_type_2").get("checked")){
						m.animate("fadeIn", d.byId("recursive_event_div"));
					}
				});
			}
		},

		onFormLoad : function() {
			var timeoutInMs = -1,
			  	setter = "";
			if(dj.byId("date_type_1")){
				m.toggleFields(dj.byId("date_type_1").get("checked"), ["evt_date"], ["evt_date"]);
				var currentDate = new Date();
				currentDate.setDate(currentDate.getDate());
				dj.byId('evt_date').constraints.min = currentDate;
			}
			if(dj.byId("date_recursive_type_2")){
				m.toggleFields(dj.byId("date_recursive_type_2").get("checked"),
						["day_of_week"], ["day_of_week"]);
			}
			if(dj.byId("date_type_2")){
				m.toggleFields(
						dj.byId("date_type_2").get("checked"), 
						["start_date", "end_date", "date_recursive_type_1",
						 "date_recursive_type_2", "date_recursive_type_3"],
						["start_date", "end_date", "date_recursive_type_1",
						 "date_recursive_type_2", "date_recursive_type_3"]);
				currentDate = new Date();
				currentDate.setDate(currentDate.getDate());
				dj.byId('start_date').constraints.min = currentDate;
				dj.byId('end_date').constraints.min = currentDate;
			}
			if((dj.byId("date_type_2") && dj.byId("date_recursive_type_3"))){
				setter = function() {
					m.toggleFields((dj.byId("date_type_2").get("checked") && dj.byId("date_recursive_type_3").get("checked")),
							["day_of_month"], ["day_of_month"]);
					
				};
				timeoutInMs = 500;
				setTimeout(setter, timeoutInMs);
			}
			if(dj.byId("date_type_2")){
				if(dj.byId("date_type_2").get("checked")){
					m.animate("fadeIn", d.byId("recursive_event_div"));
				}else{
					m.animate("fadeOut", d.byId("recursive_event_div"));
				}
			}
			if(dj.byId("event_id") && dj.byId("event_id").get("value") !== ''){
				m.animate("fadeOut", d.byId("date_type_2_row"));
				m.animate("fadeOut", d.byId("date_type_1_radio_div"));
			}else if(dj.byId("occurrence_id") && dj.byId("occurrence_id").get("value") !== ''){
				m.animate("fadeOut", d.byId("date_type_1_row"));
				m.animate("fadeOut", d.byId("date_type_2_radio_div"));
			}
		},
		beforeSubmit: function(){
			if(dj.byId("date_type_1")){
				dj.byId('evt_date').focus();
			}
			if(dj.byId("date_type_2")){
				dj.byId('start_date').focus();
				dj.byId('end_date').focus();
			}
			_validateRecurringDateEventValues();
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.event_calendar_client');