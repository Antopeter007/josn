dojo.provide("misys.binding.feesandbilling.bankinvoice");

dojo.require("misys.validation.common");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.Select");
dojo.require("misys.form.common");
dojo.require("misys.widget.Dialog");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("misys.form.CurrencyTextBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	function populateBanks() {
		var entity = null;
		var bank = {};
		if (dj.byId("bank")) {
			bank = dj.byId("bank");
		}
		if (dj.byId("entity") && dj.byId("entity").get("value") === "") {
			entity = "wildCard";
		}
		else if (dj.byId("entity") && dj.byId("entity").get("value") !== "") {
			entity = dj.byId("entity").get("value");
			if ("*" === entity) {
				entity = "wildCard";
			}
		} else {
			entity = "All";
		}
		if (misys._config.entityBanksMap) {
			var customerBankDataStore = null;
			customerBankDataStore = m._config.entityBanksMap[entity];

			if (customerBankDataStore) {
				bank.store = new dojo.data.ItemFileReadStore({
					data : {
						identifier : "value",
						label : "name",
						items : customerBankDataStore
					}
				});
				bank.fetchProperties = {
					sort : [ {
						attribute : "name"
					} ]
				};
			} else {
				bank.store = null;
			}
		}
	}

	function populateReferences() {
		var entity = null;
		var customerId = {};
		var bank = "";
		
		if (dj.byId("applicant_reference")) {
			customerId = dj.byId("applicant_reference");
		}
		if (dj.byId("entity") && dj.byId("entity").get("value") === "") {
			entity = "wildCard";	
		}
		if (dj.byId("entity") && dj.byId("entity").get("value") !== "") {
			entity = dj.byId("entity").get("value");
			if ("*" === entity) {
				entity = "wildCard";
			}
		}
		if (dj.byId("bank")) {
			if (dj.byId("bank").get("value") !== "") {
				bank = dj.byId("bank").get("value");
			}
			else{
				dj.byId("bank_abbv_name").set("value","wildCard");
				bank = dj.byId("bank_abbv_name").get("value");
			}
		} else {
			if (dj.byId("bank_abbv_name") && dj.byId("bank_abbv_name").get("value") !== "") {
				bank = dj.byId("bank_abbv_name").get("value");
			}
		}

		if (bank !== "" && misys._config.entityBanksRefJson) {
			var customerReferenceDataStore = null;
			if (null === entity) {
				customerReferenceDataStore = m._config.entityBanksRefJson[bank];
			} else {
				customerReferenceDataStore = m._config.entityBanksRefJson[entity + "_" + bank];
			}
			if (customerReferenceDataStore) {
				customerId.store = new dojo.data.ItemFileReadStore({
					data : {
						identifier : "value",
						label : "name",
						items : customerReferenceDataStore
					}
				});
				customerId.fetchProperties = {
					sort : [ {
						attribute : "name"
					} ]
				};
			}
			else {
				customerId.store = null;
			}
		} 
	}

	function _handleEntityOnChangeFields() {
		if (dj.byId("bank") && dj.byId("bank").get("value") !== "") {
			dj.byId("bank").set("value", "");
		}
		populateBanks();
		if (dj.byId("applicant_reference") && dj.byId("applicant_reference").get("value") !== "") {
			dj.byId("applicant_reference").set("value", "");
		}
		populateReferences();
	}
	function _handleBankOnChangeFields() {
		if (dj.byId("applicant_reference")) {
			dj.byId("applicant_reference").set("value", "");
		}
		populateReferences();
	}

	function _validateInvoiceDate(){
		var that = this;
		var invDateFrom = dj.byId('create_date');
		var invDateTo = dj.byId('create_date2');
		if (that.get('value') === null) {
			return true;
		}
		if(that.get('id')==='create_date'){
		
			m._config = m._config || {};
			m._config.effFromDateValidationInprocess = false;
			console.debug('[Validate] Validating Creation From Date. Value = ' + that.get('value'));
			
			//var invDateTo = dj.byId('create_date2');
			if (!m._config.effToDateValidationInprocess && !m.compareDateFields(that, invDateTo)) {
					m._config.effFromDateValidationInprocess = true;
					//var invDateFrom = dj.byId('create_date');
					displayMessage = misys.getLocalization('InvoiceDateFromLesserThanInvoiceDateTo');
				    // invDateFrom.focus();
					invDateFrom.set("state", "Error");
					dj.hideTooltip(invDateFrom.domNode);
					dj.showTooltip(displayMessage, invDateFrom.domNode, 0);
			}
			m._config.effFromDateValidationInprocess = false;

			return true;
			}
		
		if(that.get('id')==='create_date2')
		{
			
			console.debug('[Validate] Validating Creation To Date. Value = ' + that.get('value'));
			
			
			if (!m._config.effFromDateValidationInprocess && !m.compareDateFields(invDateFrom, that)) {
				m._config.effToDateValidationInprocess = true;
					
					displayMessage = misys.getLocalization('InvoiceDateToGreaterThanInvoiceDateFrom');
					// invDateTo.focus();
					invDateTo.set("state", "Error");
					dj.hideTooltip(invDateTo.domNode);
					dj.showTooltip(displayMessage, invDateTo.domNode, 0);
					return false;
				}
			m._config.effToDateValidationInprocess = false;
			return true;	
			}		
	
		
	}


	function _validateDueDate(){
		var that = this;
		var dueDateTo = dj.byId('inv_due_date2');
		var dueDateFrom = dj.byId('inv_due_date');
		if (that.get('value') === null) {
			return true;
		}
		m._config = m._config || {};
		m._config.effToDateValidationInprocess = false;
		
		if(that.get('id')==='inv_due_date'){
			m._config = m._config || {};
		m._config.effFromDateValidationInprocess = false;
		console.debug('[Validate] Validating Due From Date. Value = ' + that.get('value'));
		
		
		if (!m._config.effToDateValidationInprocess && !m.compareDateFields(that, dueDateTo)) { 
				m._config.effFromDateValidationInprocess = true;
				
				displayMessage = misys.getLocalization('DueDateFromLesserThanDueDateTo');
				// dueDateFrom.focus();
				dueDateFrom.set("state", "Error");
				dj.hideTooltip(dueDateFrom.domNode);
				dj.showTooltip(displayMessage, dueDateFrom.domNode, 0);
		}
		m._config.effFromDateValidationInprocess = false;

		return true;
	}	
		if(that.get('id')==='inv_due_date2'){	
			
			console.debug('[Validate] Validating Due To Date. Value = ' + that.get('value'));
			
			//var dueDateFrom = dj.byId('inv_due_date');
			if (!m._config.effFromDateValidationInprocess && !m.compareDateFields(dueDateFrom, that)) {
				m._config.effToDateValidationInprocess = true;
				//	var dueDateTo = dj.byId('inv_due_date2');
					displayMessage = misys.getLocalization('DueDateToGreaterThanDueDateFrom');
					// dueDateTo.focus();
					dueDateTo.set("state", "Error");
					dj.hideTooltip(dueDateTo.domNode);
					dj.showTooltip(displayMessage, dueDateTo.domNode, 0);
					return false;
			}
			m._config.effToDateValidationInprocess = false;
			return true;
		}
		
		
	}

	function _validateMinimumAmount() {
		//  summary:
		//        Validates minimum amount. Minimum amount should be greater than zero and less than maximum amount.
		var amount = this.get("value"), that = this;

		console.debug(
				"[misys.validation.common] Validating minimum amount. Value",
				amount);
		m._config = m._config || {};
		m._config.effFromAmountValidationInprocess = false;

		var toValue = dj.byId('AmountRange2visible').get('value');
		if (!m._config.effToAmountValidationInprocess && (amount < 0 || amount > toValue)) {
				m._config.effFromAmountValidationInprocess = true;
				var widget = dj.byId('AmountRangevisible');
				if (amount > toValue) {
					displayMessage = misys.getLocalization('invalidMinAmountValueError');
				}
				if (amount < 0) {
					displayMessage = misys.getLocalization('invalidAmountValueError');
				}
				widget.set("state", "Error");
				dj.hideTooltip(widget.domNode);
				dj.showTooltip(displayMessage, widget.domNode, 0);
				return false;
		}

		m._config.effFromAmountValidationInprocess = false;
		return true;
	}

	function _validateMaximumAmount() {
		//  summary:
		//        Validates minimum amount. Minimum amount should be greater than zero and greater than minimum amount.
		var amount = this.get("value"), that = this;

		console.debug(
				"[misys.validation.common] Validating minimum amount. Value",
				amount);
		m._config = m._config || {};
		m._config.effToAmountValidationInprocess = false;
		var fromValue = dj.byId('AmountRangevisible').get('value');
		if (!m._config.effFromAmountValidationInprocess && (amount < 0 || amount < fromValue)) {
				m._config.effToAmountValidationInprocess = true;
				var widget = dj.byId('AmountRange2visible');
				if (amount < fromValue) {
					displayMessage = misys.getLocalization('invalidMaxAmountValueError');
				}
				if (amount < 0) {
					displayMessage = misys.getLocalization('invalidAmountValueError');
				}
				widget.set("state", "Error");
				dj.hideTooltip(widget.domNode);
				dj.showTooltip(displayMessage, widget.domNode, 0);
				return false;
		}
		m._config.effToAmountValidationInprocess = false;
		return true;
	}
	
	function _setAmountValue() {
		if(dj.byId('AmountRangevisible')){
		var amountRange = dj.byId('AmountRangevisible').value;
		var amountRangeValue = isNaN(amountRange) ? 0 : amountRange;
		// set the amount range value
		dj.byId('AmountRange').set('value', amountRange);
		var amountRange2 = dj.byId('AmountRange2visible').value;
		
		dj.byId('AmountRange2').set('value', amountRange2);
		
		}
	}

	d.mixin(m,
					{
						bind : function() {
							m.connect("entity", "onChange",
									_handleEntityOnChangeFields);
							populateBanks();
							m.connect("bank", "onChange",
									_handleBankOnChangeFields);
							m.connect("create_date", "onBlur",
									_validateInvoiceDate);
							m.connect("create_date2", "onBlur",
									_validateInvoiceDate);
							m.connect("inv_due_date", "onBlur",
									_validateDueDate);
							m.connect("inv_due_date2", "onBlur",
									_validateDueDate);
							m.connect("AmountRangevisible", "onBlur",
									_validateMinimumAmount);
							m.connect("AmountRange2visible", "onBlur",
									_validateMaximumAmount);
							
							m.connect("submitButton","onClick", function() {
												m._config.fieldValidationinProcess = false;
												_setAmountValue();
											});
						},

						onFormLoad : function() {
							if(dijit.byId("bank"))
							{
								dijit.byId("bank").set("value","");
							}
							populateReferences();
							if(dijit.byId("applicant_reference"))
							{
								dijit.byId("applicant_reference").set("value","");
							}
							if(dijit.byId("payment_status"))
							{
								dijit.byId("payment_status").set('value',"Not Paid");
							}
							if(dijit.byId("status"))
							{
								dijit.byId("status").set('value',"A");	
							}
						}
					});
})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.feesandbilling.bankinvoice_client');