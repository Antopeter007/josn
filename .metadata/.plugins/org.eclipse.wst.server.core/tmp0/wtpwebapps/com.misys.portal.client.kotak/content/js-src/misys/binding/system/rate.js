dojo.provide("misys.binding.system.rate");

dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m, {
		bind : function() {
			m.setValidation("mid_tt_rate", m.validateRateFormat);
			m.setValidation("buy_tt_rate", m.validateRateFormat);
			m.setValidation("sell_tt_rate", m.validateRateFormat);
			m.setValidation("paty_val",m.validateParity);
			m.setValidation("iso_code", m.validateCurrency);
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.rate_client');