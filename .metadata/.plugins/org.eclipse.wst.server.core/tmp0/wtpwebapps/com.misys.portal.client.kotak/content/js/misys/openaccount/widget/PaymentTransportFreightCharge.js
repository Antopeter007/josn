/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.PaymentTransportFreightCharge"]){dojo._hasResource["misys.openaccount.widget.PaymentTransportFreightCharge"]=true;dojo.provide("misys.openaccount.widget.PaymentTransportFreightCharge");dojo.experimental("misys.openacount.widget.PaymentTransportFreightCharge");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.PaymentTransportFreightCharge",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{type:"",type_label:"",other_type:"",cur_code:"",type_hidden:"",amt:"",createItem:function(){var _1={type:this.get("type"),type_label:this.get("type_label"),other_type:this.get("other_type"),cur_code:this.get("cur_code"),type_hidden:this.get("type_hidden"),amt:this.get("amt")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}