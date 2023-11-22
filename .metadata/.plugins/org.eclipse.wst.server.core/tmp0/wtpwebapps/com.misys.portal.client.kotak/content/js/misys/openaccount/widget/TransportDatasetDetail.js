/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.TransportDatasetDetail"]){dojo._hasResource["misys.openaccount.widget.TransportDatasetDetail"]=true;dojo.provide("misys.openaccount.widget.TransportDatasetDetail");dojo.experimental("misys.openacount.widget.TransportDatasetDetail");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.TransportDatasetDetail",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{BIC:"",createItem:function(){var _1={BIC:this.get("BIC")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}