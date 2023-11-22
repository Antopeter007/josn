dojo.provide("misys.binding.dialog.bank");
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
			/** MPS-41722 Commenting out as requirement is to accept French characters**/
			//m.setValidation("popup_name", m.validateSwiftAddressCharacters);
			m.setValidation("popup_address_line_1", m.validateSwiftAddressCharacters);
			m.setValidation("popup_address_line_2", m.validateSwiftAddressCharacters);
			m.setValidation("popup_dom", m.validateSwiftAddressCharacters);
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
       dojo.require('misys.client.binding.dialog.bank_client');