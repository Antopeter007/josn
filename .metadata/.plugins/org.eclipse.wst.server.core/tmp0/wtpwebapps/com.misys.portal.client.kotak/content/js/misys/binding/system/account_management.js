/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.account_management"]){dojo._hasResource["misys.binding.system.account_management"]=true;dojo.provide("misys.binding.system.account_management");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("misys.form.CurrencyTextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("misys.form.file");dojo.require("misys.form.addons");(function(d,dj,m){d.mixin(m,{bind:function(){m.setValidation("email",misys.validateEmailAddr);m.setValidation("iso_code",misys.validateBICFormat);m.setValidation("routing_bic",misys.validateBICFormat);}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.account_management_client");}