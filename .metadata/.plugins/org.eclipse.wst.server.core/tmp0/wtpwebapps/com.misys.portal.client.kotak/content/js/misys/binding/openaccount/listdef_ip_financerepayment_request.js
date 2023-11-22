/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.openaccount.listdef_ip_financerepayment_request"]){dojo._hasResource["misys.binding.openaccount.listdef_ip_financerepayment_request"]=true;dojo.provide("misys.binding.openaccount.listdef_ip_financerepayment_request");dojo.require("misys.openaccount.FormOpenAccountEvents");dojo.require("misys.binding.common.listdef_mc");(function(d,dj,m){d.mixin(m,{bind:function(){m.setValidation("cur_code",m.validateCurrency);m.connect("AmountRangevisible","onBlur",function(){m.validateFSCMFromAmount("AmountRangevisible","AmountRange2visible");});m.connect("AmountRange2visible","onBlur",function(){m.validateFSCMToAmount("AmountRange2visible","AmountRangevisible");});m.connect("AmountOutstandingRangevisible","onBlur",function(){m.validateFSCMFromAmount("AmountOutstandingRangevisible","AmountOutstandingRange2visible");});m.connect("AmountOutstandingRange2visible","onBlur",function(){m.validateFSCMToAmount("AmountOutstandingRange2visible","AmountOutstandingRangevisible");});m.connect("fin_date","onBlur",m.repayValidateFinanceInvoiceDateFrom);m.connect("fin_date2","onBlur",m.repayValidateFinanceInvoiceDateTo);m.connect("fin_due_date","onBlur",m.repayValidateDueDateFrom);m.connect("fin_due_date2","onBlur",m.repayValidateDueDateTo);m.connect("submitButton","onClick",function(){m.setFSCMAmountValue("AmountRange");m.setFSCMAmountValue("AmountOutstandingRange");});}});})(dojo,dijit,misys);dojo.require("misys.client.binding.openaccount.listdef_ip_financerepayment_request_client");}