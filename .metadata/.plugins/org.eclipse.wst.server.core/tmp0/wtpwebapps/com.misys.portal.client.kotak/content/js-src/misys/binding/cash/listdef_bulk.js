dojo.provide("misys.binding.cash.listdef_bulk");
/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Pending Bulk List


Copyright (c) 2000-2010 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      06/11/11
-----------------------------------------------------------------------------
*/

dojo.require("dojo.data.ItemFileReadStore");
dojo.require('dojo.data.ItemFileWriteStore');
dojo.require("dijit.form.FilteringSelect");
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

(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {
	
	function _disableAccountNumber() {
		
		if (dj.byId("account_no")) {
			dj.byId("account_no").set("disabled", true);
		}
	}
	function _enableAccountNumber() {
		if (dj.byId("account_no")) {
			dj.byId("account_no").set("disabled", false);
		}
	}

	function _disableSearchIcon() {
		if (d.byId("account_search_id")) {
			d.style(d.byId("account_search_id"), "display", "none");
			dj.byId("account_no").set("value", "");
		}
	}

	function _enableSearchIcon() {
		if (d.byId("account_search_id")) {
			d.style(d.byId("account_search_id"), "display", "");
		}
	}

	function _enableAmountRange() {
		if (dj.byId('cur_code').value != "") {
			dj.byId('AmountRangevisible').set("disabled", false);
			dj.byId('AmountRange2visible').set("disabled", false);
		} else if (dj.byId('cur_code').value == "") {
			dj.byId('AmountRangevisible').set("disabled", true);
			dj.byId('AmountRange2visible').set("disabled", true);
			dj.byId('AmountRangevisible').reset();
			dj.byId('AmountRange2visible').reset();
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

	function _validateFromDateLesserThanToDate(fromDate, toDateId, toolTipMsgKey, toolTipDateLabel){
		if (fromDate.get('value') == null)
		{
			return true;
		}
		 m._config = m._config || {};
		 m._config.effFromDateValidationInprocess = false;
		var displayMessage;
		var toDate = dj.byId(toDateId);
		 if(!m._config.effToDateValidationInprocess)
			 {
				if (!m.compareDateFields(fromDate, toDate))
				{
					 m._config.effFromDateValidationInprocess = true;
					displayMessage = misys.getLocalization(toolTipMsgKey, 
							[toolTipDateLabel , _localizeDisplayDate(fromDate), _localizeDisplayDate(toDate)]);
					fromDate.focus();
					fromDate.set("displayedValue", "");
					fromDate.set("state", "Error");
					dj.hideTooltip(fromDate.domNode);
					dj.showTooltip(displayMessage, fromDate.domNode, 0);
					return false;
				}
			 }	
		 m._config.effFromDateValidationInprocess = false;
		return true;
	}

	function _validateToDateGreaterThanFromDate(toDate, fromDateId, toolTipMsgKey, toolTipDateLabel){
		var displayMessage;
		 m._config = m._config || {};
		 m._config.effToDateValidationInprocess = false;
		var fromDate = dj.byId(fromDateId);
		if(!m._config.effFromDateValidationInprocess)
			{
				if (!m.compareDateFields(fromDate, toDate))
				{
					m._config.effToDateValidationInprocess = true;
					displayMessage = misys.getLocalization(toolTipMsgKey, 
							[toolTipDateLabel, _localizeDisplayDate(toDate), _localizeDisplayDate(fromDate)]);
					toDate.focus();
					toDate.set("displayedValue", "");
					toDate.set("state", "Error");
					dj.hideTooltip(toDate.domNode);
					dj.showTooltip(displayMessage, toDate.domNode, 0);
					return false;
				}
			}	
		 m._config.effToDateValidationInprocess = false;
		return true;
	}

	function _validateThisDateLesserThanCurrentDate(dateFieldElement, toolTipDateLabel){
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
	}

	function _localizeDisplayDate( /* dijit._Widget */dateField){
		if (dateField.get("type") === "hidden")
		{
			return d.date.locale.format(m.localizeDate(dateField),{selector : "date"});
		}
		return dateField.get("displayedValue");
	}

	d.mixin(m,
	{
		bind : function()
		{
			// validate the currency
			m.setValidation('cur_code', m.validateCurrency);
			m.connect('cur_code', 'onChange', function()
			{
				_enableAmountRange();
				misys.setCurrency(this, [ 'AmountRange', 'AmountRange2' ]);
			});
			m.connect("AmountRangevisible", "onBlur", _validateMinimumAmount);
			m.connect("AmountRange2visible", "onBlur", _validateMaximumAmount);
			
			m.connect("create_date", "onBlur", function(){
				var that = this;
				_validateFromDateLesserThanToDate(that, "create_date2","generalFromDateGreaterThanToDate", misys.getLocalization('lastModified'));
			});

			m.connect("create_date2", "onBlur", function(){
				var that = this;
				_validateToDateGreaterThanFromDate(that, "create_date",
						"generalToDateGreaterThanFromDate", misys.getLocalization('lastModified'));
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
			});

			// set the amount value
			m.connect('submitButton', 'onClick', function()
			{
				_setAmountValue();
			});
		}
	});
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.listdef_bulk_client');