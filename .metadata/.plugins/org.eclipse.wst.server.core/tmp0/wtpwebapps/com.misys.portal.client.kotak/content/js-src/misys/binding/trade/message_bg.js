dojo.provide("misys.binding.trade.message_bg");

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
dojo.require("misys.widget.Collaboration");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	// dojo.subscribe once a record is deleted from the grid
    var _deleteGridRecord = "deletegridrecord";
	
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
					productCode : 'BG',	
					subProductCode : '',
					transactionTypeCode : "13",	
					entity : dj.byId("entity") ? dj.byId("entity").get("value") : '',
					currency : '',				
					amount : '',
									
					es_field1 : '',
					es_field2 : ''					
			};
			return reAuthParams;
		}
	});
	
	function _toggleSettlementDetails(/*Boolean*/ keepValues){
		var productCode ="bg",
			doToggle = dj.byId("sub_tnx_type_code").get("value") === "62",
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
		m.animate(effect, d.byId("settlement-details"), callback);
	}	
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			m.setValidation("exp_date", m.validateMessageTradeExpiryDate);
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
			m.connect("sub_tnx_type_code", "onChange", function(){
				_toggleSettlementDetails(false);
				if(dj.byId("tnx_amt") && dj.byId("claim_amt") && dj.byId("claim_amt").get("value") !== "")
				{
					dj.byId("tnx_amt").set("value", dj.byId("claim_amt").get("value"));
				}
			});
			m.connect('sub_tnx_type_code', 'onChange', function(){
				
				var tnxAmt = dj.byId("tnx_amt");
				var expDate = dj.byId("exp_date");
				var subTnxTypeCode = dj.byId("sub_tnx_type_code");
				var orgExpDate = dojo.date.locale.format(new Date(dj.byId("org_exp_date").get("displayedValue")), {datePattern: m.getLocalization("g_strGlobalDateFormat"), selector: "date"});
				
				if (expDate)
				{
					expDate.set("value", " ");
					// Extend: expiry date updated
					if (subTnxTypeCode.get("value") == "20")
					{
						tnxAmt.set("disabled", true);
						m.toggleRequired(tnxAmt, false);
						tnxAmt.set("value", "");
						expDate.set("disabled", false);
						m.toggleRequired(expDate, true);
						expDate.set("value", " ");
					}
					// Pay: amount updated
					else if (subTnxTypeCode.get("value") == "21")
					{
						tnxAmt.set("disabled", false);
						m.toggleRequired(tnxAmt, true);
						tnxAmt.set("value", "");
						expDate.set("value",new Date(orgExpDate));
						m.toggleRequired(expDate, false);
						expDate.set("disabled", true);
						
					}
				}
				
			});
		},

		onFormLoad : function() {
			// Additional onload events for dynamic fields	
			if(dj.byId("bg_cur_code") && dj.byId("tnx_amt"))
			{
				m.setCurrency(dj.byId("bg_cur_code"), ["tnx_amt"]);
			}
			var subTnxTypeSelect = dj.byId('sub_tnx_type_code');
			var tnxAmt = dj.byId("tnx_amt");
			var expDate = dj.byId("exp_date");
			var orgExpDate = dojo.date.locale.format(new Date(dj.byId("org_exp_date").get("displayedValue")), {datePattern: m.getLocalization("g_strGlobalDateFormat"), selector: "date"});
			var mainBankAbbvName = dj.byId("issuing_bank_abbv_name") ? dj.byId("issuing_bank_abbv_name").get("value") : "";
			var isMT798Enable = m._config.customerBanksMT798Channel[mainBankAbbvName] === true;
			if(subTnxTypeSelect) {
				if(dj.byId('sub_tnx_type_code').get("value") === "25" || dj.byId('sub_tnx_type_code').get("value") === "62")
				{
					m.animate("fadeIn", d.byId("settlement-details"));
					m.toggleRequired("tnx_amt", true);
				}
				else
				{
					m.animate("fadeOut", d.byId("settlement-details"));
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
				if (tnxAmt && expDate)
				{
					// Extend: expiry date updated
					if (subTnxTypeSelect.get("value") == "20")
					{
						tnxAmt.set("disabled", true);
						m.toggleRequired(tnxAmt, false);
						tnxAmt.set("value", "");
						expDate.set("disabled", false);
						m.toggleRequired(expDate, true);
						expDate.set("displayedValue", expDate.get("displayedValue"));
					}
					// Pay: amount updated
					else if (subTnxTypeSelect.get("value") == "21")
					{
						tnxAmt.set("disabled", false);
						m.toggleRequired(tnxAmt, true);
						tnxAmt.set("value", tnxAmt.get("value"));
						expDate.set("value", " ");
						m.toggleRequired(expDate, false);
						expDate.set("disabled", true);
						
					}
				}
			}
			
			var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[mainBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
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
			
			if(dj.byId('sub_tnx_type_code') && dj.byId('sub_tnx_type_code').get("value") == "21"){
				var expDate = dj.byId("exp_date");
				expDate.set("value",dj.byId("org_exp_date").get("value"));
			}			
			
			if(dj.byId("sub_tnx_type_code") && dj.byId("sub_tnx_type_code").get("value") !== "21" && dj.byId("sub_tnx_type_code").get("value") !== "25" && dj.byId("sub_tnx_type_code").get("value") !== "62" && dj.byId('tnx_amt'))
			{
				dj.byId('tnx_amt').set('value', "");
			}
			return true;
			
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_bg_client');