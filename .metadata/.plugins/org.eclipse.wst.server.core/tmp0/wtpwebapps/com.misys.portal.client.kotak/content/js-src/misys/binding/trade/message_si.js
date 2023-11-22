
dojo.provide("misys.binding.trade.message_si");

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
					productCode : 'SI',	
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
		var productCode ="si",
			doToggle = dj.byId("sub_tnx_type_code").get("value") === "62" || dj.byId("sub_tnx_type_code").get("value") === "25",
			callback,
			curCodeField,
			effect;
			
		callback = function(){
			m.toggleFields(doToggle, ["principal_act_no", "fee_act_no"], ["tnx_amt"], keepValues);
			if(dj.byId('is_amt_editable') && dj.byId('is_amt_editable').get("value") === "true")
			{
				dj.byId("tnx_amt").set("readOnly", false);
			}
			else
			{
				dj.byId("tnx_amt").set("readOnly", true);
			}
		};

		effect = (doToggle) ? "fadeIn" : "fadeOut";
		m.animate(effect, d.byId("claim-settlement-details"), callback);
	}
	
	
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("exp_date", m.validateBankExpiryDate);
			if(dj.byId("prod_stat_code") && dj.byId("prod_stat_code").get("value") === "86")
			{
				m.connect("sub_tnx_type_code", "onChange", function(){
					var fieldValue = this.get("value");
						m.toggleFields(fieldValue == "20", 
								null, 
								["exp_date"]);
						m.toggleFields(fieldValue == "21", 
								null, 
								["tnx_amt"]);	
				});
			}
			m.connect("sub_tnx_type_code", "onChange", function(){
				_toggleSettlementDetails(false);
				if(dj.byId("tnx_amt") && dj.byId("claim_amt") && dj.byId("claim_amt").get("value") !== "")
				{
					dj.byId("tnx_amt").set("value", dj.byId("claim_amt").get("value"));
				}
			});
			m.connect("tnx_amt", "onBlur", function(){
				if(!m.validateTnxAmount())
				{
					dj.byId("tnx_amt").set("value","");
					var hideTT = function() {
						dj.hideTooltip(dj.byId("tnx_amt").domNode);
					};
					dj.showTooltip(this.invalidMessage, dj.byId("tnx_amt").domNode, 0);
					setTimeout(hideTT, 10000);
				}
			});
		},

		onFormLoad : function() {
			var issuingBankAbbvName = dj.byId("issuing_bank_abbv_name").get("value");
			var isMT798Enable = m._config.customerBanksMT798Channel[issuingBankAbbvName] === true && dj.byId("adv_send_mode").get("value") === "01";
			if(dj.byId("lc_cur_code") && dj.byId("tnx_amt"))
			{
				m.setCurrency(dj.byId("lc_cur_code"), ["tnx_amt"]);
			}
			var subTnxTypeSelect = dj.byId("sub_tnx_type_code");
			if(subTnxTypeSelect) {
				var fieldValue = subTnxTypeSelect.get("value");
				m.toggleFields(fieldValue == "20", 
						null, 
						["exp_date"],true);
				m.toggleFields(fieldValue == "21" || fieldValue == "25", 
						null, 
						["tnx_amt"]);
				if(dj.byId('sub_tnx_type_code').get("value") === "25" || dj.byId('sub_tnx_type_code').get("value") === "62")
				{
					m.animate("fadeIn", d.byId("claim-settlement-details"));
					m.toggleRequired("tnx_amt", true);
				}
				else
				{
					m.animate("fadeOut", d.byId("claim-settlement-details"));
				}
				if(isMT798Enable && dj.byId("adv_send_mode") && dj.byId("adv_send_mode").get("value") == "01")
				{
					m.animate("fadeIn", d.byId("bankInst"));
					// Connect/listen to 'delivery_channel' drop-down for 'onChange' event
					m.connectDeliveryChannelOnChange();
				}
				else
				{
					m.animate("fadeOut", d.byId("bankInst"));
				}
			}
			var handle = dojo.subscribe(_deleteGridRecord, function(){
				m.toggleFields(m._config.customerBanksMT798Channel[issuingBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			});
		},
		
		connectDeliveryChannelOnChange : function(){
			// MT798 FileAct checkbox appears upon selection of 
			// File Act(FACT) 'option' from delivery_channel Combo Box
			var mainBankAbbvName = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "";
			if (dj.byId("delivery_channel")){
				if(!m.hasAttachments())
				{
					dj.byId("delivery_channel").set("disabled", true);
					dj.byId("delivery_channel").set("value", null);
				}
				else
					{
						m.toggleFields(m._config.customerBanksMT798Channel[mainBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
					}
				m.animate("fadeIn", "delivery_channel_row");
				m.connect("delivery_channel", "onChange",  function(){
					if(dj.byId('attachment-file'))
					{
						if(dj.byId("delivery_channel").get('value') === 'FACT')
						{
							dj.byId('attachment-file').displayFileAct(true);
						}
						else
						{
							dj.byId('attachment-file').displayFileAct(false);
						}
					}
				});
				dj.byId("delivery_channel").onChange();
			}
		},
		
		beforeSubmitValidations : function() {
			
			if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") !== "21" && dj.byId("sub_tnx_type_code").get("value") !== "25" && dj.byId("sub_tnx_type_code").get("value") !== "62" && dj.byId('tnx_amt'))
			{
				dj.byId('tnx_amt').set('value', "");
			}
			
			return true;
			
		}	
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_si_client');