dojo.provide("misys.binding.openaccount.listdef_ip_collections");

/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Invoice Payable Collections for Invoice Settle


Copyright (c) 2000-2017 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      28/06/2017
author:	   Chaitra Muralidhar
-----------------------------------------------------------------------------
*/

dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.binding.common.listdef_mc");

(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {	
	d.mixin(m, {
		bind : function() {
			// validate the currency
			m.setValidation("cur_code", m.validateCurrency);
			m.connect("AmountRangevisible", "onBlur", 
					function(){
						m.validateFSCMFromAmount("AmountRangevisible","AmountRange2visible");
					});
			m.connect("AmountRange2visible", "onBlur", 
					function(){
						m.validateFSCMToAmount("AmountRange2visible","AmountRangevisible");
					});
			m.connect("AmountOutstandingSettlementRangevisible", "onBlur", 
					function(){
						m.validateFSCMFromAmount("AmountOutstandingSettlementRangevisible","AmountOutstandingSettlementRange2visible");
					});
			m.connect("AmountOutstandingSettlementRange2visible", "onBlur", 
					function(){
						m.validateFSCMToAmount("AmountOutstandingSettlementRange2visible","AmountOutstandingSettlementRangevisible");
					});
			m.connect("iss_date", "onChange", m.collectionValidateInvoiceDateFrom);
			m.connect("iss_date2", "onChange", m.collectionValidateInvoiceDateTo);
			m.connect("due_date", "onChange", m.collectionValidateDueDateFrom);
			m.connect("due_date2", "onChange", m.collectionValidateDueDateTo);
			m.connect("submitButton", "onClick", 
					function(){
						m.setFSCMAmountValue("AmountRange");
						m.setFSCMAmountValue("AmountOutstandingSettlementRange");
					});			

		}	
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.listdef_ip_collections_client');