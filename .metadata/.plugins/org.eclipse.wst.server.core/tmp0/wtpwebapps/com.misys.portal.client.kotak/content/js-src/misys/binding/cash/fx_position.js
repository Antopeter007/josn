dojo.provide("misys.binding.cash.fx_position");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.ready(function(){
		dojo.query("label[for=customer]")[0].innerHTML = "<span class='required-field-symbol'>*</span>"+dojo.query("label[for=customer]")[0].innerHTML;
		dojo.query("label[for=start_date]")[0].innerHTML = "<span class='required-field-symbol'>*</span>"+dojo.query("label[for=start_date]")[0].innerHTML;
	});

	
	function validatePositionStartDate() {
		var value = this.get("value");
		console.debug("validating start date: " + value);
		if (value) {
			
			if(d.date.compare(value, new Date(), "date") >= 0){
				return true;
			}
			else
			{
				var localizedDate =d.date.locale.format(m.localizeDate(this), {
					selector :"date"
				});
				var localizedDateToday = d.date.locale.format(new Date(), {
					selector :"date"
				});
				
				this.invalidMessage = m.getLocalization("startDateLessThanDateOfDayError",[localizedDate, localizedDateToday]);
				return false;
			}
		}
		return true;
	}
	
	
	d.mixin(m, {
			
		bind : function(){
			m.setValidation('start_date', validatePositionStartDate);
		}
	
	});
		
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.cash.fx_position_client');