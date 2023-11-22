dojo.provide("misys.binding.system.company");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.validation.login");
dojo.require("misys.validation.password");
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
	
	function _checkConfirmPassword(){
		m.checkConfirmPassword("password_value","password_confirm");
	}
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("bei", m.validateBEIFormat);
			m.setValidation("email", m.validateEmailAddr);
			m.setValidation("web_address", m.validateWebAddr);
			m.setValidation("password_value", m.validatePassword);
			m.setValidation("abbv_name", m.validateCharacters);
			m.setValidation("password_value", m.validateChangePasswordNP);
			m.setValidation("password_confirm", m.validateChangePasswordCP);
			m.setValidation("phone", m.validatePhoneOrFax);
			m.setValidation("fax", m.validateFax);
			m.setValidation("telex", m.validateTelex);

			m.connect("create_admin", "onClick", function(){
				m.toggleFields(this.get("checked"), null,
						["password_value", "password_confirm"]);
			});
			m.connect("password_value", "onBlur", _checkConfirmPassword);
		},

		onFormLoad : function() {
			var createAdmin = dj.byId("create_admin");
			if(createAdmin) {
				m.toggleFields(createAdmin.get("checked"),
					null, ["password_value", "password_confirm"]);
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.company_client');