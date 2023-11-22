/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.ConsignmentQtyDetail"]){dojo._hasResource["misys.openaccount.widget.ConsignmentQtyDetail"]=true;dojo.provide("misys.openaccount.widget.ConsignmentQtyDetail");dojo.experimental("misys.openacount.widget.ConsignmentQtyDetail");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.ConsignmentQtyDetail",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{pmt_tds_qty_unit_measr_code:"",pmt_tds_qty_unit_measr_other:"",pmt_tds_qty_val:"",type:"",type_label:"",other_type:"",is_valid:"Y",createItem:function(){var _1={pmt_tds_qty_unit_measr_code:this.get("pmt_tds_qty_unit_measr_code"),pmt_tds_qty_unit_measr_other:this.get("pmt_tds_qty_unit_measr_other"),pmt_tds_qty_val:this.get("pmt_tds_qty_val"),type:this.get("type"),type_label:this.get("type_label"),other_type:this.get("other_type"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}