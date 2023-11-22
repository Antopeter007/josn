/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.account"]){dojo._hasResource["misys.binding.system.account"]=true;dojo.provide("misys.binding.system.account");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.CurrencyTextBox");(function(d,dj,m){d.mixin(m,{bind:function(){m.setValidation("account_cur_code",m.validateCurrency);m.setValidation("account_no",m.validateUserAccountNumber);}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.account_client");}