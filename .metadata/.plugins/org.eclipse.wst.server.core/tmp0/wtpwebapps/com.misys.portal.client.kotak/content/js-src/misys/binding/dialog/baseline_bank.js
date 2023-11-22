dojo.provide("misys.binding.dialog.baseline_bank");
dojo.require("dijit.layout.TabContainer");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	//
	// Private functions & variables
	//

	//
	// Public functions & variables
	//
	d.mixin(m.dialog, {
		bind: function(){
			m.setValidation("popup_country", m.validateCountry);
			m.setValidation("popup_phone", m.validatePhoneOrFax);
			m.setValidation("popup_fax", m.validatePhoneOrFax);
			m.setValidation("popup_telex", m.validatePhoneOrFax);
			m.setValidation("popup_email", m.validateEmailAddr);
			m.setValidation("popup_web_address", m.validateWebAddr);
			m.setValidation("popup_bei", m.validateBEIFormat);
			m.setValidation("popup_iso_code", m.validateBICFormat);
			m.connect("popup_post_code", "onBlur", function() {
				dj.byId("popup_swift_address_address_line_1").set("value",
						this.get("value"));
			});
			m.connect("popup_address_line_1", "onBlur", function() {
				dj.byId("popup_address_line_1").set("value", this.get("value"));
			});
		}
	});

	// 
	// Onload/Unload/onWidgetLoad Events
	//

})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.dialog.baseline_bank_client');