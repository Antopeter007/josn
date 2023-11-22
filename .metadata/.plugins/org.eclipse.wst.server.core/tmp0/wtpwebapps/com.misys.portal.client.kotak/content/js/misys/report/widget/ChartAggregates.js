/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.report.widget.ChartAggregates"]){dojo._hasResource["misys.report.widget.ChartAggregates"]=true;dojo.provide("misys.report.widget.ChartAggregates");dojo.experimental("misys.report.widget.ChartAggregates");dojo.require("misys.report.widget.Aggregates");dojo.declare("misys.report.widget.ChartAggregates",[misys.report.widget.Aggregates],{xmlTagName:"chart_aggregates",layout:[{name:"Axis Y",field:"column",formatter:misys.getColumnDecode,width:"40%"},{name:"Type",field:"type",formatter:misys.getAggregateOperatorDecode,width:"40%"},{name:" ",field:"actions",formatter:misys.grid.formatReportActions,width:"10%"}],startup:function(){if(this._started){return;}this.inherited(arguments);this.toggleAddButton();},toggleAddButton:function(){var _1=true;if(this.grid&&this.grid.rowCount>0){_1=false;}this.addButtonNode.set("disabled",!_1);},handleGridAction:function(_2){this.inherited(arguments);if(_2.target.tagName=="IMG"&&_2.target.attributes.type){if(_2.target.attributes.type.value=="remove"){this.toggleAddButton();}}},updateData:function(){this.inherited(arguments);this.toggleAddButton();}});}