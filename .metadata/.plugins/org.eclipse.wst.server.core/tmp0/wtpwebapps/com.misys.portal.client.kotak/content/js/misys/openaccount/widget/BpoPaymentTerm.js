/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.BpoPaymentTerm"]){dojo._hasResource["misys.openaccount.widget.BpoPaymentTerm"]=true;dojo.provide("misys.openaccount.widget.BpoPaymentTerm");dojo.experimental("misys.openacount.widget.BpoPaymentTerm");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.BpoPaymentTerm",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{pmt_code:"",pmt_other_term_code:"",payment_code:"",payment_nb_days:"",payment_other_term:"",payment_amount:"",payment_percent:"",is_valid:"Y",createItem:function(){var _1={pmt_code:this.get("pmt_code"),pmt_other_term_code:this.get("pmt_other_term_code"),payment_code:this.get("payment_code"),payment_nb_days:this.get("payment_nb_days"),payment_amount:this.get("payment_amount"),payment_percent:this.get("payment_percent"),payment_other_term:this.get("payment_other_term"),is_valid:this.get("is_valid")};return _1;},constructor:function(){}});}