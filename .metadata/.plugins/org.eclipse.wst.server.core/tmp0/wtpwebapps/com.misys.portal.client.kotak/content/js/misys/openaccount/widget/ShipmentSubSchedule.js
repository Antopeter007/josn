/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.ShipmentSubSchedule"]){dojo._hasResource["misys.openaccount.widget.ShipmentSubSchedule"]=true;dojo.provide("misys.openaccount.widget.ShipmentSubSchedule");dojo.experimental("misys.openacount.widget.ShipmentSubSchedule");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.ShipmentSubSchedule",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{ref_id:"",tnx_id:"",shipment_id:"",sub_shipment_quantity_value:"",schedule_earliest_ship_date:"",schedule_latest_ship_date:"",is_valid:"Y",createItem:function(){var _1={ref_id:this.get("ref_id"),tnx_id:this.get("tnx_id"),shipment_id:this.get("shipment_id"),sub_shipment_quantity_value:this.get("sub_shipment_quantity_value"),schedule_earliest_ship_date:this.get("schedule_earliest_ship_date"),schedule_latest_ship_date:this.get("schedule_latest_ship_date"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){}});}