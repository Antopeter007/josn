/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.TransportBySeaDischargePortDetail"]){dojo._hasResource["misys.openaccount.widget.TransportBySeaDischargePortDetail"]=true;dojo.provide("misys.openaccount.widget.TransportBySeaDischargePortDetail");dojo.experimental("misys.openacount.widget.TransportBySeaDischargePortDetail");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.TransportBySeaDischargePortDetail",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{ref_id:"",tnx_id:"",discharge_port_name:"",is_valid:"Y",routing_summary_sub_type:"",routing_summary_id:"",createItem:function(){var _1={discharge_port_name:this.get("discharge_port_name"),tnx_id:this.get("tnx_id"),ref_id:this.get("ref_id"),is_valid:this.get("is_valid"),routing_summary_sub_type:this.get("routing_summary_sub_type"),routing_summary_id:this.get("routing_summary_id")};return _1;},constructor:function(){}});}