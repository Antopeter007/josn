dojo.provide("misys.binding.openaccount.listdef_in_common");

/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Invoice Payable


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
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.layout.ContentPane");
dojo.require("misys.form.CurrencyTextBox");

(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {
	
	d.subscribe('ready',function(){
		d.query(".dojoxGrid").forEach(function(g){
			if(g.id !== "nonSignedFolders")
			{
				m.connect(g.id, "onRowMouseOver", m._config.showTermsAndConditions);
				m.connect(g.id, "onRowMouseOut",  m._config.hideTermsAndConditions);
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
		saveOpenAccount : function(programcode,subtnxtypecode) {
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
							tnxid		= dj.byId("tnxid").get("value");
						}
					}
				}
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
				
			});
			m.grid.processRecords(grids, "/screen/AjaxScreen/action/RunGroupSubmission?s=InvoiceScreen&operation=SAVE&option=IP_FOLDER&mode=DRAFT&tnxtype=01&referenceid="+referenceid+"&tnxid="+tnxid+"&programcode="+programcode+"&sub_tnx_type_code="+subtnxtypecode);
		},
		
		submitOpenAccount : function(programcode,subtnxtypecode) {
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
							tnxid		= dj.byId("tnxid").get("value");
						}
					}
				}
			d.query(".dojoxGrid").forEach(function(g){
				grids.push(dj.byId(g.id));
			});
			
			var url = "/screen/AjaxScreen/action/RunGroupSubmission?s=InvoiceScreen&operation=SUBMIT&option=IP_FOLDER&mode=DRAFT&tnxtype=01&referenceid="+referenceid+"&tnxid="+tnxid+"&programcode="+programcode;
			if(subtnxtypecode !== null)
			{
				url = url+"&sub_tnx_type_code="+subtnxtypecode;
			}
			
			m.grid.processRecords(grids, url);
		},
		
		showTermsAndConditions : function(evt)
		{
			if(this.selection.selected[evt.rowIndex] && this.selection.selected[evt.rowIndex] === true)
			{
				var displayMessage;
				var programcode = this.store._items[evt.rowIndex].i['fscm_programme_code'];
				displayMessage=this.store._items[evt.rowIndex].i['MyParty@ObjectDataString@conditions_'+programcode];
				dj.showTooltip(displayMessage, evt.cellNode, 0);	
			}
		},
		
		hideTermsAndConditions : function(evt)
		{
			dj.hideTooltip(evt.cellNode);
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
       dojo.require('misys.client.binding.openaccount.listdef_in_common_client');