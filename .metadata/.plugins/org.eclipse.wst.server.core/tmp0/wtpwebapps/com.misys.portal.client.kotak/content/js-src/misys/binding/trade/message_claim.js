dojo.provide("misys.binding.trade.message_claim");
/*
 -----------------------------------------------------------------------------
 Scripts for the system Banks Data Maintenance (Customer Side) page.
 
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      02/03/11
 -----------------------------------------------------------------------------
 */

dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("misys.form.SimpleTextarea");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.DateTextBox");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.NumberTextBox");
dojo.require("misys.form.file");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.FilteringSelect");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	var _deleteGridRecord = "deletegridrecord";
	d.mixin(m._config, {

		initReAuthParams : function() {
									
			var reAuthParams = {
				productCode : 'BR',	
				subProductCode : '',
				transactionTypeCode : "13",	
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("bg_cur_code") ? dj.byId("bg_cur_code").get("value") : "",			
				amount : m.trimAmount(dj.byId("bg_amt") ? dj.byId("bg_cur_code").get("value") : ""),
								
				es_field1 : m.trimAmount(dj.byId("bg_amt") ? dj.byId("bg_cur_code").get("value") : ""),
				es_field2 : ''				
			};
			return reAuthParams;
		}
	});
	
	function _clearRequiredFields(message){
	 	var callback = function() {
	 		var widget = dijit.byId("claim_amt");
		 	widget.set("state","Error");
	 		//m.defaultBindTheFXTypes();
		 	dj.byId('tnx_amt').set('value', '');
		 	
		};
		m.dialog.show("ERROR", message, '', function(){
			setTimeout(callback, 500);
		});
	}
	
	function _handleTypeChange()
	{
		var	br_type =	dj.byId("sub_tnx_type_code");
		var advisingBankAbbvName = dj.byId("advising_bank_abbv_name").get("value");
		var isMT798Enable = m._config.customerBanksMT798Channel[advisingBankAbbvName] === true;
		if (br_type)
		{
			 if (isMT798Enable)
			 {  
				 if(br_type.get('value') === "25")
					 {
						 m.animate("wipeIn", d.byId('claim_cur_code_row'));
						 m.animate("wipeIn", d.byId('_amt_row'));
						 m.toggleRequired("claim_amt", true);
					 }
				 else
					 {
						 m.animate("wipeOut", d.byId('claim_cur_code_row'));
						 m.animate("wipeOut", d.byId('_amt_row'));
						 dj.byId("claim_amt").set("value", "");
						 dj.byId("claim_amt").set("required", false);
						 m.toggleRequired("claim_amt", false);
					 }
				 m.animate("wipeOut", d.byId('adv_send_mode_row'));
				 m.animate("wipeIn", d.byId('delivery_channel_row'));
				 m.animate("wipeIn", d.byId('bank_instructions_row'));
			 }			 
			 else
			 {
				 m.animate("wipeOut", d.byId('claim_cur_code_row'));
				 m.animate("wipeOut", d.byId('_amt_row'));
				 m.animate("wipeOut", d.byId('adv_send_mode_row'));
				 m.animate("wipeOut", d.byId('delivery_channel_row'));
				 m.animate("wipeOut", d.byId('bank_instructions_row'));
				 dj.byId("delivery_channel").set("disabled", true);
				 dj.byId("claim_amt").set("value", "");
				 dj.byId("claim_amt").set("required", false);
				 dj.byId("adv_send_mode").set("value", "");
				 dj.byId("adv_send_mode").set("required", false);
				 if(dj.byId("delivery_channel"))
				 {
				 	dj.byId("delivery_channel").set("value", "");
				 	dj.byId("delivery_channel").set("required", false);
				 }
				 _toggleMandatory(false);
			 }
		}
	}
	
	function _toggleMandatory(/*Boolean*/ isMandatory) {
		m.toggleRequired("claim_amt", isMandatory);
		m.toggleRequired("adv_send_mode", isMandatory);		
	}
	
	function _validateDebitAmt(){
		   var debitAmt = dj.byId('claim_amt');
			if(dj.byId('bg_amt') && dj.byId('bg_amt').get('value')!=='' && debitAmt.get('value') !== '' && debitAmt.get('value') > dj.byId('bg_amt').get('value'))
			{
				var displayMessage = misys.getLocalization('debitAmtLessThanDocumentAmt', [debitAmt.get('value'),dj.byId('bg_amt').get('value')]);
				var domNode = debitAmt.domNode;
				debitAmt.set("state","Error");
				dj.showTooltip(displayMessage, domNode, 0);
				var hideTT = function() {
					dj.hideTooltip(domNode);
				};
				var timeoutInMs = 2000;
				setTimeout(hideTT, timeoutInMs);
			}
	   }
	
   d.mixin(m._config, {		
		initReAuthParams : function(){	
			
			
			var reAuthParams = { 	productCode : m._config.productCode,
			         				subProductCode : '',
			        				transactionTypeCode : '13',
			        				entity : dj.byId("entity") ? dj.byId("entity").get("value") : "",			        				
			        				currency : dj.byId("bg_cur_code") ? dj.byId("bg_cur_code").get("value") : "",
			        				amount : m.trimAmount(dj.byId("bg_amt") ? dj.byId("bg_amt").get("value") : ""),
			        				
			        				es_field1 : m.trimAmount(dj.byId("bg_amt") ? dj.byId("bg_amt").get("value") : ""),
			        				es_field2 : ''
								  };
			return reAuthParams;
		}
	});
	   
	   
	d.mixin(m, {
		
		bind : function() {
		//validation events
		//validate debit currency
		misys.setValidation('claim_cur_code', misys.validateCurrency);
		//misys.connect("br_type", "onChange", _handleTypeChange);
		misys.connect("sub_tnx_type_code", "onChange", _handleTypeChange);
		
		misys.connect("adv_send_mode", "onChange", function(){
			m.toggleMT798Fields("advising_bank_abbv_name");
			var advisingBankAbbvName = dj.byId("advising_bank_abbv_name").get("value");
			var isMT798Enable = m._config.customerBanksMT798Channel[advisingBankAbbvName] === true && dj.byId("adv_send_mode").get("value") === "01";
			if(misys.hasAttachments() && isMT798Enable)
			{
				dj.byId("delivery_channel").set("required", true);
				dj.byId("delivery_channel").set("disabled", false);
				dj.byId("delivery_channel").set("readOnly", false);
			}
			else
			{
				dj.byId("delivery_channel").set("required", false);
				dj.byId("delivery_channel").set("disabled", true);
			}
		});
		//validate for finance currency
		//misys.setValidation('finance_cur_code', misys.validateCurrency);
		//onChange
		misys.connect('claim_cur_code', 'onChange', function(){
			misys.setCurrency(this, ['claim_amt']);
			dj.byId('tnx_cur_code').set('value', dj.byId('claim_cur_code').get('value'));
		});
		
		misys.connect('claim_amt', 'onBlur', function(){
			_validateDebitAmt();
		});		
		
	  },
	  onFormLoad : function() {
			
		    var advisingBankAbbvName = dj.byId("advising_bank_abbv_name").get("value");
			var isMT798Enable = m._config.customerBanksMT798Channel[advisingBankAbbvName] === true;
			misys.setCurrency(dj.byId('claim_cur_code'), ['claim_amt']);
			
			//dijit.byId("br_type").set("value","GEN");
			if(isMT798Enable)
			{
				if(dj.byId("sub_tnx_type_code").get("value") === "25")
					{
						 m.animate("wipeIn", d.byId('claim_cur_code_row'));
						 m.animate("wipeIn", d.byId('_amt_row'));
						 m.toggleRequired("claim_amt", true);
					}
				else
					{
						 m.animate("wipeOut", d.byId('claim_cur_code_row'));
						 m.animate("wipeOut", d.byId('_amt_row'));
						 dj.byId("claim_amt").set("value", "");
						 dj.byId("claim_amt").set("required", false);
						 m.toggleRequired("claim_amt", false);
					}
				 dj.byId("adv_send_mode").set("value", "01");
				 m.animate("wipeOut", d.byId('adv_send_mode_row'));
				 m.animate("wipeIn", d.byId('delivery_channel_row'));
				 m.animate("wipeIn", d.byId('bank_instructions_row'));
				 if(dj.byId("adv_send_mode").get("value") !== '01')
				 {
					 dj.byId("delivery_channel").set("required", false);
					 dj.byId("delivery_channel").set("disabled", true);
				 }
				 else if(misys.hasAttachments())
				 {
					 dj.byId("delivery_channel").set("required", true);
					 dj.byId("delivery_channel").set("disabled", false);
					 dj.byId("delivery_channel").set("readOnly", false);
				 }
				 
				m.toggleMT798Fields("advising_bank_abbv_name");				 

			}
			else
			{
				 m.animate("wipeOut", d.byId('claim_cur_code_row'));
				 m.animate("wipeOut", d.byId('_amt_row'));
				 m.animate("wipeOut", d.byId('adv_send_mode_row'));
				 m.animate("wipeOut", d.byId('delivery_channel_row'));
				 m.animate("wipeOut", d.byId('bank_instructions_row'));
				 dj.byId("delivery_channel").set("disabled", true);
				 dj.byId("claim_amt").set("value", "");
				 dj.byId("claim_amt").set("required", false);
				 dj.byId("adv_send_mode").set("value", "");
				 dj.byId("adv_send_mode").set("required", false);
				 if(dj.byId("delivery_channel"))
				 {
				 	dj.byId("delivery_channel").set("value", "");
				 	dj.byId("delivery_channel").set("required", false);
				 }
				 _toggleMandatory(false);
			 
//				dijit.byId("sub_tnx_type_code").set("value","24");
			}
			
			var handle = dojo.subscribe(_deleteGridRecord, function(){
				 m.toggleFields(m._config.customerBanksMT798Channel[advisingBankAbbvName] === true && m.hasAttachments(), null, ["delivery_channel"], false, false);
			 });			
			
		},
		
		beforeSaveValidations : function() {
			
			if(dj.byId("claim_cur_code") && dj.byId("claim_amt"))
			{
				var cur = dj.byId("claim_cur_code").get('value');
				var amt = dj.byId("claim_amt").get('value');
				dj.byId('tnx_amt').set('value', amt);
				dj.byId('tnx_cur_code').set('value', cur);
			}
			return true;
			
		},
		
		beforeSubmitValidations : function() {
			
			if( dj.byId("claim_cur_code") && dj.byId("claim_amt"))
			{
				var cur = dj.byId("claim_cur_code").get('value');
				var amt = dj.byId("claim_amt").get('value');
				dj.byId('tnx_amt').set('value', amt);
				dj.byId('tnx_cur_code').set('value', cur);
			}
			return true;
			
		}	
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.trade.message_claim_client');