/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.Charge"]){dojo._hasResource["misys.openaccount.widget.Charge"]=true;dojo.provide("misys.openaccount.widget.Charge");dojo.experimental("misys.openacount.widget.Charge");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.Charge",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{payment_charges_payer:"",payment_charges_payee:"",payment_charges_amount:"",payment_charges_percent:"",payment_charge_type:"",is_valid:"Y",createItem:function(){var _1={payment_charges_payer:this.get("payment_charges_payer"),payment_charges_payee:this.get("payment_charges_payee"),payment_charges_amount:this.get("payment_charges_amount"),payment_charges_percent:this.get("payment_charges_percent"),payment_charge_type:this.get("payment_charge_type"),is_valid:this.get("is_valid")};return _1;},constructor:function(){}});}