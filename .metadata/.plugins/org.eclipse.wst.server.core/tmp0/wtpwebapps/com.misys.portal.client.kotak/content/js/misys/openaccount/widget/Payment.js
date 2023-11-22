/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.Payment"]){dojo._hasResource["misys.openaccount.widget.Payment"]=true;dojo.provide("misys.openaccount.widget.Payment");dojo.experimental("misys.openacount.widget.Payment");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.Payment",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{ref_id:"",tnx_id:"",payment_id:"",payment_date:"",code:"",label:"",other_paymt_terms:"",nb_days:"",cur_code:"",amt:"",pct:"",is_valid:"Y",createItem:function(){var _1={ref_id:this.get("ref_id"),tnx_id:this.get("tnx_id"),payment_id:this.get("payment_id"),payment_date:this.get("payment_date"),code:this.get("code"),label:this.get("label"),other_paymt_terms:this.get("other_paymt_terms"),nb_days:this.get("nb_days"),cur_code:this.get("cur_code"),amt:this.get("amt"),pct:this.get("pct"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}