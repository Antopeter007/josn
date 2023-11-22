/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.facility_maintenance_search"]){dojo._hasResource["misys.binding.system.facility_maintenance_search"]=true;dojo.provide("misys.binding.system.facility_maintenance_search");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");(function(d,dj,m){d.mixin(m,{bind:function(){m.setValidation("facility_ccy",m.validateCurrency);}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.facility_maintenance_search_client");}