dojo.provide("misys.binding.common.listdef_mc");
/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Message Center Page


Copyright (c) 2000-2012 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      06/11/11
-----------------------------------------------------------------------------
*/

dojo.require("dojo.data.ItemFileReadStore");
dojo.require('dojo.data.ItemFileWriteStore');
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.SortedFilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("dijit.form.RadioButton");
dojo.require("misys.binding.common.reauth_listdef_common");
dojo.require("misys.binding.system.reauth");
dojo.require("misys.binding.common.reauth_listdef");
dojo.require("misys.common");
dojo.require("misys.binding.loan.ln_tnxdropdown_validation_list");


(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {
	
	function _disableAccountNumber() {
		console.debug("Disable Account No");
		if (dj.byId("account_no")) {
			dj.byId("account_no").set("disabled", true);
		}
	}
	function _enableAccountNumber() {
		console.debug("Enable Account No");
		if (dj.byId("account_no")) {
			dj.byId("account_no").set("disabled", false);
		}
	}

	function _disableSearchIcon() {
		console.debug("Disable Search Icon");
		if (d.byId("account_search_id")) {
			d.style(d.byId("account_search_id"), "display", "none");
			dj.byId("account_no").set("value", "");
		}
	}

	function _enableSearchIcon() {
		console.debug("Enable Search Icon");
		if (d.byId("account_search_id")) {
			d.style(d.byId("account_search_id"), "display", "");
		}
	}

	function _enableAmountRange() {
		if (dj.byId('cur_code').value !== "") {
			dj.byId('AmountRangevisible').set("disabled", false);
			dj.byId('AmountRange2visible').set("disabled", false);
		} else if (dj.byId('cur_code').value === "") {
			dj.byId('AmountRangevisible').set("disabled", true);
			dj.byId('AmountRange2visible').set("disabled", true);
			dj.byId('AmountRangevisible').reset();
			dj.byId('AmountRange2visible').reset();
		}
	}
	
	function _disableFileReference() {
		console.debug("Disable File Reference");
		if (d.byId("upload_file_id")) {
			dj.byId("upload_file_id").set("disabled", true);
		}
	}
	
	function _enableFileReference() {
		console.debug("Enable File Reference");
		if (d.byId("upload_file_id")) {
			dj.byId("upload_file_id").set("disabled", false);
		}
	}
	
  function _clearDependendFields(){
	  console.debug("Clear Dependent Fields");
	  // clear account no.
	  if(dj.byId("account_no"))
	  {
		  dj.byId("account_no").set("value","");
	  }
	  if(dj.byId("tnx_stat_code"))
	  {
		  dj.byId("tnx_stat_code").set("value","");
	  }
	  if(dj.byId("cust_ref_id"))
	  {
		  dj.byId("cust_ref_id").set("value","");
	  }
	  if(dj.byId("cur_code"))
	  {
		  dj.byId("cur_code").set("value","");
	  }
	  if(dj.byId("AmountRangevisible"))
	  {
		  dj.byId("AmountRangevisible").set("value","");
	  }
	  if(dj.byId("AmountRange2visible"))
	  {
		  dj.byId("AmountRange2visible").set("value","");
	  }
	  if(dj.byId("counterparty_name"))
	  {
		  dj.byId("counterparty_name").set("value","");
	  }
	  if(dj.byId("create_date") && dj.byId("create_date").get("value") !== "")
	  {
		  dj.byId("create_date").set("value","");
		  dj.byId("create_date").set("displayedValue","");
	  }
	  if(dj.byId("create_date2") && dj.byId("create_date2").get("value") !== "")
	  {
		  dj.byId("create_date2").set("value","");
		  dj.byId("create_date2").set("displayedValue","");
	  }
	  if(dj.byId("maturity_date")&& dj.byId("maturity_date").get("value") !== "")
	  {
		  dj.byId("maturity_date").set("value","");
		  dj.byId("maturity_date").set("displayedValue","");
	  }
	  if(dj.byId("maturity_date2")&& dj.byId("maturity_date2").get("value") !== "")
	  {
		  dj.byId("maturity_date2").set("value","");
		  dj.byId("maturity_date2").set("displayedValue","");
	  }
	  if(dj.byId("ref_id"))
	  {
		  dj.byId("ref_id").set("value","*");
	  }
	  if(dj.byId("entity"))
	  {
		  dj.byId("entity").set("value","");
	  }
	  
	  
  }
  
  function _validateMinimumAmount() {
		//  summary:
	    //        Validates minimum amount. Minimum amount should be greater than zero and less than maximum amount.
		var amount = this.get("value"),
			that = this;
		
		console.debug("[misys.validation.common] Validating minimum amount. Value", amount);
		 m._config = m._config || {};
		 m._config.effFromAmountValidationInprocess = false;
		
		var toValue = dj.byId('AmountRange2visible').get('value');
		if(!m._config.effToAmountValidationInprocess)
			{
				if(amount < 0 || amount > toValue)
				{
					m._config.effFromAmountValidationInprocess = true;
					var widget = dj.byId('AmountRangevisible');
				  	if (amount > toValue)
				  	{
				  		displayMessage = misys.getLocalization('invalidMinAmountValueError');
				  	}
				  	if (amount < 0)
				  	{
						displayMessage = misys.getLocalization('invalidAmountValueError');
				  	}
			 		widget.focus();
			 		widget.set("state","Error");
			 		dj.hideTooltip(widget.domNode);
			 		dj.showTooltip(displayMessage, widget.domNode, 0);
			 		dj.showTooltip(displayMessage, domNode, 0);
			 		return false;
				}
			}
				
		 m._config.effFromAmountValidationInprocess = false;	
		return true;
	}
	
	function _validateMaximumAmount() {
		//  summary:
	    //        Validates minimum amount. Minimum amount should be greater than zero and greater than minimum amount.
		var amount = this.get("value"),
			that = this;
		
		console.debug("[misys.validation.common] Validating minimum amount. Value", amount);
		 m._config = m._config || {};
		 m._config.effToAmountValidationInprocess = false;
		var fromValue = dj.byId('AmountRangevisible').get('value');
		if(!m._config.effFromAmountValidationInprocess)
			{
				if(amount < 0 || amount < fromValue)
				{
					m._config.effToAmountValidationInprocess = true;
					var widget = dj.byId('AmountRange2visible');
				  	if (amount < fromValue)
				  	{
				  		displayMessage = misys.getLocalization('invalidMaxAmountValueError');
				  	}
				  	if (amount < 0)
				  	{
						displayMessage = misys.getLocalization('invalidAmountValueError');
				  	}
			 		widget.focus();
			 		widget.set("state","Error");
			 		dj.hideTooltip(widget.domNode);
			 		dj.showTooltip(displayMessage, widget.domNode, 0);
			 		dj.showTooltip(displayMessage, domNode, 0);
			 		return false;
				}
			}	
		m._config.effToAmountValidationInprocess = false;
		return true;
	}
	
	
	function _validateFromDateLesserThanToDate(fromDate, toDateId, toolTipMsgKey, toolTipDateLabel){
		if (fromDate.get('value') == null)
		{
			return true;
		}
		 m._config = m._config || {};
		 m._config.effFromDateValidationInprocess = false;
		var displayMessage;
		var toDate = dj.byId(toDateId);
		var hideTT = function() {
			dj.hideTooltip(fromDate.domNode);
		}; 
		 if(!m._config.effToDateValidationInprocess)
			 {
				if (!m.compareDateFields(fromDate, toDate))
				{
					 m._config.effFromDateValidationInprocess = true;
					displayMessage = misys.getLocalization(toolTipMsgKey, 
							[toolTipDateLabel , _localizeDisplayDate(fromDate), _localizeDisplayDate(toDate)]);
					// fromDate.focus();
					//fromDate.set("displayedValue", "");
					fromDate.set("state", "Error");
					dj.showTooltip(displayMessage, fromDate.domNode, 0);
					setTimeout(hideTT, 5000);
					return false;
				}
			 }	
		 m._config.effFromDateValidationInprocess = false;
		return true;
	}
	
	function _localizeDisplayDate( /* dijit._Widget */dateField){
		if (dateField.get("type") === "hidden")
		{
			return d.date.locale.format(m.localizeDate(dateField),{selector : "date"});
		}
		return dateField.get("displayedValue");
	}

	function _validateToDateGreaterThanFromDate(toDate, fromDateId, toolTipMsgKey, toolTipDateLabel){
		var displayMessage;
		 m._config = m._config || {};
		 m._config.effToDateValidationInprocess = false;
		var fromDate = dj.byId(fromDateId);
		var hideTT = function() {
			dj.hideTooltip(toDate.domNode);
		};
		if(!m._config.effFromDateValidationInprocess)
			{
				if (!m.compareDateFields(fromDate, toDate))
				{
					m._config.effToDateValidationInprocess = true;
					displayMessage = misys.getLocalization(toolTipMsgKey, 
							[toolTipDateLabel, _localizeDisplayDate(toDate), _localizeDisplayDate(fromDate)]);
					// toDate.focus();
					toDate.set("state", "Error");
					//dj.hideTooltip(toDate.domNode);
					dj.showTooltip(displayMessage, toDate.domNode, 0);
					setTimeout(hideTT, 5000);
					return false;
				}
			}	
		 m._config.effToDateValidationInprocess = false;
		return true;
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
		console.debug('[Validate] Validating Creation From Date. Value = '+ that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var creationToDate = dj.byId('create_date2');
		 if(!m._config.effToDateValidationInprocess)
			 {
				if (!m.compareDateFields(that, creationToDate)) {
					 m._config.effFromDateValidationInprocess = true;
					var widget = dj.byId('create_date');
						displayMessage = misys.getLocalization('LastModifiedDateFromLesserThanLastModifiedDateTo');
						// widget.focus();
						widget.set("state","Error");
						dj.hideTooltip(widget.domNode);
						dj.showTooltip(displayMessage, widget.domNode, 0);
				}
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
		console.debug('[Validate] Validating Creation To Date. Value = '+ that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var creationFromDate = dj.byId('create_date');
		 if(!m._config.effFromDateValidationInprocess)
			 {
			 m._config.effToDateValidationInprocess = true;
				if (!m.compareDateFields(creationFromDate, that)) {
					var widget = dj.byId('create_date2');
					  	displayMessage = misys.getLocalization('LastModifiedDateToGreaterThanLastModifiedDateFrom');
				 		// widget.focus();
				 		widget.set("state","Error");
				 		dj.hideTooltip(widget.domNode);
				 		dj.showTooltip(displayMessage, widget.domNode, 0);
				 	return false;		
				}
			 }	
		 
		 m._config.effToDateValidationInprocess = false;
		return true;
	}
	function _validateMaturityFromDate() {
		// summary:
		// Validates the data entered for maturity from date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		if (that.get('value') === null) {
			return true;
		}
		  m._config = m._config || {};
		  m._config.effFromDateValidationInprocess = false;
		console.debug('[Validate] Validating Maturity From Date. Value = '+ that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var maturityToDate = dj.byId('maturity_date2');
		 if(!m._config.effToDateValidationInprocess)
			 {
				if (!m.compareDateFields(that, maturityToDate)) {
					m._config.effFromDateValidationInprocess = true;
					var widget = dj.byId("maturity_date"),
					    displayMessage = misys.getLocalization('maturityFromGreaterThanMaturityTo');
					var hideTT = function() {
						dj.hideTooltip(widget.domNode);
					};
				 		// widget.focus();
				 		widget.set("state","Error");
				 		//dj.hideTooltip(widget.domNode);
				 		dj.showTooltip(displayMessage, widget.domNode, 0);
				 		setTimeout(hideTT, 5000);
				 		return false;
				}
			 }	
		 m._config.effFromDateValidationInprocess = false;
		return true;

	}
	function _validateMaturityToDate() {

		// summary:
		// Validates the data entered for maturity to date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		 m._config = m._config || {};
		 m._config.effToDateValidationInprocess = false;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Maturity To Date. Value = '+ that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var maturityFromDate = dj.byId('maturity_date');
		if(!m._config.effFromDateValidationInprocess)
			{
				if (!m.compareDateFields(maturityFromDate, that)) {
					 m._config.effToDateValidationInprocess = true;
					var widget = dj.byId('maturity_date2');
					 	displayMessage = misys.getLocalization('maturityToLesserThanMaturityFrom');
					 	var hideTT = function() {
							dj.hideTooltip(widget.domNode);
						};
				 		// widget.focus();
				 		widget.set("state","Error");
				 		//dj.hideTooltip(widget.domNode);
				 		dj.showTooltip(displayMessage, widget.domNode, 0);
				 		setTimeout(hideTT, 5000);
				 		 return false;
				}
			}	
		 m._config.effToDateValidationInprocess = false;
		return true;
	}
	function _validateLastModifiedFromDate() {
		// summary:
		// Validates the data entered for Last Modified from date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Last Modified From Date. Value = '+ that.get('value'));
		
		var lastModifiedToDate = dj.byId('last_modified_date2');
		if (!m.compareDateFields(that, lastModifiedToDate)) {
			var widget = dj.byId("last_modified_date"),
			    displayMessage = misys.getLocalization('LastModifiedFromGreaterThanLastModifiedTo');
		 		widget.set("displayedValue", "");
		 		widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		return false;
		}

		var currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);
		isValid = d.date.compare(m.localizeDate(that), currentDate) > 0 ? false : true;
		if (!isValid)
		{
			displayMessage = misys.getLocalization('LastModifiedDateGreaterThanCurrentDate');
			// that.focus();
			that.set("state", "Error");
			dj.hideTooltip(that.domNode);
			dj.showTooltip(displayMessage, that.domNode, 0);
			return false;
		}
		
		return true;
	}
	
	function _validateLastModifiedToDate() {

		// summary:
		// Validates the data entered for Last Modified to date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Last Modified To Date. Value = '+ that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var lastModifiedFromDate = dj.byId('last_modified_date');
		if (!m.compareDateFields(lastModifiedFromDate, that)) {
			var widget = dj.byId('last_modified_date2');
			 	displayMessage = misys.getLocalization('LastModifiedToLesserThanLastModifiedFrom');
		 		widget.set("displayedValue", "");
		 		widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		}
		

		return true;
	}

	function _setSubProductTypes() {
		
		// Clear the sub product list before selecting the sub products based on the selected product
		if(dj.byId('sub_product_code') && dj.byId('sub_product_code').get('value') !== '')
		{
			dj.byId('sub_product_code').set('value', '');
		}
		
		var productCode = dj.byId('parameter1').get('value'), 
			replacedProductCodes = new Array();
			// replace the product code as transaction list def contains product +
			// Tnx as suffix
			replacedProductCodes = productCode.split("Tnx");
		var	existingSubProductWidget = dj.byId('sub_product_code'),
			subProductsData = m._config.SubProductsByProductsByCollection[replacedProductCodes[0]];
			existingSubProductWidget.store = null;
			// intialze the store for sub product code drop down
			existingSubProductWidget.store = new dojo.data.ItemFileReadStore({
				data : {
					identifier : "ID",
					label : "name",
					items : subProductsData
				}
			});
	}
	
	/*function _validateThisDateLesserThanCurrentDate(dateFieldElement, toolTipDateLabel){
		var that = dateFieldElement;
		var displayMessage;
		var currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);
		isValid = d.date.compare(m.localizeDate(that), currentDate) > 0 ? false : true;
		if (!isValid)
		{
			displayMessage = misys.getLocalization('thisDateGreaterThanCurrentDate', 
					[toolTipDateLabel, _localizeDisplayDate(that)]);
			that.focus();
			that.set("state", "Error");
			dj.hideTooltip(that.domNode);
			dj.showTooltip(displayMessage, that.domNode, 0);
			return false;
		}
		return true;
	}*/

	function _setAmountValue() {
		if(dj.byId('AmountRangevisible')){
		var amountRange = dj.byId('AmountRangevisible').value;
		var amountRangeValue = isNaN(amountRange) ? 0 : amountRange;
		dj.byId('AmountRange').set('value', amountRange);
		var amountRange2 = dj.byId('AmountRange2visible').value;
		dj.byId('AmountRange2').set('value', amountRange2);
		}
	}
	d.mixin(m, {
		bind : function() {

			// validate the currency
			m.setValidation('cur_code', m.validateCurrency);
			m.connect("AmountRangevisible", "onBlur", _validateMinimumAmount);
			m.connect("AmountRange2visible", "onBlur", _validateMaximumAmount);
			m.connect("maturity_date", "onBlur", _validateMaturityFromDate);
			m.connect("maturity_date2", "onBlur", _validateMaturityToDate);
			m.connect("last_modified_date", "onBlur", _validateLastModifiedFromDate);
			m.connect("last_modified_date2", "onBlur", _validateLastModifiedToDate);
			// Clear the account field if entity has been changed.
			m.connect("entity", "onChange", function()
			{
				var field = dj.byId("account_no");
				if (field)
				{
					field.set("value", "");
				}	
			});
			// set the amount value
			m.connect('submitButton', 'onClick', function(){ 
				_setAmountValue();
			});
			// set the sub product codes for selected product
			m.connect('parameter1', 'onChange', _setSubProductTypes);
			m.connect("tnx_type_code_dropdown", "onChange", m.validateLoanTransactionTypeDropDown);
			
			m.connect("create_date", "onBlur", function(){
				var that = this;
				_validateFromDateLesserThanToDate(that, "create_date2",
						"generalFromDateGreaterThanToDate", misys.getLocalization('ApplicationDate'));
			//	_validateThisDateLesserThanCurrentDate(that, misys.getLocalization("upload"));
			});

			m.connect("create_date2", "onBlur", function(){
				var that = this;
				_validateToDateGreaterThanFromDate(that, "create_date",
						"generalToDateGreaterThanFromDate", misys.getLocalization('ApplicationDate'));
				// _validateThisDateLesserThanCurrentDate(that, misys.getLocalization("upload"));
			});
			
			m.connect("transfer_date", "onBlur", function(){
				var that = this;
				_validateFromDateLesserThanToDate(that, "transfer_date2",
						"generalFromDateGreaterThanToDate", misys.getLocalization('TransferDate'));
			});

			m.connect("transfer_date2", "onBlur", function(){
				var that = this;
				_validateToDateGreaterThanFromDate(that, "transfer_date",
						"generalToDateGreaterThanFromDate", misys.getLocalization('TransferDate'));
			});
			
			m.connect("upload_date", "onBlur", function(){
				var that = this;
				_validateFromDateLesserThanToDate(that, "upload_date2",
						"generalFromDateGreaterThanToDate", misys.getLocalization('upload'));
			});

			m.connect("upload_date2", "onBlur", function(){
				var that = this;
				_validateToDateGreaterThanFromDate(that, "upload_date",
						"generalToDateGreaterThanFromDate", misys.getLocalization('upload'));
				//_validateThisDateLesserThanCurrentDate(that, misys.getLocalization("upload"));
			});

		},	
		
		//for FSCM amounts	
		setFSCMAmountValue: function (AmountRange) {
			if(dj.byId(AmountRange+'visible')){
			var amountRange = dj.byId(AmountRange+'visible').value;
			var amountRangeValue = isNaN(amountRange) ? 0 : amountRange;
			// set the amount range value
			dj.byId(AmountRange).set('value', amountRange);
			var amountRange2 = dj.byId(AmountRange+'2visible').value;		
			dj.byId(AmountRange+'2').set('value', amountRange2);
			}
		}		
	});
	
	d.mixin(m._config, {
			doReauthSubmit : function(xhrParams){
				 var paramsReAuth 	= 	{};
				 if(d.isFunction(m._config.initReAuthParams)) 
				 {
					 paramsReAuth 				=  m._config.initReAuthParams();
					 m._config.reauthXhrParams	=  m._config.reauthXhrParams || {};
					 m._config.reauthXhrParams	=  xhrParams;
					 paramsReAuth.list_keys = "";
					 if(xhrParams.content) {
						 paramsReAuth.list_keys	= xhrParams.content.list_keys ? xhrParams.content.list_keys : "";
					 }
					 m._config.executeReauthentication(paramsReAuth);
				 }
			},
			initReAuthParams : function(){	
				var	accountAmountArray	=	m._config.getAmountAccountArray('tnx_amt;amt','Counterparty@counterparty_act_no',true),		
					reAuthParams 		= 	{productCode 		: 'MB',
						         			 subProductCode 	: '',
						        			 transactionTypeCode: '01',
						        			 entity 			: '',			        			
						        			 currency 			: '',
						        			 amount 			: '',
						        			
						        			 es_field1 			: m.trimAmount(m._config.getAmountSum(accountAmountArray)),  
						        			 es_field2 			: m._config.getESIGNFeildForBulk(accountAmountArray)
											};
				// Enable reauth submit button to submit the form
				if(dj.byId("doReauthentication"))
				{
					dj.byId("doReauthentication").set("disabled",false);
				}
				return reAuthParams;
			},
			reauthSubmit : function()
			{
				//Summary: This function append the reauth related parameters to the actual XHR content params and the posts the transaction
				var valueToEE 					= 	dj.byId("reauth_password").get("value");
				// Disable reauth submit button to prevent double click from multiple submission screen
				if(dj.byId("doReauthentication"))
				{
					dj.byId("doReauthentication").set("disabled",true);
				}	
				d.mixin(m._config.reauthXhrParams.content,{
					reauth_otp_response			:	misys.encryptText(valueToEE)
					});
				m.xhrPost (m._config.reauthXhrParams);
				setTimeout(d.hitch(dijit.byId(m._config.getGridId()), "render"), 10000);
				dj.byId("reauth_password").set("value","");
				dj.byId("reauth_dialog").hide();
			},
			nonReauthSubmit : function()
			{
				//Summary: When Reauthentication is defined for then execute the below code
				m.xhrPost (m._config.reauthXhrParams);
				setTimeout(d.hitch(dijit.byId(m._config.getGridId()), "render"), 10000);
			}
	});
	
	d.mixin(m.grid, {
		
		confirmSubmitRecords: function( /*Dojox Grid*/ grid,
			  	 /*String*/ url) {
			// summary:
			//	TODO
			if(misys.grid.client && misys.grid.client.confirmSubmitRecords)
			{
				misys.grid.client.confirmSubmitRecords(grid,url);
			}
			else
			{
				var numSelected = grid.selection.getSelected().length;
				var storeSize	= grid.store._items.length;
				if(numSelected > 0 && storeSize > 0) 
				{
					m.dialog.show("CONFIRMATION", 
							m.getLocalization("submitTransactionsConfirmation", 
									[grid.selection.getSelected().length]), "", 
									function(){ m.grid.processRecordsWithHolidayCutOffValidation(grid, url);});
				} 
				else 
				{
					m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
				}
				
				}
			}	
	});
	
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.common.listdef_mc_client');