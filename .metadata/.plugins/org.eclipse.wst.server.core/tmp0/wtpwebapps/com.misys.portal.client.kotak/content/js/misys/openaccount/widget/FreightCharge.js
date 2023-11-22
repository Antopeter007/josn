/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.FreightCharge"]){dojo._hasResource["misys.openaccount.widget.FreightCharge"]=true;dojo.provide("misys.openaccount.widget.FreightCharge");dojo.experimental("misys.openacount.widget.FreightCharge");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.FreightCharge",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{tnx_id:"",ref_id:"",allowance_id:"",type:"",type_label:"",other_type:"",cur_code:"",amt:"",rate:"",is_valid:"Y",createItem:function(){var _1={tnx_id:this.get("tnx_id"),ref_id:this.get("ref_id"),allowance_id:this.get("allowance_id"),type:this.get("type"),type_label:this.get("type_label"),other_type:this.get("other_type"),cur_code:this.get("cur_code"),amt:this.get("amt"),rate:this.get("rate"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}