/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.cash.account_details_search"]){dojo._hasResource["misys.binding.cash.account_details_search"]=true;dojo.provide("misys.binding.cash.account_details_search");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.Select");dojo.require("misys.form.common");dojo.require("misys.widget.Dialog");dojo.require("dijit.form.ValidationTextBox");(function(d,dj,m){d.mixin(m,{bind:function(){m.connect("submit","onClick",m.submit);},onFormLoad:function(){m.setValidation("ccy",m.validateCurrency);}});})(dojo,dijit,misys);dojo.require("misys.client.binding.cash.account_details_search_client");}