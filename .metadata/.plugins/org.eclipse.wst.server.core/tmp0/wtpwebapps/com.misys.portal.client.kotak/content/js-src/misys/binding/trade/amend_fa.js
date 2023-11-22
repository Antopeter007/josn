dojo.provide("misys.binding.trade.amend_fa");

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
dojo.require("misys.editor.plugins.ProductFieldChoice");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.Editor");
dojo.require("dijit._editor.plugins.FontChoice");
dojo.require("dojox.editor.plugins.ToolbarLineBreak");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.static_document");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function _toggleRequestAmount() {
		var check = dj.byId("request_max_amt").get("checked"),
			faAmt = dj.byId("fa_amt"),
			faAmtCode = dj.byId("fa_cur_code");
		if(check) {
			faAmt.set("required", false);
			faAmt.set("disabled", true);
			faAmtCode.set("required", false);
			faAmtCode.set("disabled", true);
			faAmt.set("value",""); 
		} else{
			faAmt.set("required", true);
			faAmt.set("disabled", false);
			faAmtCode.set("required", true);
			faAmtCode.set("disabled", false);
		}
	}

	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.connect("request_max_amt", "onClick", _toggleRequestAmount);
		},

		onFormLoad : function() {
			if(dj.byId("fa_amt").get("value") === 0) {
				dj.byId("fa_amt").set("value","");
			}

			var check = dj.byId("request_max_amt").get("checked");
			if(check) {
			  dj.byId("fa_amt").set("disabled", true);
			  dj.byId("fa_cur_code").set("disabled", true);
			  dj.byId("fa_amt").set("value","");
			}
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.amend_fa_client');