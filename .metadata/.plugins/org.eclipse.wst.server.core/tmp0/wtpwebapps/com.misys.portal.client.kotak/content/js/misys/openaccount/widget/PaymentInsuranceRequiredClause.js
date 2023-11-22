/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.PaymentInsuranceRequiredClause"]){dojo._hasResource["misys.openaccount.widget.PaymentInsuranceRequiredClause"]=true;dojo.provide("misys.openaccount.widget.PaymentInsuranceRequiredClause");dojo.experimental("misys.openacount.widget.PaymentInsuranceRequiredClause");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.PaymentInsuranceRequiredClause",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{payment_ids_clauses_required:"",payment_ids_clauses_required_hidden:"",createItem:function(){var _1={payment_ids_clauses_required:this.get("payment_ids_clauses_required"),payment_ids_clauses_required_hidden:this.get("payment_ids_clauses_required_hidden")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}