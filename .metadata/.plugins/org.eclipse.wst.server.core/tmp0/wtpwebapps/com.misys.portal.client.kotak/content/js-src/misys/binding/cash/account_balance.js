dojo.provide("misys.binding.cash.account_balance");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode

	
	function validateProjectedEndDate() {
		var value = this.get("value");
		console.debug("validating end date: " + value);
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
				
				this.invalidMessage = m.getLocalization("DateLessThanDateOfDayError",[localizedDate, localizedDateToday]);
				return false;
			}
		}
		return true;
	}
	
	
	d.mixin(m, {
			
		bind : function(){
			m.setValidation('end_date', validateProjectedEndDate);
		}
	
	});
		
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.cash.account_balance_client');