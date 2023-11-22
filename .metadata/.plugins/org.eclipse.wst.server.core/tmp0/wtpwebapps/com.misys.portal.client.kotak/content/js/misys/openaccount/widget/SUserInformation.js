/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.SUserInformation"]){dojo._hasResource["misys.openaccount.widget.SUserInformation"]=true;dojo.provide("misys.openaccount.widget.SUserInformation");dojo.experimental("misys.openacount.widget.SUserInformation");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.SUserInformation",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{user_id:"",info_id:"",label:"",information:"",is_valid:"Y",createItem:function(){var _1={user_id:this.get("user_id"),info_id:this.get("info_id"),label:this.get("label"),information:this.get("information"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}