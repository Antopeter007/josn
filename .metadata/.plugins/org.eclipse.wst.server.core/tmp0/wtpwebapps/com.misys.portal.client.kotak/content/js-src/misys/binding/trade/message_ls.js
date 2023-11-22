dojo.provide("misys.binding.trade.message_ls");

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
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
					productCode : "LS",	
					subProductCode : "",
					transactionTypeCode : "13",	
					entity : "",
					currency : "",				
					amount : "",
									
					es_field1 : "",
					es_field2 : ""					
			};
			return reAuthParams;
		}
	});
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.connect("sub_tnx_type_code", "onChange", m.toggleSettlementDetails);
			m.connect("sub_tnx_type_code", "onChange", function(){
				var legendId = d.byId("free_format_msg");
				if(this.get("value") === "96")
				{
					legendId.innerHTML = dj.byId("reason_for_cancellation").get("value");
				}
				else
				{
					legendId.innerHTML = dj.byId("message_free_format").get("value");
				}
			});
			m.connect("ls_settlement_amt", "onBlur", m.validateLicenseSettlementAmt);
			m.connect("add_settlement_amt", "onBlur", m.validateAddLicenseSettlementAmt);
			m.connect("ls_settlement_amt", "onChange", function(){
				var lsSettlementAmt = d.number.parse(dj.byId("ls_settlement_amt").get("value"));
				var lsAmt = d.number.parse(dj.byId("ls_amt").get("value"));
				lsAmt = !isNaN(lsAmt) ? lsAmt : 0;
				lsSettlementAmt = !isNaN(lsSettlementAmt) ? lsSettlementAmt : 0;
				if(dj.byId("add_settlement_amt") && dj.byId("tnx_amt") && dj.byId("add_settlement_amt").get("value") !==null)
				{
					var addsettlementAmt = d.number.parse(dj.byId("add_settlement_amt").get("value"));
					addsettlementAmt = !isNaN(addsettlementAmt) ? addsettlementAmt : 0;
					//dj.byId("tnx_amt").set("value", addsettlementAmt + lsSettlementAmt);
					dj.byId("tnx_amt").set("value", lsSettlementAmt);
				}
				else
				{
					dj.byId("tnx_amt").set("value", lsSettlementAmt);
				}
			});
			m.connect("add_settlement_amt", "onChange", function(){
				var addsettlementAmt = d.number.parse(dj.byId("add_settlement_amt").get("value"));
				addsettlementAmt = !isNaN(addsettlementAmt) ? addsettlementAmt : 0;
				if(dj.byId("ls_settlement_amt") && dj.byId("tnx_amt") && dj.byId("ls_settlement_amt").get("value") !==null)
				{
					var lsSettlementAmt = d.number.parse(dj.byId("ls_settlement_amt").get("value"));
					lsSettlementAmt = !isNaN(lsSettlementAmt) ? lsSettlementAmt : 0;
					//dj.byId("tnx_amt").set("value", addsettlementAmt + lsSettlementAmt);
				}
				/*else
				{
					dj.byId("tnx_amt").set("value", addSettlementAmt);
				}*/
			});
		},
		
		toggleSettlementDetails : function(){
			var productCode ="ls",
				doToggle = dj.byId("sub_tnx_type_code").get("value") === "25",
				callback,
				curCodeField,
				effect;
				
			callback = function(){
				m.toggleFields(doToggle, ["add_settlement_amt", "ls_settlement_amt"], ["tnx_amt"], false);
				dj.byId("tnx_amt").set("readOnly", true);
			};

			effect = (doToggle) ? "fadeIn" : "fadeOut";
			m.animate(effect, d.byId("settlement-details"), callback);
		},

		onFormLoad : function() {
			var subTnxTypeSelect = dj.byId("sub_tnx_type_code");
			var legendId = d.byId("free_format_msg");
			if(dj.byId("ls_cur_code") && dj.byId("tnx_amt") && dj.byId("ls_settlement_amt") && dj.byId("add_settlement_amt"))
			{
				m.setCurrency(dj.byId("ls_cur_code"), ["tnx_amt", "ls_settlement_amt", "add_settlement_amt"]);
			}
			if(subTnxTypeSelect) {
				m.toggleSettlementDetails();
			}
			if(subTnxTypeSelect && subTnxTypeSelect.get("value") === "96")
			{
				legendId.innerHTML = dj.byId("reason_for_cancellation").get("value");
			}
			else
			{
				legendId.innerHTML = dj.byId("message_free_format").get("value");
			}
		},
		
		beforeSubmitValidations : function() {
			
			if(dj.byId("sub_tnx_type_code") && dj.byId("tnx_amt"))
			{
				if(dj.byId("sub_tnx_type_code").get("value") !== "25")
				{
					dj.byId("tnx_amt").set("value", "");
				}
				else if(dj.byId("tnx_amt").get("value") === 0)
				{
					m._config.onSubmitErrorMsg = m.getLocalization("tnxAmtZeroError");
					console.debug("Transaction Amount Cannot be Zero");
					return false;
				}
			}
			if(dj.byId("ls_liab_amt") && dj.byId("tnx_amt"))
			{
				var osAmt = d.number.parse(dj.byId("ls_liab_amt").get("value"));
				var totalSettlementAmt = d.number.parse(dj.byId("tnx_amt").get("value"));
				osAmt = !isNaN(osAmt) ? osAmt : 0;
				totalSettlementAmt = !isNaN(totalSettlementAmt) ? totalSettlementAmt : 0;
				if(totalSettlementAmt > osAmt)
				{
					m._config.onSubmitErrorMsg = m.getLocalization("totalSettlementAmtGreaterThanOSAmtError", [totalSettlementAmt, osAmt]);
					console.debug("Settlement Amount cannot be greater than the Outstanding Amount.");
					return false;
				}
			}
			return true;
			
		}	
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_ls_client');