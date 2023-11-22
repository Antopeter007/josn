dojo.provide("misys.binding.common.listdef_mt");
/*
-----------------------------------------------------------------------------
Scripts for the list def binding for SI SR Data Migration Tool


Copyright (c) 2020 Finastra (http://www.Finastra.com),
All Rights Reserved. 

version:   1.0
date:      15/05/2020
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
		var displayMessage;
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
		var displayMessage;
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
						var displayMessage = misys.getLocalization('LastModifiedDateFromLesserThanLastModifiedDateTo');
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
					  	var displayMessage = misys.getLocalization('LastModifiedDateToGreaterThanLastModifiedDateFrom');
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
					 	var displayMessage = misys.getLocalization('maturityToLesserThanMaturityFrom');
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
		var isValid = d.date.compare(m.localizeDate(that), currentDate) > 0 ? false : true;
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
			 	var displayMessage = misys.getLocalization('LastModifiedToLesserThanLastModifiedFrom');
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
	
	function _onSubmitClick()
	{
		if(dj.byId("migrate_all").get("value") === "Y")
		{
			if(d.byId("SubmitButtonDiv"))
			{
				d.byId("SubmitButtonDiv").style.display = "block";
			}
		}
		else
		{
			if(d.byId("SubmitButtonDiv"))
			{
				d.byId("SubmitButtonDiv").style.display = "none";
			}
		}
	}
	
	function _clearMessage()
	{
		d.byId("batchContainer").style.display = "none";
	}
	
	function _validateMigrateAll()
	{
		if(dj.byId("status").get("value") === "Y")
			{
				// Migrate ALL disabled if Customer is ALL
				if(dj.byId("company_name_display"))
					{
					if(dj.byId("company_name_display").get("value") === "ALL")
						{
							dj.byId("status").set("disabled",true);
						}
					else
						{
							dj.byId("status").set("disabled",false);
						}
					}
				dj.byId("migrate_all").set("value","Y");
						
				//On Page Load Hide these columns for search
				d.byId("ref_id_row").style.display = "none";
				d.byId("entity_row").style.display = "none";
				d.byId("applicant_name_row").style.display = "none";
				d.byId("bo_ref_id_row").style.display = "none";
				d.byId("beneficiary_name_row").style.display = "none";
				d.byId("cur_code_row").style.display = "none";
				d.byId("exp_date_row").style.display = "none";
				d.byId("submitButton_row").style.display = "none";
				//Migration Completed Message
				d.byId("batchContainer").style.display = "none";
			}
		else
			{
				dj.byId("migrate_all").set("value","N");
				//On Page Load Hide these colums for search
				d.byId("ref_id_row").style.display = "block";
				d.byId("entity_row").style.display = "block";
				d.byId("applicant_name_row").style.display = "block";
				d.byId("bo_ref_id_row").style.display = "block";
				d.byId("beneficiary_name_row").style.display = "block";
				d.byId("cur_code_row").style.display = "block";
				d.byId("exp_date_row").style.display = "block";
				d.byId("submitButton_row").style.display = "block";
				//Migration Completed Message
				d.byId("batchContainer").style.display = "block";
			}
	}
	
	/**
	 * <h4>Summary:</h4>
	 * This fuction is for replacing params in a string URL
	 * @param {String} URL
	 *  URL
	 * @param {String} key
	 *  param key
	 * @param {String} value
	 *  param value
	 * @method _setParamsToURLString
	 */
	function _setParamsToURLString( /*String*/ url, /*String*/ key, /*String*/ value) {
		
		key = encodeURI(key); 
		value = encodeURI(value);
		var finalURL;

        if (url.indexOf('?') === -1) {
        	finalURL = url + '?' + key + '=' + value;
        }
        else {
        	var splitURL = url.split('?')[0];
        	var splitParams = url.split('?')[1].split("&");
        	
            var i = splitParams.length; 
            var x; 
            while (i--) {
                x = splitParams[i].split('=');

                if (x[0] == key) {
                    x[1] = value;
                    splitParams[i] = x.join('=');
                    break;
                }
            }

            if (i < 0) { 
            	splitParams[splitParams.length] = [key, value].join('='); 
            }

            //this will reload the page, it's likely better to store this until finished
            finalURL = splitURL + '?' + splitParams.join('&');
        }
	
		return finalURL;
	}
	
	function fncSelectAllRecords(strFormName)
	  {
	    if (!strFormName) {
	    	strFormName = 'TopForm';
	    }
	    
	    var theForm = document.forms[strFormName];
	    var blnChecked = theForm.elements["select_all_box"].checked;
	    
	    // Scan the form containing the list
	    for (var i=0; i<theForm.length; i++)
	    {
	      if ((theForm.elements[i].type == "checkbox") && (theForm.elements[i].name != "select_all_box"))
	      {
	        theForm.elements[i].checked = blnChecked;
	      }
	    }
	  }
	
	d.mixin(m, {
		bind : function() {
			// validate the currency
			m.setValidation('cur_code', m.validateCurrency);
			m.connect("submitButton","onClick", _onSubmitClick);
			m.connect("status","onChange", _validateMigrateAll);
			m.connect("submitButton","onClick", _clearMessage);
			m.connect("maturity_date", "onBlur", _validateMaturityFromDate);
			m.connect("maturity_date2", "onBlur", _validateMaturityToDate);
			
			// Migrate ALL disabled if Customer is ALL
			if(dj.byId("company_name_display"))
				{
				if(dj.byId("company_name_display").get("value") === "ALL")
					{
						dj.byId("status").set("disabled",true);
					}
				else
					{
						dj.byId("status").set("disabled",false);
					}
				}
			
			//On Page Load Hide these colums for search
			d.byId("ref_id_row").style.display = "none";
			d.byId("entity_row").style.display = "none";
			d.byId("applicant_name_row").style.display = "none";
			d.byId("bo_ref_id_row").style.display = "none";
			d.byId("beneficiary_name_row").style.display = "none";
			d.byId("cur_code_row").style.display = "none";
			d.byId("exp_date_row").style.display = "none";
			d.byId("submitButton_row").style.display = "none";
		},	
		onFormLoad : function() {
			
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
				var migrateAllStatus  = dj.byId("status").value;
				var productCode = dj.byId("product_code").value;
				var companyName = dj.byId("company_name").value;
				var companyID 	= dj.byId("company_id").value;
				if(companyID === "*" || companyID === "0")
					{
						companyName = "ALL";
					}
				var otherParams = dj.byId("company_name_display").get("value") + "," + productCode + "," + migrateAllStatus + "," + companyID;
				
				if(numSelected > 0 && storeSize > 0) 
				{
					m.dialog.show("CONFIRMATION", 
							m.getLocalization("submitMigrateAllTransactionsConfirmation", 
									[productCode,companyName]), "", 
									function(){
										m.grid.processRecords(grid, _setParamsToURLString(url, "otherParams" , otherParams));
									});
				} 
				else 
				{
					if(dj.byId("migrate_all").get("value") === "Y")
						{
						dj.byId("dijit_form_Button_1").set("disabled", true);
						console.debug('[INFO] Begin Ajax call RunMigrationTransaction');
						m.xhrPost({
							url : m.getServletURL("/screen/AjaxScreen/action/RunMigrationTransaction"),
							handleAs : "json",
							sync 		: true,
							content : {
								"otherParams" : otherParams
								//bank : todo
							},
							load: function(response, args)
							{
								var displayMessage = m.getLocalization("submitMigrattionSuccess", 
										[productCode,companyName]);
								m.dialog.show('Alert', displayMessage);
								dj.byId("dijit_form_Button_1").set("disabled", false);
							},
							error: function(response, args)
							{
								m.dialog.show("ERROR", m.getLocalization("submitMigrattionFailure"),[productCode,companyName]);
								dj.byId("dijit_form_Button_1").set("disabled", false);
							}
						});
						}
					else
						{
							m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
						}
				}
				
			 }
		  }	
	});
	
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.common.listdef_mt_client');