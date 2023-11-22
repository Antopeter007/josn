dojo.provide("misys.binding.system.account_management");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m, {
		bind : function() {
			m.setValidation("email", misys.validateEmailAddr);
			m.setValidation("iso_code", misys.validateBICFormat);
			m.setValidation("routing_bic", misys.validateBICFormat);
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.account_management_client');