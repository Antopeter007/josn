dojo.provide("misys.binding.feesandbilling.feesandbilling");

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

		if (dj.byId("entity") && dj.byId("entity").get("value") !== "") {
			entity = dj.byId("entity").get("value");
			if ("*" === entity) {
				entity = "wildCard";
			}
		} else if (dj.byId("entity") && dj.byId("entity").get("value") === "") {
			entity = "wildCard";
		}
		else {
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
		if (dj.byId("customerId")) {
			customerId = dj.byId("customerId");
		}
		if (dj.byId("cust_ref_id")) {
			customerId = dj.byId("cust_ref_id");
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

		if (dj.byId("customerId") && dj.byId("customerId").get("value") !== "") {
			dj.byId("customerId").set("value", "");
		}
		if (dj.byId("cust_ref_id") && dj.byId("cust_ref_id").get("value") !== "") {
			dj.byId("cust_ref_id").set("value", "");
		}
		populateReferences();
	}
	function _handleBankOnChangeFields() {
		if (dj.byId("customerId")) {
			dj.byId("customerId").set("value", "");
		}
		if (dj.byId("cust_ref_id")) {
			dj.byId("cust_ref_id").set("value", "");
		}
		populateReferences();
	}
	function _validateCreationFromDate() {
		// summary:
		// Validates the data entered for creation from date
		// tags:
		// public, validation

		// Return true for empty values

		var that = this;
		if (that.get('value') === null) {
			return true;
		}
		m._config = m._config || {};
		m._config.effFromDateValidationInprocess = false;
		console.debug('[Validate] Validating Creation From Date. Value = ' + that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var creationToDate = dj.byId('create_date2');
		if (!m._config.effToDateValidationInprocess && !m.compareDateFields(that, creationToDate)) {
				m._config.effFromDateValidationInprocess = true;
				var widget = dj.byId('create_date');
				displayMessage = misys.getLocalization('TransactionDateFromLesserThanTransactionDateTo');
				widget.set("state", "Error");
				dj.hideTooltip(widget.domNode);
				dj.showTooltip(displayMessage, widget.domNode, 0);
				return false;
		}
		m._config.effFromDateValidationInprocess = false;

		return true;
	}
	function _validateCreationToDate() {
		// summary:
		// Validates the data entered for creation to date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		m._config = m._config || {};
		m._config.effToDateValidationInprocess = false;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Creation To Date. Value = ' + that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var creationFromDate = dj.byId('create_date');
		if (!m._config.effFromDateValidationInprocess) {
			m._config.effToDateValidationInprocess = true;
			if (!m.compareDateFields(creationFromDate, that)) {
				var widget = dj.byId('create_date2');
				displayMessage = misys.getLocalization('TransactionDateToGreaterThanTransactionDateFrom');
				widget.set("state", "Error");
				dj.hideTooltip(widget.domNode);
				dj.showTooltip(displayMessage, widget.domNode, 0);
				return false;
			}
		}

		m._config.effToDateValidationInprocess = false;
		return true;
	}

	function _validateDueFromDate() {
		// summary:
		// Validates the data entered for creation from date
		// tags:
		// public, validation

		// Return true for empty values

		var that = this;
		if (that.get('value') === null) {
			return true;
		}
		m._config = m._config || {};
		m._config.effFromDateValidationInprocess = false;
		console.debug('[Validate] Validating Due From Date. Value = ' + that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var dueToDate = dj.byId('inv_due_date2');
		if (!m._config.effToDateValidationInprocess && !m.compareDateFields(that, dueToDate)) { 
				m._config.effFromDateValidationInprocess = true;
				var widget = dj.byId('inv_due_date');
				displayMessage = misys.getLocalization('TransactionDateFromLesserThanTransactionDateTo');
				widget.set("state", "Error");
				dj.hideTooltip(widget.domNode);
				dj.showTooltip(displayMessage, widget.domNode, 0);
		}
		m._config.effFromDateValidationInprocess = false;

		return true;
	}

	function _validateDueToDate() {
		// summary:
		// Validates the data entered for creation to date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		m._config = m._config || {};
		m._config.effToDateValidationInprocess = false;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Due To Date. Value = ' + that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
	
		var dueFromDate = dj.byId('inv_due_date');
		if (!m._config.effFromDateValidationInprocess) {
			m._config.effToDateValidationInprocess = true;
			if (!m.compareDateFields(dueFromDate, that)) {
				var widget = dj.byId('inv_due_date2');
				displayMessage = misys.getLocalization('DueDateToGreaterThanDueDateFrom');
				widget.set("state", "Error");
				dj.hideTooltip(widget.domNode);
				dj.showTooltip(displayMessage, widget.domNode, 0);
				return false;
			}
		}

		m._config.effToDateValidationInprocess = false;
		return true;
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
	function _setAmountValue() {
		if(dj.byId('AmountRangevisible')){
		var amountRange = dj.byId('AmountRangevisible').value;
		var amountRangeValue = isNaN(amountRange) ? 0 : amountRange;
		// set the amount range value
		dj.byId('AmountRange').set('value', amountRange);
		var amountRange2 = dj.byId('AmountRange2visible').value;
		// var amountRangeValue2 = isNaN(amountRange2) ? 0 : amountRange2;
		dj.byId('AmountRange2').set('value', amountRange2);
		/*
		 * if(isNaN(amountRange)){ dj.byId('AmountRange').value = null; }
		 * if(isNaN(amountRange2)){ dj.byId('AmountRange2').value = null; }
		 */
		}
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
	// To check the mandatory field and restrict the search if mandatory field is empty. 
	function _checkMandatoryField(widget) {

		m._config = m._config || {};
		m._config.fieldValidationinProcess = false;
		var fieldvalue = dj.byId(widget) ? dj.byId(widget).get("value") : "";

		//check mandatory field is empty or not

		if (fieldvalue.length === 0 || !fieldvalue.trim()) {

			m._config.fieldValidationinProcess = true;
			var id = dj.byId(widget);
				var displayMessage = misys.getLocalization('mandatoryFieldIsRequired');
				id.focus();
				id.set("state", "Error");
				dj.hideTooltip(id.domNode);
				dj.showTooltip(displayMessage, id.domNode, 0);
				return false;
		}

		m._config.fieldValidationinProcess = false;
		return true;
	}
	d.mixin(m,
					{
						bind : function() {
							m.setValidation('feeCcy', m.validateCurrency);
							m.connect("entity", "onChange",
									_handleEntityOnChangeFields);
							populateBanks();
							m.connect("bank", "onChange",
									_handleBankOnChangeFields);
							m.connect("create_date", "onBlur",
									_validateCreationFromDate);
							m.connect("create_date2", "onBlur",
									_validateCreationToDate);
							m.connect("inv_due_date", "onBlur",
									_validateDueFromDate);
							m.connect("inv_due_date2", "onBlur",
									_validateDueToDate);
							m.connect("AmountRangevisible", "onBlur",
									_validateMinimumAmount);
							m.connect("AmountRange2visible", "onBlur",
									_validateMaximumAmount);
							m.toggleRequired("bank", true);
							m.toggleRequired("customerId", true);
							m.connect("submitButton","onClick", function() {
												m._config.fieldValidationinProcess = false;
												if (dj.byId('bank') && !m._config.fieldValidationinProcess) {
													_checkMandatoryField("bank");
												}
												if (dj.byId('customerId') && !m._config.fieldValidationinProcess) {
													_checkMandatoryField("customerId");
												}
												_setAmountValue();
											});
							
							m.connect("dijit_form_DropDownButton_1_label","onClick", function() {
								if (dj.byId('customerId') && "" === dj.byId('customerId').get("value")) {
									_checkMandatoryField("customerId");
								}
								
							});
							
						},

						onFormLoad : function() {
							var bank = dj.byId('bank');
							var bank_abbv_name = dj.byId('bank_abbv_name');
							if ((bank && bank.get("value") !== "") || (bank_abbv_name && bank_abbv_name.get("value") !== "")) {
									populateReferences();
							}
							if(bank && bank.get("value") === "") {
								populateBanks();
							}
						}
					});
})(dojo, dijit, misys);//Including the client specific implementation
dojo.require('misys.client.binding.feesandbilling.feesandbilling_client');