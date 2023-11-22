dojo.provide("misys.binding.system.facility_maintenance_search");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m, {
		bind : function() {
			m.setValidation("facility_ccy", m.validateCurrency);
		}
	});
})(dojo, dijit, misys);
//Including the client specific implementation
dojo.require('misys.client.binding.system.facility_maintenance_search_client');