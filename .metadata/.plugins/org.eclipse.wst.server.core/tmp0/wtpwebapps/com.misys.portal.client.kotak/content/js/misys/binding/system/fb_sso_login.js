/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.fb_sso_login"]){dojo._hasResource["misys.binding.system.fb_sso_login"]=true;dojo.provide("misys.binding.system.fb_sso_login");dojo.require("dojo.parser");dojo.require("dijit.form.FilteringSelect");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dojo._base.json");dojo.require("misys.form.common");dojo.require("misys.validation.login");dojo.require("misys.validation.password");(function(d,dj,m){d.mixin(m,{bind:function(){m.connect("languageSelection","onChange",function(){document.location.href=m._config.context+m._config.servlet+"/screen/"+dj.byId("path").get("value")+"?userselectedLanguage="+dj.byId("languageSelection").get("value");});},onFormLoad:function(){setTimeout(function(){dijit.byId("username").focus();},100);},onFormClear:function(){dj.byId("username").set("value","");dj.byId("password").set("value","");dj.byId("username").set("state","");dj.byId("password").set("state","");dj.byId("username").focus();},onFormClearChangePassword:function(){dj.byId("password").set("value","");dj.byId("username").focus();}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.login_client");}