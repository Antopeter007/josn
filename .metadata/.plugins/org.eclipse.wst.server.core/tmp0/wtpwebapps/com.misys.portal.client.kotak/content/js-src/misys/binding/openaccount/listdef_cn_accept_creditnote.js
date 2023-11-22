dojo.provide("misys.binding.openaccount.listdef_cn_accept_creditnote");

/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Invoice Payable


Copyright (c) 2000-2013 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      25/10/2013
author:		Rajesh T
-----------------------------------------------------------------------------
*/

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.layout.TabContainer");
dojo.require("misys.form.common");
dojo.require("misys.openaccount.StringUtils");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.CurrencyTextBox");

(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {
	
	d.subscribe("ready", function(){
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
			m.setValidation("cur_code", m.validateCurrency);
			m.connect("cur_code", "onChange", _enableAmountRange);
			m.connect("cur_code", "onChange", function() {
				misys.setCurrency(this, [ "AmountRange", "AmountRange2" ]);
			});
			// set the amount value
			m.connect("submitButton", "onClick", _setAmountValue);
		},
		onFormLoad : function(){
			
			if(dijit.byId("eligibility_flag"))
			{
				dijit.byId("eligibility_flag").set('value','E');
			}
			
		}
	});
	
	d.mixin(m._config, {
		submitOpenAccount : function(programcode,subtnxtypecode) {
				var grids 		= [],
					referenceid = "",
					baseCcy = "",
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
							tnxid		= dj.byId("tnxid").get("value");
						}
					}
				}
			baseCcy = dj.byId("base_ccy").get("value");
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
			});		
			
						
			var gridlist = d.isArray(grids) ? grids : [grids],
					targetNode = d.byId("batchContainer"),
					items = [],
					keys = "",
					intNbKeys = 0,
					reference, xhrArgs;
				
				d.forEach(gridlist, function(grids){
				//for multipage selection
				cache = grids.selection.preserver._selectedById;
				for ( var i in cache) 
	    		{ 
	    			console.log("Key", i , "Value", cache[i]);
	    			if(cache[i])
	    			{
	    				reference = i;
	    				if(reference != "undefined")
						{
			    			// separator
							if(keys !== ""){
								keys += ", ";
							}
							keys += reference;
							intNbKeys++;
						}
	    			}
	    		}
				});			
			if(keys == ""){
				m.dialog.show("ERROR", m.getLocalization("noTransactionsSelectedError"));
			} else {
				var URL = window.location.pathname;
				m.post({action:URL, params:[{name:'list_keys',value:keys}, {name:'programcode',value:'03'}, {name:'base_ccy',value:baseCcy}, {name:'operation',value:'MULTI_LIST'}]});
			}
						
			
		},		
		
		showTermsAndConditions : function(rowIndex)
		{
			//  summary: 
			//  Show terms and condition tool tip of the selected row on check box selected event
			var displayMessage;
				if(this.grid.store._items[rowIndex] && this.grid.store._items[rowIndex].i)
				{
					displayMessage	=	this.grid.store._items[rowIndex].i["MyParty@ObjectDataClob@conditions_03"];
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
				displayMessage	=	this.store._items[evt.rowIndex].i["MyParty@ObjectDataClob@conditions_01"];
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
		}
	});
	
	function _enableAmountRange() {
		if (dj.byId("cur_code").value != "") {
			dj.byId("AmountRangevisible").set("disabled", false);
			dj.byId("AmountRange2visible").set("disabled", false);
		} else if (dj.byId("cur_code").value == "") {
			dj.byId("AmountRangevisible").set("disabled", true);
			dj.byId("AmountRange2visible").set("disabled", true);
			dj.byId("AmountRangevisible").reset();
			dj.byId("AmountRange2visible").reset();
		}
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
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.listdef_cn_accept_creditnote_client');