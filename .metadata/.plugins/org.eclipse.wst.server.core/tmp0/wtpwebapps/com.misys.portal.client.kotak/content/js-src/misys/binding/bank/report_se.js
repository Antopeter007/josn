dojo.provide("misys.binding.bank.report_se");

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.file");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.addons");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.connect("se_type", "onChange", function(){
				dj.byId("topic").set("value", dj.byId("se_type").get("displayedValue") );
			});
			
			m.connect("prod_stat_code", "onChange", m.toggleProdStatCodeFields);
		},

		onFormLoad : function() {
			// Fill the hidden field topic on load
			if (dj.byId("se_type")) {
				dj.byId("topic").set("value", dj.byId("se_type").get("displayedValue") );
			}
			if(dj.byId("action_req_code")) {
				m.toggleProdStatCodeFields();
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.bank.report_se_client');