dojo.provide("misys.binding.trade.create_fa");

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
			m.connect("issuing_bank_abbv_name", "onChange", m.populateReferences);
			if(dj.byId("issuing_bank_abbv_name")) {
				m.connect("entity", "onChange", function(){
					dj.byId("issuing_bank_abbv_name").onChange();});
			}
			m.setValidation("fa_cur_code", m.validateCurrency);
			m.connect("fa_cur_code", "onChange", function(){
				m.setCurrency(this, ["fa_amt"]);
			});
			m.connect("issuing_bank_customer_reference", "onChange",
					m.setApplicantReference);
			m.connect("request_max_amt", "onClick", _toggleRequestAmount);
		},

		onFormLoad : function() {
			if(dj.byId("fa_amt").value === 0) {
				dj.byId("fa_amt").set("value","");
			}
			m.setCurrency(dj.byId("fa_cur_code"), ["fa_amt"]);
			var check = dj.byId("request_max_amt").get("checked");
			if(check) {
			  dj.byId("fa_amt").set("disabled", true);
			  dj.byId("fa_cur_code").set("disabled", true);
			  dj.byId("fa_amt").set("value","");
			}
			
			// Populate references
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name");
			if(issuingBankAbbvName){
				issuingBankAbbvName.onChange();
			}
				
			var issuingBankCustRef = dj.byId("issuing_bank_customer_reference");
			if(issuingBankCustRef) {
				issuingBankCustRef.onChange();
			}	 
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.create_fa_client');