dojo.provide("misys.binding.system.user");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.validation.login");
dojo.require("misys.validation.password");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode
	function _checkConfirmPassword(){
		m.checkConfirmPassword("password_value","password_confirm");
	}
	
	d.mixin(m, {
		bind : function() {
			m.setValidation("base_cur_code", m.validateCurrency);
			m.setValidation("abbv_name", m.validateCharacters);
			m.setValidation("login_id", m.validateCharacters);
			m.setValidation("company_abbv_name", m.validateCharacters);
			m.setValidation("password_value", m.validateChangePasswordNP);
			m.setValidation("password_confirm", m.validateChangePasswordCP);
			m.setValidation("phone", m.validatePhoneOrFax);
			m.setValidation("fax", m.validateFax);
			m.setValidation("email", m.validateEmailAddr);
			m.connect("password_value", "onBlur", _checkConfirmPassword);
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.user_client');