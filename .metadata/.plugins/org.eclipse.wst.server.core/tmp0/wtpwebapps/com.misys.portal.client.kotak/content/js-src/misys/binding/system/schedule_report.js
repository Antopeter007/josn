dojo.provide("misys.binding.system.schedule_report");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.NumberTextBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function _populateReportId() {
		//  summary:
	    //          Populate the report ID.
		
	    dj.byId("report_id").set("value", reports[this.get("value")]);
	}

	function _displayWeekDays(/*Boolean*/ keepValue) {
		//  summary:
	    //          Displays when "weekly" is checked the top/down menu with all days of a week
		
		// check the value of the radio button	
		var daysWeekDetails = d.byId("days_week_details"),
			daysMonthDetails = d.byId("days_month_details"),
			hourDetails = d.byId("hour_details"),
			value = this.get("value"),
			callback = function(){
				m.toggleFields(value == "1", null, ["week_of_day"], keepValue);
				m.toggleFields(value == "2", null, ["day_of_month"], keepValue);
			};
		
		switch(value) {
	      // Weekly
	      case "1": 
					m.animate("fadeOut", daysMonthDetails, function(){
					m.animate("fadeIn", daysWeekDetails, callback);
					if(hasHoursPermi)
					{
						m.animate("fadeIn", hourDetails, callback);
					}
				});
	    	break;
	      // Monthly
	      case "2": 
	    	  		m.animate("fadeOut", daysWeekDetails, function(){
	    	  		m.animate("fadeIn", daysMonthDetails, callback);
	    	  		if(hasHoursPermi)
					{
						m.animate("fadeIn", hourDetails, callback);
					}
				});
	    	break;
	      default:
	    	  	  m.animate("fadeOut", daysWeekDetails, function(){
	    		  m.animate("fadeOut", daysMonthDetails, callback);	
	    		  if(hasHoursPermi)
				  {
						m.animate("fadeIn", hourDetails, callback);
				  }
			  });
	      break;
	   }
	}
	  
	// FUNCTIONS FOR RADIO BUTTONS FOR DAYS
	// Reset frequency values
	// TODO Redo for dojo
	function _changeFrequencyDay(theObj)
	{
	   	/*for(i=0;i<document.forms["fakeform1"].elements["week_of_day"].length;i++)
	   	{
			// top/down
			document.forms["fakeform1"].elements["week_of_day"].options[i].selected=false;
		}

	    document.forms["fakeform1"].elements["day_of_month"].value="";*/
	}

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
		//todo validation raise error, too much recursion when the field is hidden.
		
		//	m.setValidation("day_of_month", m.validateMonthly);
			m.setValidation("email", m.validateEmailAddr);
			m.connect("report_name", "onBlur", _populateReportId);
			m.connect("day_of_month", "onBlur", function(){
				var dayOfMonthField = dj.byId("day_of_month");
				misys._config.warningMessages = [];
				if(dayOfMonthField)
				{
					if(dayOfMonthField.get('value') > 31){
						m.showTooltip(m.getLocalization("monthDayWarningMessage"), dayOfMonthField.domNode);
						m.setFieldState(dayOfMonthField, false);
					}
					else if(dayOfMonthField.get('value') > 28){
						misys._config.warningMessages.push(m.getLocalization("monthDayWarningMessage"));
					}
				}
			});

			d.forEach(["frequency_0", "frequency_1", "frequency_2"], function(id){
				m.connect(id, "onClick", _changeFrequencyDay);
				m.connect(id, "onClick", _displayWeekDays);
			});
		},

		onFormLoad : function() {
			var frequencies = ["frequency_0", "frequency_1", "frequency_2"];

			if(dj.byId("frequency_0").get("checked")) {
				d.hitch(dj.byId("frequency_0"), _displayWeekDays, true)();
			} 
			else if(dj.byId("frequency_1").get("checked")) {
				d.hitch(dj.byId("frequency_1"), _displayWeekDays, true)();
			} 
			else if(dj.byId("frequency_2").get("checked")) {
				d.hitch(dj.byId("frequency_2"), _displayWeekDays, true)();
			}
		},

		beforeSubmitValidations : function() {
			var frequency0Checked = dj.byId("frequency_0").get("checked"),
				frequency1Checked = dj.byId("frequency_1").get("checked"),
				frequency2Checked = dj.byId("frequency_2").get("checked");
			
			if(!frequency0Checked && !frequency1Checked && !frequency2Checked) {
				m._config.onSubmitErrorMsg = m.getLocalization("mandatoryFrequenceError");
				return false;
			}
		  	else if(frequency1Checked && dj.byId("week_of_day").get("value") == "") {
		  		m._config.onSubmitErrorMsg = m.getLocalization("mandatoryDayOfWeekError");
		  		return false;
		  	}
		  	else if(frequency2Checked && dj.byId("day_of_month").get("value") == "") {
		  		m._config.onSubmitErrorMsg = m.getLocalization("mandatoryDayOfMonthError");
				return false;
		  	}
			
			return true;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.schedule_report_client');