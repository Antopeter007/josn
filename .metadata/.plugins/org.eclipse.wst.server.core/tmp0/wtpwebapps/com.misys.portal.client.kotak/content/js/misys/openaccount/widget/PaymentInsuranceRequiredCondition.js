/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.PaymentInsuranceRequiredCondition"]){dojo._hasResource["misys.openaccount.widget.PaymentInsuranceRequiredCondition"]=true;dojo.provide("misys.openaccount.widget.PaymentInsuranceRequiredCondition");dojo.experimental("misys.openacount.widget.PaymentInsuranceRequiredCondition");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.PaymentInsuranceRequiredCondition",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{payment_ids_conditions_required:"",payment_ids_conditions_required_hidden:"",createItem:function(){var _1={payment_ids_conditions_required:this.get("payment_ids_conditions_required"),payment_ids_conditions_required_hidden:this.get("payment_ids_conditions_required_hidden")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}