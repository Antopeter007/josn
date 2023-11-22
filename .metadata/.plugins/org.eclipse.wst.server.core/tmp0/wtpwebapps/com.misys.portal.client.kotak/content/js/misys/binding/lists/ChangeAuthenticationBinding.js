/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.lists.ChangeAuthenticationBinding"]){dojo._hasResource["misys.binding.lists.ChangeAuthenticationBinding"]=true;dojo.provide("misys.binding.lists.ChangeAuthenticationBinding");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.Button");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dojox.grid.DataGrid");dojo.require("misys.grid._base");fncDoBinding=function(){misys.connect("submitButton","onClick",function(){var _1=dijit.byId("first_name").get("value")!=""?dijit.byId("first_name").get("value"):"*";var _2=dijit.byId("last_name").get("value")!=""?dijit.byId("last_name").get("value"):"*";dijit.byId("full_name").set("value",_1+_2);misys.grid.filter(dijit.byId("authUserGrid"),["NAME","LOGIN_ID"],["full_name","loginId"]);});};fncDoFormOnLoadEvents=function(){fncGetCustomerGridData(dijit.byId("authUserGrid"),"AUTHEN",["first_name","last_name","loginId"]);};}