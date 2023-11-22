/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.ReferenceId"]){dojo._hasResource["misys.openaccount.widget.ReferenceId"]=true;dojo.provide("misys.openaccount.widget.ReferenceId");dojo.experimental("misys.openacount.widget.ReferenceId");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.ReferenceId",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{cust_reference:"",back_office_1:"",customer_input_center:"",prodcode:"",subprodcode:"",uniqueRef:"",from:"",to:"",title:"",createItem:function(){var _1={cust_reference:this.get("cust_reference"),back_office_1:this.get("back_office_1"),customer_input_center:this.get("customer_input_center"),prodcode:this.get("prodcode"),subprodcode:this.get("subprodcode"),uniqueRef:this.get("uniqueRef"),from:this.get("from"),to:this.get("to"),title:this.get("title")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}