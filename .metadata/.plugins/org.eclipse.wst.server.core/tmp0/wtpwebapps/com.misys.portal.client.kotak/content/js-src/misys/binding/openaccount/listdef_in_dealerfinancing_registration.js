dojo.provide("misys.binding.openaccount.listdef_in_dealerfinancing_registration");

/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Dealer Financing Registration


Copyright (c) 2000-2012 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      17/01/2012
author:		Sam Sundar K
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
	 		if(grid.selection.getSelected().length > 0 && grid.store._items.length > 0)
 			{
	 			isSelected	= true;
 			}
	 	});
		return isSelected;
	}
	
	d.subscribe('ready',function(){
			m._config = (m._config) || {};
			m._config.cellNodeReference;
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
			m.setValidation('cur_code', m.validateCurrency);
			m.connect("cur_code", "onChange", _enableAmountRange);
			m.connect('cur_code', 'onChange', function() {
				misys.setCurrency(this, [ 'AmountRange', 'AmountRange2' ]);
			});
			// set the amount value
			m.connect('submitButton', 'onClick', _setAmountValue);
		}
	});
	
	d.mixin(m._config, {
		submitOpenAccount : function(programcode,subtnxtypecode) {
			var grids 						= [],
				referenceid 				= "",
				tnxid						= "",
			 	paramsReAuth 				= {},
			 	reauth 						= dj.byId("reauth_perform");
			 	m._config.programcode		= programcode;
			 	m._config.subtnxtypecode	= subtnxtypecode;
			 	
			 	if(_isAnyItemSelectedInGrid())
				 {
					 if(reauth && reauth.get('value') === "Y") 
					 {
						 if(d.isFunction(m._config.initReAuthParams))
						 {
							 paramsReAuth 	=  m._config.initReAuthParams();
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
					displayMessage	=	this.grid.store._items[rowIndex].i['Counterparty@ObjectDataClob@conditions_02'];
					displayMessage 	= 	m.replaceCarriageReturn(displayMessage,"<br>");
				}
				if(m._config.cellNodeReference && m._config.cellNodeReference.cellNode && m._config.cellNodeReference.cellIndex === 0)
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
				displayMessage	=	this.store._items[evt.rowIndex].i['Counterparty@ObjectDataClob@conditions_02'];
				displayMessage 	= 	m.replaceCarriageReturn(displayMessage,"<br>");
				dj.showTooltip(displayMessage, evt.cellNode, 0);
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
			var reAuthParams 		= 	{productCode 		: 'DFR',
					         			 subProductCode 	: '',
					        			 transactionTypeCode: '01',
					        			 entity 			: '',			        			
					        			 currency 			: '',
					        			 amount 			: '',
					        			
					        			 es_field1 			: '',  
					        			 es_field2 			: ''
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
//				reauthURLParameter.push("&reauth_e2ee_pubkey=",dj.byId("ra_e2ee_pubkey").get("value"));
//				reauthURLParameter.push("&reauth_e2ee_server_random=",dj.byId("ra_e2ee_server_random").get("value"));
//				reauthURLParameter.push("&reauth_e2ee_pki=",dj.byId("ra_e2ee_pki").get("value"));
			
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
						tnxid		= dj.byId("tnxid").get("value");
					}
				}
			}
			var url = "/screen/AjaxScreen/action/RunGroupSubmission?s=InvoiceScreen&operation=SUBMIT&option=IP_FOLDER&mode=DRAFT&tnxtype=01&referenceid="+referenceid+"&tnxid="+tnxid+"&programcode="+m._config.programcode;
			if(m._config.subtnxtypecode !== null)
			{
				url = url+"&sub_tnx_type_code="+m._config.subtnxtypecode;
			}
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
			});
			m.grid.processRecords(grids, url + reauthURLParameter.join(""));
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
						tnxid		= dj.byId("tnxid").get("value");
					}
				}
			}
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
			});
			var url = "/screen/AjaxScreen/action/RunGroupSubmission?s=InvoiceScreen&operation=SUBMIT&option=IP_FOLDER&mode=DRAFT&tnxtype=01&referenceid="+referenceid+"&tnxid="+tnxid+"&programcode="+m._config.programcode;
			if(m._config.subtnxtypecode !== null)
			{
				url = url+"&sub_tnx_type_code="+m._config.subtnxtypecode;
			}
			m.grid.processRecords(grids, url);
		}
	});
	
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
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.listdef_in_dealerfinancing_registration_client');