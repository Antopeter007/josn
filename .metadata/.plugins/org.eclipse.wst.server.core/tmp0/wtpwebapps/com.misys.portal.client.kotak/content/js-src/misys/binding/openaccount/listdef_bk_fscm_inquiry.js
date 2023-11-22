dojo.provide("misys.binding.openaccount.listdef_bk_fscm_inquiry");

/*
-----------------------------------------------------------------------------
Scripts for the list def binding for BK Invoice/Invoice Payable Inquiry


Copyright (c) 2000-2017 Misys (http://www.misys.com),
All Rights Reserved. 

version:   1.0
date:      03/03/2017
author:		Sanchez, Jayron Lester
-----------------------------------------------------------------------------
*/

dojo.require("misys.openaccount.FormOpenAccountEvents");
dojo.require("misys.binding.common.listdef_mc");

(function(/*Dojo*/d, /*dj*/dj, /*Misys*/m) {	
	d.mixin(m, {
		bind : function() {
			// validate the currency
			m.setValidation("bk_cur_code", m.validateCurrency);
			m.connect("AmountRangevisible", "onBlur", 
					function(){
						m.validateFSCMFromAmount("AmountRangevisible","AmountRange2visible");
					});
			m.connect("AmountRange2visible", "onBlur", 
					function(){
						m.validateFSCMToAmount("AmountRange2visible","AmountRangevisible");
					});
			m.connect("BulkFinAmountRangevisible", "onBlur", 
					function(){
						m.validateFSCMFromAmount("BulkFinAmountRangevisible","BulkFinAmountRange2visible");
					});
			m.connect("BulkFinAmountRange2visible", "onBlur", 
					function(){
						m.validateFSCMToAmount("BulkFinAmountRange2visible","BulkFinAmountRangevisible");
					});	
			
			m.connect("BulkRepaidAmountRangevisible", "onBlur", 
					function(){
						m.validateFSCMFromAmount("BulkRepaidAmountRangevisible","BulkRepaidAmountRange2visible");
					});
			m.connect("BulkRepaidAmountRange2visible", "onBlur", 
					function(){
						m.validateFSCMToAmount("BulkRepaidAmountRange2visible","BulkRepaidAmountRangevisible");
					});	
			
			
			m.connect("submitButton", "onClick",
					function(){
						m.setFSCMAmountValue("AmountRange");
						m.setFSCMAmountValue("BulkFinAmountRange");
						m.setFSCMAmountValue("BulkRepaidAmountRange");
					});
		}	
	});
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.openaccount.listdef_bk_fscm_inquiry_client');