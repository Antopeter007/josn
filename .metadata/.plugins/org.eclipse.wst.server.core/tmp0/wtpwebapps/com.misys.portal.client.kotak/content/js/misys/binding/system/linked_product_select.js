/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.linked_product_select"]){dojo._hasResource["misys.binding.system.linked_product_select"]=true;dojo.provide("misys.binding.system.linked_product_select");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.FilteringSelect");(function(d,dj,m){function _1(){dj.byId("BusinessArea").set("value","*");};function _2(_3){var _4=dj.byId("sub_product_code"),_5=_3=="*"?"ALL":_3,_6=m._config.SubProductsCollection[_5];_4.store=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:_6}});_4.fetchProperties={sort:[{attribute:"name"}],queryOptions:{deep:false}};dj.byId("sub_product_code").set("value","*");};function _7(){var _8=dj.byId("product_code");var _9=m._config.ProductsCollection;_8.store=new dojo.data.ItemFileReadStore({data:{identifier:"value",label:"name",items:_9}});_8.fetchProperties={sort:[{attribute:"name"}],queryOptions:{deep:false}};dj.byId("product_code").set("value","*");};d.mixin(m,{bind:function(){m.connect("product_code","onChange",_2);},onFormLoad:function(){_7();}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.linked_product_select_client");}