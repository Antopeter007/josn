dojo.provide("misys.binding.system.alert_transaction");

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
	
	// TODO Are these variables used? Don't seem to be
	d.mixin(m._config, {
		// summary:
		//	Used in the account popup
		
		emailAccountPopupFirstOpening : true,
		smsAccountPopupFirstOpening : true,
		onlineAccountPopupFirstOpening : true
	});
	
	d.mixin(m, {

		bind : function() {
			m.connect("account_num01_img", "onClick", function() {
				fncOpenAccountPopup("emailAccount", "ACT_BALANCE_ALERT");
			});
			m.connect("account_num02_img", "onClick", function() {
				fncOpenAccountPopup("smsAccount", "ACT_BALANCE_ALERT");
			});
			m.connect("account_num03_img", "onClick", function() {
				fncOpenAccountPopup("onlineAccount", "ACT_BALANCE_ALERT");
			});

			m.setValidation("address01", m.validateEmailAddr);
		},
		
		populateAccountFields : function( /*String*/ accountType,
				 				  		  /*String*/ accountSelected) {
			// summary:
			//		TODO
			
			switch(accountType) {
			case "emailAccount":
				dj.byId("account_num01").set("value", accountSelected.account_no);
				dj.byId("debit01_cur_code").set("value", accountSelected.cur_code);
				dj.byId("credit01_cur_code").set("value", accountSelected.cur_code);
				dj.byId("bank_abbv_name01").set("value", accountSelected.bank_abbv_name);
				break;
			case "smsAccount":
				dj.byId("account_num02").set("value", accountSelected.account_no);
				dj.byId("debit02_cur_code").set("value", accountSelected.cur_code);
				dj.byId("credit02_cur_code").set("value", accountSelected.cur_code);
				dj.byId("bank_abbv_name02").set("value", accountSelected.bank_abbv_name);
				break;
			case "onlineAccount":
				dj.byId("account_num03").set("value", accountSelected.account_no);
				dj.byId("debit03_cur_code").set("value", accountSelected.cur_code);
				dj.byId("credit03_cur_code").set("value", accountSelected.cur_code);
				dj.byId("bank_abbv_name03").set("value", accountSelected.bank_abbv_name);
				break;
			default:
				break;
			}
		},

		// Other public functions follow. These are bound to the alert widget
		// during their instantiation
		getAccountLabel : function(rowIndex, item) {
			return item.account_num;
		},
		
		getCredit : function(rowIndex, item) {
			return item.credit_cur + " " + item.credit_amt;
		}, 
		
		getDebit : function(rowIndex, item) {
			return item.debit_cur + " " + item.debit_amt;
		},
		
		getAddressLabel : function(rowIndex, item) {
			return item.address;
		}
	});
	
	m.dialog = m.dialog || {};
	d.mixin(m.dialog, {
		submitTransactionAlert : function( /*String*/ dialogId,
									   	   /*String*/ alertType) {
			// summary:
			//		TODO
			
			var dialog = dj.byId(dialogId);
			if(dialog && dialog.validate() && _validateRecipient(alertType)) {
				dialog.execute();
				dialog.hide();
			}
		}
	});	
	
	d.ready(function() {
		// summary:
		//	There is a dependency between these imports and the functions above.
		//	TODO The above functions should probably be moved into a mixin that the below
		//		 classes import
		
		d.require("misys.admin.widget.AlertsTransaction");
		d.require("misys.admin.widget.AlertTransaction");
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.alert_transaction_client');