dojo.provide("misys.binding.trade.message_ec");

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
dojo.require("misys.widget.Collaboration");


(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
					productCode : 'EC',	
					subProductCode : '',
					transactionTypeCode : "13",	
					entity : '',
					currency : '',				
					amount : '',
									
					es_field1 : '',
					es_field2 : ''					
			};
			return reAuthParams;
		}
	});
	
	
	function _toggleSettlementDetails(/*Boolean*/ keepValues){
		var productCode = m._config.productCode.toLowerCase(),
			doToggle = dj.byId("sub_tnx_type_code").get("value") === "25",
			callback,
			curCodeField,
			effect;
			
		switch(productCode) {
			case "si":
				productCode = "lc";
				break;
			case "tf":
				productCode = "fin";
				break;
			default:
				break;
		}
		//curCodeField = dj.byId(productCode + "_cur_code");

		callback = function(){
			m.toggleFields(doToggle, null, 
					["tnx_amt", "lc_amt", "fwd_contract_no"], keepValues);
			// CF NOTE Not sure why cur_code_field is cleared/enabled/disabled, as its a hidden
			// field, and this action is breaking the form submission
			
			//curCodeField.set("disabled", true);
		};

		effect = (doToggle) ? "fadeIn" : "fadeOut";
		m.animate(effect, d.byId("settlement-details"), callback);
	}
			

	d.mixin(m, {
						
		bind : function() {
			m.connect("sub_tnx_type_code", "onChange", function(){
				_toggleSettlementDetails(false);
			});
		},

		onFormLoad : function() {
			var subTnxTypeCode = dj.byId("sub_tnx_type_code");
			if (subTnxTypeCode){
				_toggleSettlementDetails(true);
			}
		}
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_ec_client');