dojo.provide("misys.binding.cash.fx_account_activity");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	d.ready(function(){
		dojo.query("label[for=customer]")[0].innerHTML = "<span class='required-field-symbol'>*</span>"+dojo.query("label[for=customer]")[0].innerHTML;
		dojo.query("label[for=start_date]")[0].innerHTML = "<span class='required-field-symbol'>*</span>"+dojo.query("label[for=start_date]")[0].innerHTML;
	});

	
		
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.cash.fx_account_activity_client');