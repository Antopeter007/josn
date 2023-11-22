/*
 * ---------------------------------------------------------- 
 * Event Binding for terminating recurring payment transactions
 * 
 * Copyright (c) 2000-2011 Misys (http://www.misys.com), All Rights Reserved.
 * 
 * version: 1.0 date: 07/03/11
 * 
 * author: Nijamudeen
 * ----------------------------------------------------------
 */
dojo.provide("misys.binding.cash.terminate_recurring");
dojo.require("dojo.parser");
dojo.require("dijit.form.Form");
dojo.require("misys.widget.Collaboration");
dojo.require("misys.form.common");
dojo.require("misys.form.file");
dojo.require("misys.validation.common");



(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {
	
	"use strict"; // ECMA5 Strict Mode

	d.mixin(m._config, {

		initReAuthParams : function() {

			var reAuthParams = {
				productCode : 'FT',
				subProductCode : dj.byId("sub_product_code")? dj.byId("sub_product_code").get("value"): '',
				transactionTypeCode : '14',
				entity :dj.byId("entity") ? dj.byId("entity").get("value") : "",
				currency : dj.byId("ft_cur_code")? dj.byId("ft_cur_code").get('value'): '',
				amount : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): '',

				es_field1 : dj.byId("ft_amt")? m.trimAmount(dj.byId("ft_amt").get('value')): '',
				es_field2 : (dj.byId("beneficiary_account")) ? dj.byId(
						"beneficiary_account").get('value') : ''
			};
			return reAuthParams;
		}
	});
	
	
})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.cash.terminate_recurring_client');