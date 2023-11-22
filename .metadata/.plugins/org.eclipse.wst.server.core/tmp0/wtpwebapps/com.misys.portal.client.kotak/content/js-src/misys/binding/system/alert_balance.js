dojo.provide("misys.binding.system.alert_balance");

dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.RadioButton");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.TooltipDialog");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("misys.binding.cash.request.AccountPopup");
dojo.require("misys.form.addons");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	function _validateRecipient( /*String*/ alertType){
		// summary:
		//		TODO
		
		var issuerAbbvType1 = dj.byId("issuer_abbv_name" + alertType + "_1"),
			issuerAbbvType2 = dj.byId("issuer_abbv_name" + alertType + "_2"),
			issuerAbbvType3 = dj.byId("issuer_abbv_name" + alertType + "_3"),
			issuerAbbvType4 = dj.byId("issuer_abbv_name" + alertType + "_4");
		
		if (!issuerAbbvType1) {
			return true;
		}
		
		if (!issuerAbbvType1.get("checked") && !issuerAbbvType2.get("checked") && 
			!issuerAbbvType3.get("checked") && !issuerAbbvType4.get("checked")) {
			m.showTooltip(m.getLocalization("recipientMandatory"),
					issuerAbbvType1.domNode, ["before"]);
			return false;
		}
		
		return true;
	}

	// Public functions & variables follow
	
	d.mixin(m._config, {
		// summary:
		//	Used in the account popup
		
		emailAccountPopupFirstOpening : true,
		smsAccountPopupFirstOpening : true,
		onlineAccountPopupFirstOpening : true
	});
	
	d.mixin(m, {

		bind : function() {
			m.setValidation("threshold01_cur_code", m.validateCurrency);
			m.setValidation("address01", m.validateEmailAddr);
			m.setValidation("threshold03_cur_code", m.validateCurrency);
			m.connect("dijit_form_Button_1", "onClick", function(){
				dj.byId("threshold_sign01_0").set("checked",true);
				dj.byId("01entity").set("disabled",true);
				dj.byId("account_num01").set("disabled",true);
			});
			m.connect("dijit_form_Button_2", "onClick", function(){
				dj.byId("threshold_sign03_0").set("checked",true);
				dj.byId("03entity").set("disabled",true);
				dj.byId("account_num03").set("disabled",true);
			});
		},
		
		populateAccountFields : function( /*String*/ accountType,
				 				  		  /*String*/ accountSelected) {
			// summary:
			//		TODO
			
			switch(accountType) {
			case "emailAccount":
				dj.byId("account_num01").set("value", accountSelected.account_no);
				dj.byId("threshold01_cur_code").set("value", accountSelected.cur_code);
				dj.byId("bank_abbv_name01").set("value", accountSelected.bank_abbv_name);
				break;
			case "smsAccount":
				dj.byId("account_num02").set("value", accountSelected.account_no);
				dj.byId("threshold02_cur_code").set("value", accountSelected.cur_code);
				dj.byId("bank_abbv_name02").set("value", accountSelected.bank_abbv_name);
				break;
			case "onlineAccount":
				dj.byId("account_num03").set("value", accountSelected.account_no);
				dj.byId("threshold03_cur_code").set("value", accountSelected.cur_code);
				dj.byId("bank_abbv_name03").set("value", accountSelected.bank_abbv_name);
				break;
			default:
				break;
			}
		},

		// Other public functions follow. These are bound to the alert widget
		// during their instantiation
		
		getAddressLabel : function(rowIndex, item) {
//			return item.issuer_abbv_name !== "*" ? 
//					m._config.recipientCollection[item.issuer_abbv_name] : item.address;
			if (!item) {
				return "*";
			}
			return item.address;
		}, 
		
		getThresholdCode : function(rowIndex, item) {
			if (!item) {
				return "*";
			}
			var sign = item.threshold_sign == "0" ? "<=" : ">=";
			return "(" + sign + ") " + item.threshold_cur + " " + item.threshold_amt;
		},
		
		getAccountLabel : function(rowIndex, item) {
			if (!item) {
				return "*";
			}
			return item.account_num;
		}
	});
	
	m._config = m._config || {};
	d.mixin(m._config, {
			
			initReAuthParams : function(){	
				
				var reAuthParams = { 	productCode : 'BA',
				         				subProductCode : '',
				        				transactionTypeCode : '01',
				        				entity : '',			        			
				        				currency : '',
				        				amount : '',
				        				
				        				es_field1 : '',
				        				es_field2 : ''
									  };
				return reAuthParams;
			}
		});	
	m.dialog = m.dialog || {};
	d.mixin(m.dialog, {
		submitBalanceAlert : function( /*String*/ dialogId,
									   /*String*/ alertType) {
			// summary:
			//		TODO
			
			var dialog = dj.byId(dialogId);
			if(dialog && dialog.validate() && _validateRecipient(alertType)) {
				dialog.execute();
				dialog.hide();
			}
		},
		
		closeBalanceAlert :  function( /*String*/ dialogId){
			// summary:
			//		TODO
			
			dj.byId("account_num01")?dj.byId("account_num01").reset():'';
			dj.byId("account_num03")?dj.byId("account_num03").reset():'';
			dj.byId("threshold01_cur_code")?dj.byId("threshold01_cur_code").reset():'';
			dj.byId("threshold01_amt")?dj.byId("threshold01_amt").reset():'';
			dj.byId("address01")?dj.byId("address01").reset():'';
			dj.byId("threshold03_cur_code")?dj.byId("threshold01_cur_code").reset():'';
			dj.byId("threshold03_amt")?dj.byId("threshold01_amt").reset():'';
			
			//close dialog
			dj.byId(dialogId).hide();
		}
	});	
	
	d.ready(function() {
		// summary:
		//	There is a dependency between these imports and the functions above.
		//	TODO The above functions should probably be moved into a mixin that the below
		//		 classes import
		
		d.require("misys.admin.widget.AlertsBalance");
		d.require("misys.admin.widget.AlertBalance");
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.alert_balance_client');