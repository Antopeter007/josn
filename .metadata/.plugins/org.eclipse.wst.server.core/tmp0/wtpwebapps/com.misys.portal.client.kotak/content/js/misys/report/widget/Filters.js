/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.report.widget.Filters"]){dojo._hasResource["misys.report.widget.Filters"]=true;dojo.provide("misys.report.widget.Filters");dojo.experimental("misys.report.widget.Filters");dojo.require("misys.layout.MultipleItems");dojo.declare("misys.report.widget.Filters",[misys.layout.MultipleItems],{templatePath:null,templateString:dojo.byId("filters-template").innerHTML,xmlTagName:"filters",addItem:function(_1){var _2=new misys.report.widget.Filter({createdByUser:true},document.createElement("div"));this.addChild(_2);this.renderSections();},startup:function(){this.inherited(arguments);}});}