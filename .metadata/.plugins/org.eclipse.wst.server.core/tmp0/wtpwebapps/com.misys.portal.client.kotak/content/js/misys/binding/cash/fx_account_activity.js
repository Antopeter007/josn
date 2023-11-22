/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.fx_account_activity"]){dojo._hasResource["misys.binding.cash.fx_account_activity"]=true;dojo.provide("misys.binding.cash.fx_account_activity");(function(d,dj,m){d.ready(function(){dojo.query("label[for=customer]")[0].innerHTML="<span class='required-field-symbol'>*</span>"+dojo.query("label[for=customer]")[0].innerHTML;dojo.query("label[for=start_date]")[0].innerHTML="<span class='required-field-symbol'>*</span>"+dojo.query("label[for=start_date]")[0].innerHTML;});})(dojo,dijit,misys);dojo.require("misys.client.binding.cash.fx_account_activity_client");}