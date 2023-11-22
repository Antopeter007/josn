/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.loan.deal_list"]){dojo._hasResource["misys.binding.loan.deal_list"]=true;dojo.provide("misys.binding.loan.deal_list");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.tree.ForestStoreModel");dojo.require("dojox.grid.TreeGrid");dojo.require("dojo.date.locale");dojo.require("misys.grid._base");(function(d,dj,m){d.mixin(m,{bind:function(){m.connect(facilitiesGrid,"onRowClick",function(_1){m.grid.redirect(_1);});d.byId("facilities").appendChild(facilitiesGrid.domNode);facilitiesGrid.startup();},onFormLoad:function(){},beforeSubmitValidations:function(){}});})(dojo,dijit,misys);dojo.require("misys.client.binding.loan.deal_list_client");}