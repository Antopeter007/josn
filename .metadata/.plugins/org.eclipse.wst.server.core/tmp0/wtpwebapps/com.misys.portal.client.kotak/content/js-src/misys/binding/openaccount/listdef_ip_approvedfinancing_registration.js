dojo.provide("misys.binding.openaccount.listdef_ip_approvedfinancing_registration");

/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Approved Payable Financing Registration


Copyright (c) 2000-2012 Misys (http://www.misys.com),
All Rights Reserved.

version:   1.0
date:      17/01/2012
author:	Sam Sundar K
-----------------------------------------------------------------------------
*/

dojo.require("dojo.data.ItemFileReadStore");
dojo.require('dojo.data.ItemFileWriteStore');
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.form.SimpleTextarea");
dojo.require("misys.openaccount.StringUtils");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.CurrencyTextBox");
dojo.require("misys.binding.common.listdef_mc");
/* TODO This file has direct references to the reauthentication
This looks wrong, need to reassess if this can be achieved in a more
standard way. */
dojo.require("misys.binding.common.reauth_listdef_common");
dojo.require("misys.binding.system.reauth");
dojo.require("misys.binding.common.reauth_listdef");


(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {

	function _isAnyItemSelectedInGrid()
	{
		var isSelected	=	false,
			grids 		= 	[];
		d.query(".dojoxGrid").forEach(function(g){
			grids.push(dj.byId(g.id));
		});
	 	d.forEach(grids, function(grid){
	 		if(grid.selection.getSelected().length > 0)
 			{
	 			isSelected	= true;
 			}
	 	});
		return isSelected;
	}
	function _validateIssueFromDate() {
		// summary:
		// Validates the data entered for creation from date
		// tags:
		// public, validation

		// Return true for empty values

		var that = this;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Issue From Date. Value = '+ that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var creationToDate = dj.byId('iss_date2');
		if (!m.compareDateFields(that, creationToDate)) {
			var widget = dj.byId('iss_date');
				displayMessage = misys.getLocalization('InvoiceIssueDateFromLesserThanInvoiceIssueDateTo');
				widget.focus();
				widget.set("state","Error");
				dj.hideTooltip(widget.domNode);
				dj.showTooltip(displayMessage, widget.domNode, 0);
		}

		return true;
	}
	function _validateIssueToDate() {
		// summary:
		// Validates the data entered for creation to date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Creation To Date. Value = '+ that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var creationFromDate = dj.byId('iss_date');
		if (!m.compareDateFields(creationFromDate, that)) {
			var widget = dj.byId('iss_date2');
			  	displayMessage = misys.getLocalization('InvoiceIssueDateToGreaterThanInvoiceIssueDateFrom');
		 		widget.focus();
		 		widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 	return false;
		}

		return true;
	}
	function _validateDueFromDate() {
		// summary:
		// Validates the data entered for maturity from date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Maturity From Date. Value = '+ that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var maturityToDate = dj.byId('due_date2');
		if (!m.compareDateFields(that, maturityToDate)) {
			var widget = dj.byId("due_date"),
			    displayMessage = misys.getLocalization('InvoiceDueDateFromGreaterThanInvoiceDueDateTo');
		 		widget.focus();
		 		widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		 		dj.showTooltip(displayMessage,
					domNode, 0);
		 		return false;
		}

		return true;

	}
	function _validateDueToDate() {

		// summary:
		// Validates the data entered for maturity to date
		// tags:
		// public, validation

		// Return true for empty values
		var that = this;
		if (that.get('value') === null) {
			return true;
		}
		console.debug('[Validate] Validating Maturity To Date. Value = '+ that.get('value'));
		// Test that the last shipment date is greater than or equal to
		// the application date
		var maturityFromDate = dj.byId('due_date');
		if (!m.compareDateFields(maturityFromDate, that)) {
			var widget = dj.byId('due_date2');
			 	displayMessage = misys.getLocalization('InvoiceDueDateToLesserThanInvoiceDueDateFrom');
		 		widget.focus();
		 		widget.set("state","Error");
		 		dj.hideTooltip(widget.domNode);
		 		dj.showTooltip(displayMessage, widget.domNode, 0);
		}

		return true;
	}
	d.subscribe("ready",function(){
		m._config = (m._config) || {};
		m._config.cellNodeReference;
		m._config.programcode;
		d.query(".dojoxGrid").forEach(function(grid){
			if(grid.id !== "nonSignedFolders")
			{
				m.connect(grid.id, "onRowMouseOver", m._config.mouseOverShowTermsAndConditions);
				m.connect(grid.id, "onRowMouseOut",  m._config.mouseOutHideTermsAndConditions);
				m.connect(dj.byId(grid.id).selection,"onSelected", m._config.showTermsAndConditions);
				m.connect(dj.byId(grid.id).selection,"onDeselected", m._config.hideTermsAndConditions);
				m.connect(grid.id, "onRowClick", m._config.storeCellNodeReference);
				m.connect(grid.id, "onHeaderCellClick", function(evt){
					if(m._config.cellNodeReference && m._config.cellNodeReference.cellNode)
					{
						dj.hideTooltip(m._config.cellNodeReference.cellNode);
						m._config.cellNodeReference.cellNode = null;
					}
				});
			}
		});
	});

	d.mixin(m, {
		bind : function() {
			// validate the currency
			m.setValidation("cur_code", m.validateCurrency);
			m.connect("cur_code", "onChange", _enableAmountRange);
			m.connect("cur_code", "onChange", function() {
				misys.setCurrency(this, [ "AmountRange", "AmountRange2" ]);
			});
			// validating Amount range
			m.connect("AmountRangevisible", "onBlur", validateMinMaxAmount);
			m.connect("AmountRange2visible", "onBlur", validateMinMaxAmount);
			// set the amount value
			m.connect("submitButton", "onClick", _setAmountValue);
			m.connect("iss_date", "onBlur", _validateIssueFromDate);
			m.connect("iss_date2", "onBlur", _validateIssueToDate);
			m.connect("due_date", "onBlur", _validateDueFromDate);
			m.connect("due_date2", "onBlur", _validateDueToDate);
		}
	});

	d.mixin(m._config, {
		saveOpenAccount : function(programcode) {
			var grids 		= [],
				referenceid = "",
				tnxid		= "";
			if(dj.byId("nonSignedFolders"))
				{
					if(dijit.byId("nonSignedFolders").selection.selectedIndex !== -1)
					{
						if(dj.byId("referenceid"))
						{
							referenceid = dj.byId("referenceid").get("value");
						}
						if(dj.byId("tnxid"))
						{
							tnxid = dj.byId("tnxid").get("value");
						}
					}
				}
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
			});
		},

			submitOpenAccount : function(programcode) {
				var grids 					= [],
					referenceid 			= "",
					tnxid					= "",
				 	paramsReAuth 			= {},
				 	reauth 					= dj.byId("reauth_perform");
				 	m._config.programcode	= programcode;

				 if(_isAnyItemSelectedInGrid())
				 {
					 if(reauth && reauth.get("value") === "Y") 
					 {
						 if(d.isFunction(m._config.initReAuthParams))
						 {
							 paramsReAuth = m._config.initReAuthParams();
							 m._config.executeReauthentication(paramsReAuth);
						 }
						 else
						 {
							 console.debug("Doesnt find the function initReAuthParams for ReAuthentication");
							 m.setContentInReAuthDialog("ERROR", "");
							 dj.byId("reauth_dialog").show();
						 }
					 }
					 else
					 {
						 m._config.nonReauthSubmit();
					 }
				 }
				 else
				 {
					 m.dialog.show("ERROR",  m.getLocalization("noTransactionsSelectedError"));
				 }
		},
		showTermsAndConditions : function(rowIndex)
		{
			//  summary:
			//  Show terms and condition tool tip of the selected row on check box selected event
			var displayMessage;
				if(this.grid.store._items[rowIndex] && this.grid.store._items[rowIndex].i)
				{
					displayMessage	=	this.grid.store._items[rowIndex].i["Counterparty@ObjectDataClob@conditions_04"];
					if(!displayMessage){
						displayMessage	=	this.grid.store._items[rowIndex].i["Counterparty@ObjectDataClob@conditions_06"];
					}
					if(!displayMessage){
						displayMessage	=	this.grid.store._items[rowIndex].i["Counterparty@ObjectDataClob@conditions_05"];
					}
					displayMessage 	= 	m.replaceCarriageReturn(displayMessage,"<br>");
				}
				if(displayMessage && m._config.cellNodeReference && m._config.cellNodeReference.cellNode)
				{
					dj.hideTooltip(m._config.cellNodeReference.cellNode);
					dj.showTooltip(displayMessage, m._config.cellNodeReference.cellNode, 0);
				}
		},
		mouseOverShowTermsAndConditions : function(evt)
		{
			//  summary:
			//  Show terms and condition tool tip of the selected row if the mouse pointer is in first cell index and checked
			if(this.selection.selected[evt.rowIndex] && this.selection.selected[evt.rowIndex] === true && evt.cellIndex === 0)
			{
				var displayMessage;
				displayMessage	=	this.store._items[evt.rowIndex].i["Counterparty@ObjectDataClob@conditions_04"];
				if(!displayMessage){
					displayMessage	=	this.store._items[evt.rowIndex].i["Counterparty@ObjectDataClob@conditions_06"];
				}
				if(!displayMessage){
					displayMessage	=	this.grid.store._items[rowIndex].i["Counterparty@ObjectDataClob@conditions_05"];
				}
				if(displayMessage){
					displayMessage 	= 	m.replaceCarriageReturn(displayMessage,"<br>");
					dj.showTooltip(displayMessage, evt.cellNode, 0);
				}
			}
		},
		mouseOutHideTermsAndConditions : function(evt)
		{
			//  summary:
			//  Hide terms and condition tool tip of the selected row on mouse out event
			dj.hideTooltip(evt.cellNode);
		},
		storeCellNodeReference : function(evt)
		{
			//  summary:
			//  Preserve the cell node reference for selected event of the check box
			m._config.cellNodeReference = evt;
		},
		hideTermsAndConditions : function(evt)
		{
			//  summary:
			//  Hide terms and condition tool tip of the selected row when the check box is Deselected
			if(m._config.cellNodeReference && m._config.cellNodeReference.cellNode)
			{
				dj.hideTooltip(m._config.cellNodeReference.cellNode);	
			}
		},
		initReAuthParams : function(){
			var reAuthParams 		= 	{productCode 		: "AFR",
					         			 subProductCode 	: "",
					        			 transactionTypeCode: "01",
					        			 entity 			: "",
					        			 currency 			: "",
					        			 amount 			: "",
					        			
					        			 es_field1 			: "",
					        			 es_field2 			: ""
										};
			return reAuthParams;
		},
		reauthSubmit : function()
		{
			var valueToEE 				= 	dj.byId("reauth_password").get("value"),
			//encValue 					= 	amdp.encrypt('{\"hash\":false}', dj.byId("ra_e2ee_pubkey").get("value"), dj.byId("ra_e2ee_server_random").get("value"), valueToEE),
			referenceid 				= "",
			tnxid						= "",
			grids 						= [];
			var reauthURLParameter		=	[];
				reauthURLParameter.push("&reauth_otp_response=",valueToEE);
			if(dj.byId("nonSignedFolders"))
			{
				if(dijit.byId("nonSignedFolders").selection.selectedIndex !== -1)
				{
					if(dj.byId("referenceid"))
					{
						referenceid = dj.byId("referenceid").get("value");
					}
					if(dj.byId("tnxid"))
					{
						tnxid = dj.byId("tnxid").get("value");
					}
				}
			}
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
			});
			var url	= "/screen/AjaxScreen/action/RunGroupSubmission?s=InvoicePayableScreen&operation=SUBMIT&option=IP_FOLDER&mode=DRAFT&tnxtype=01&referenceid="+referenceid+"&tnxid="+tnxid+"&programcode="+m._config.programcode;
			var handleCallback = function(){
				m.markWidgetAsLoading("submit-button", false);
			};

			m.markWidgetAsLoading("submit-button", true);
			m.grid.processRecords(grids, url + reauthURLParameter.join(""), handleCallback);
		},
		nonReauthSubmit : function()
		{
			var grids 			= [],
				referenceid 	= "",
				tnxid			= "";
			if(dj.byId("nonSignedFolders"))
			{
				if(dijit.byId("nonSignedFolders").selection.selectedIndex !== -1)
				{
					if(dj.byId("referenceid"))
					{
						referenceid = dj.byId("referenceid").get("value");
					}
					if(dj.byId("tnxid"))
					{
						tnxid = dj.byId("tnxid").get("value");
					}
				}
			}
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
			});

			var url	= "/screen/AjaxScreen/action/RunGroupSubmission?s=InvoicePayableScreen&operation=SUBMIT&option=IP_FOLDER&mode=DRAFT&tnxtype=01&referenceid=" + referenceid + "&tnxid=" + tnxid + "&programcode=" + m._config.programcode;
			var handleCallback = function(){
				m.markWidgetAsLoading("submit-button", false);
			};
			m.markWidgetAsLoading("submit-button", true);
			m.grid.processRecords(grids, url, handleCallback);
		}
	});
	
	function _enableAmountRange() {
		//  summary:
		//		Enables or disables the amount field based on cur code
		if (dj.byId("cur_code").value !== "") {
			dj.byId("AmountRangevisible").set("disabled", false);
			dj.byId("AmountRange2visible").set("disabled", false);
		} else if (dj.byId("cur_code").value === "") {
			dj.byId("AmountRangevisible").set("disabled", true);
			dj.byId("AmountRange2visible").set("disabled", true);
			dj.byId("AmountRangevisible").reset();
			dj.byId("AmountRange2visible").reset();
		}
	}

	function validateMinMaxAmount(){
		//  summary:
	    //        Validates minimum amount. Minimum amount should be greater than zero and less than maximum amount.
	    //        Validates maximum amount. maximum amount should be greater than zero and greater than minimum amount.
		var amount = this.get("value");
		console.debug("[misys.validation.common] Validating the amount. Value", amount);
		var toValue = dj.byId('AmountRange2visible').get('value');
		var fromValue = dj.byId('AmountRangevisible').get('value');
		var toAmtWidget = false;
		var widget1 = dj.byId('AmountRangevisible');
		var widget = dj.byId('AmountRange2visible');
				if (fromValue > toValue)
				{
			  		displayMessage = misys.getLocalization('invalidMaxAmountValueError');
			  		toAmtWidget = true;
			  	}
				else if (toValue < 0)
			  	{
					displayMessage = misys.getLocalization('invalidAmountValueError');
					toAmtWidget = true;
			  	}
				else if (fromValue < 0)
			  	{
					displayMessage = misys.getLocalization('invalidAmountValueError');
					widget1.focus();
			 		widget1.set("state","Error");
			 		dj.hideTooltip(widget1.domNode);
			 		dj.showTooltip(displayMessage, widget1.domNode, 0);
			 		dj.showTooltip(displayMessage, domNode, 0);
			 		return false;
			  	}
				if(toAmtWidget)
				{
				  	widget.focus();
			 		widget.set("state","Error");
			 		dj.hideTooltip(widget.domNode);
			 		dj.showTooltip(displayMessage, widget.domNode, 0);
			 		dj.showTooltip(displayMessage, domNode, 0);
			 		return false;
				}
		 return true;
	}
	function _setAmountValue() {
		if(dj.byId("AmountRangevisible")){
		var amountRange = dj.byId("AmountRangevisible").value;
		var amountRangeValue = isNaN(amountRange) ? 0 : amountRange;
		// set the amount range value
		dj.byId("AmountRange").set("value", amountRange);
		var amountRange2 = dj.byId("AmountRange2visible").value;
		dj.byId("AmountRange2").set("value", amountRange2);
		}
	}
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.listdef_ip_approvedfinancing_registration_client');