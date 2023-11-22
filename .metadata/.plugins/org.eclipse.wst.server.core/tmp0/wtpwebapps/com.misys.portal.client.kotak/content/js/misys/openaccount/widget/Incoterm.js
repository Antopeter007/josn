/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.Incoterm"]){dojo._hasResource["misys.openaccount.widget.Incoterm"]=true;dojo.provide("misys.openaccount.widget.Incoterm");dojo.experimental("misys.openacount.widget.Incoterm");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.Incoterm",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{ref_id:"",tnx_id:"",inco_term_id:"",code:"",code_label:"",other:"",location:"",is_valid:"Y",createItem:function(){var _1={ref_id:this.get("ref_id"),tnx_id:this.get("tnx_id"),inco_term_id:this.get("inco_term_id"),code:this.get("code"),code_label:this.get("code_label"),other:this.get("other"),location:this.get("location"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}