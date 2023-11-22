dojo.provide("misys.binding.openaccount.upload_cr");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.file");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// insert private functions & variables

	// Public functions & variables follow
	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : "CR",
				subProductCode : "",
				transactionTypeCode : "01",
				entity : "",
				currency : "",
				amount : "",

				es_field1 : "",
				es_field2 : ""
			};
			return reAuthParams;
		}
	});
	
	d.mixin(m, {

		bind : function() {			

		},

		onFormLoad : function() {

			m.animate('fadeOut', d.byId('submit_upload'));
			m.animate('fadeOut', d.byId('overwrite_contact_radio_div'));
			
		},

		beforeSubmitValidations : function() {
			if (dj.byId("attachment-file") && dj.byId("attachment-file").store) {
				if(dj.byId('attachment-file').store._arrayOfAllItems.length > 0) {
					m._config.onSubmitErrorMsg = "";
					return true;			
				}			
			}else{
				m._config.onSubmitErrorMsg = m.getLocalization("attachementfilenotpresenterror");
			}

			return false;
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.upload_cr_client');