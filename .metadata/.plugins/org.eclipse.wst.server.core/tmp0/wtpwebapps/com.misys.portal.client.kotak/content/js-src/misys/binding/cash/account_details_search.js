dojo.provide("misys.binding.cash.account_details_search");

dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("misys.form.common");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.ValidationTextBox");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	d.mixin(m, {
		
		bind : function() {			
			m.connect("submit", "onClick", m.submit);
		},
		 	
		onFormLoad : function() {
			m.setValidation("ccy", m.validateCurrency);	
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.account_details_search_client');