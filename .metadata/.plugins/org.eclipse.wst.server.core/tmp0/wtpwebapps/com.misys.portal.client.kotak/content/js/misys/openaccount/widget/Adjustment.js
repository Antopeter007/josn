/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.Adjustment"]){dojo._hasResource["misys.openaccount.widget.Adjustment"]=true;dojo.provide("misys.openaccount.widget.Adjustment");dojo.experimental("misys.openacount.widget.Adjustment");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.Adjustment",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{ref_id:"",tnx_id:"",allowance_id:"",type:"",type_label:"",other_type:"",direction:"",direction_label:"",cur_code:"",amt:"",rate:"",cn_reference_id:"",discount_exp_date:"",type_hidden:"",is_valid:"Y",createItem:function(){var _1={ref_id:this.get("ref_id"),tnx_id:this.get("tnx_id"),allowance_id:this.get("allowance_id"),type:this.get("type"),type_label:this.get("type_label"),other_type:this.get("other_type"),direction:this.get("direction"),direction_label:this.get("direction_label"),cur_code:this.get("cur_code"),amt:this.get("amt"),rate:this.get("rate"),cn_reference_id:this.get("cn_reference_id"),discount_exp_date:this.get("discount_exp_date"),type_hidden:this.get("type_hidden"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;}});}