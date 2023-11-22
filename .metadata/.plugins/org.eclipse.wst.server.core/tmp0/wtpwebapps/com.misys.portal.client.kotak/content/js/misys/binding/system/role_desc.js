/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.role_desc"]){dojo._hasResource["misys.binding.system.role_desc"]=true;dojo.provide("misys.binding.system.role_desc");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.form.SimpleTextarea");dojo.require("misys.form.common");dojo.require("misys.validation.common");(function(d,dj,m){d.mixin(m,{bind:function(){m.setValidation("role_description",m.validateCharsInRolesCreation);}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.role_desc_client");}