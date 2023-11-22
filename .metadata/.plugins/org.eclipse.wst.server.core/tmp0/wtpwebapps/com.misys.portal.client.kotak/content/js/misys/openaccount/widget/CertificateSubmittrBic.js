/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.CertificateSubmittrBic"]){dojo._hasResource["misys.openaccount.widget.CertificateSubmittrBic"]=true;dojo.provide("misys.openaccount.widget.CertificateSubmittrBic");dojo.experimental("misys.openacount.widget.CertificateSubmittrBic");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.CertificateSubmittrBic",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{ceds_bic:"",is_valid:"Y",createItem:function(){var _1={ceds_bic:this.get("ceds_bic"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}