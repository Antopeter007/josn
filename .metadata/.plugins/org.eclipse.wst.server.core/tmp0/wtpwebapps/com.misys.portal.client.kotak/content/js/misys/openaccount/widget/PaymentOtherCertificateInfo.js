/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.PaymentOtherCertificateInfo"]){dojo._hasResource["misys.openaccount.widget.PaymentOtherCertificateInfo"]=true;dojo.provide("misys.openaccount.widget.PaymentOtherCertificateInfo");dojo.experimental("misys.openacount.widget.PaymentOtherCertificateInfo");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.PaymentOtherCertificateInfo",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{payment_other_cert_info:"",createItem:function(){var _1={payment_other_cert_info:this.get("payment_other_cert_info")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}