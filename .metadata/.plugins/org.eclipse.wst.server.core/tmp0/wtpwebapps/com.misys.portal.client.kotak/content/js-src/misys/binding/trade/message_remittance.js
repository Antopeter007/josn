dojo.provide("misys.binding.trade.message_remittance");

dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.TooltipDialog");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.form.file");
dojo.require("misys.form.addons");
dojo.require("misys.widget.NoCloseDialog");
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";

	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
					productCode : "EL",	
					subProductCode : '',
					transactionTypeCode : '13',	
					entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
					currency : '',				
					amount : '',
									
					es_field1 : '',
					es_field2 : ''					
			};
			return reAuthParams;
		}
	});
		
	d.mixin(m, {
		
		bind : function() {
			
			m.setValidation("tnx_cur_code", m.validateCurrency);
			m.connect("tnx_cur_code", "onBlur", function(){
				m.setCurrency("tnx_cur_code", ["tnx_amt"]);
			});
			var invalidMessage;
			m.connect("tnx_amt", "onBlur", function(){
				if(dj.byId("org_lc_available_amt") && dj.byId("tnx_amt"))
					{	
					if(parseFloat(m.trimAmount(dj.byId("org_lc_available_amt").get("value"))) < parseFloat(dj.byId("tnx_amt").get("value")))
				{
					
					invalidMessage = m.getLocalization("canNotMoreThanLCAmt",[dj.byId("lc_cur_code").get("value"),dj.byId("org_lc_available_amt").get("value")]);
					var callback = function() {
						var widget = dijit.byId("tnx_amt");
						widget.focus();
					 	widget.set("state","Error");
					};
					m.dialog.show("ERROR", invalidMessage , '', function(){
							setTimeout(callback, 500);
						});
				} else{
					var newlcAvailableAmtValue = (parseFloat(m.trimAmount(dj.byId("org_lc_available_amt").get("value"))) - parseFloat(dj.byId("tnx_amt").get("value")));
					
					dj.byId("lc_available_amt").set("value",newlcAvailableAmtValue);
				}
			}
			});
			
		},
		
		onFormLoad : function() {
			m.setCurrency("tnx_cur_code", ["tnx_amt"]);
			if (dj.byId("lc_cur_code") && (dj.byId("lc_cur_code").get("value") != ""))
			{
				dj.byId("tnx_cur_code").set("value", dj.byId("lc_cur_code").get("value"));
				dj.byId("tnx_cur_code").set("readOnly", true);
			}
		},
		
		beforeSubmitValidations : function(){
			if(dj.byId("boe_flag") && !(dj.byId("boe_flag").get("checked"))){
			 if(dojo.byId("document-notice").style.display !== "none")
			 {  
				 	m._config.onSubmitErrorMsg =  m.getLocalization("atleastOneDocumentMandatory");
				 	return false;
			 }
			}
			 
			 if(dj.byId("org_lc_available_amt") && dj.byId("tnx_amt") && (parseFloat(m.trimAmount(dj.byId("org_lc_available_amt").get("value"))) < parseFloat(dj.byId("tnx_amt").get("value"))))
				{
					m._config.onSubmitErrorMsg = m.getLocalization("canNotMoreThanLCAmt");
					dj.byId("tnx_amt").set("value", "");
					console.debug("Invalid Amount.");
					return false;
				}
			 return true;
		}
		
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_remittance_client');