/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.ConsignmentWeightDetail"]){dojo._hasResource["misys.openaccount.widget.ConsignmentWeightDetail"]=true;dojo.provide("misys.openaccount.widget.ConsignmentWeightDetail");dojo.experimental("misys.openacount.widget.ConsignmentWeightDetail");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.ConsignmentWeightDetail",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{pmt_tds_weight_unit_measr_code:"",pmt_tds_weight_unit_measr_other:"",pmt_tds_weight_val:"",type:"",type_label:"",other_type:"",is_valid:"Y",createItem:function(){var _1={pmt_tds_weight_unit_measr_code:this.get("pmt_tds_weight_unit_measr_code"),pmt_tds_weight_unit_measr_other:this.get("pmt_tds_weight_unit_measr_other"),pmt_tds_weight_val:this.get("pmt_tds_weight_val"),type:this.get("type"),type_label:this.get("type_label"),other_type:this.get("other_type"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}