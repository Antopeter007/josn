dojo.provide("misys.binding.openaccount.listdef_ip_financerepayment_request");

/*
-----------------------------------------------------------------------------
Scripts for the list def binding for Invoice Payable


Copyright (c) 2000-2017 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      12/01/2017
author:		Sanchez, Jayron Lester
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
			m.connect("AmountOutstandingRangevisible", "onBlur", 
					function(){
						m.validateFSCMFromAmount("AmountOutstandingRangevisible","AmountOutstandingRange2visible");
					});
			m.connect("AmountOutstandingRange2visible", "onBlur", 
					function(){
						m.validateFSCMToAmount("AmountOutstandingRange2visible","AmountOutstandingRangevisible");
					});
			m.connect("fin_date", "onBlur",  m.repayValidateFinanceInvoiceDateFrom);
			m.connect("fin_date2", "onBlur", m.repayValidateFinanceInvoiceDateTo);
			m.connect("fin_due_date", "onBlur", m.repayValidateDueDateFrom);
			m.connect("fin_due_date2", "onBlur",m.repayValidateDueDateTo);
			m.connect("submitButton", "onClick", 
					function(){
						m.setFSCMAmountValue("AmountRange");
						m.setFSCMAmountValue("AmountOutstandingRange");
					});			

		}	
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.listdef_ip_financerepayment_request_client');