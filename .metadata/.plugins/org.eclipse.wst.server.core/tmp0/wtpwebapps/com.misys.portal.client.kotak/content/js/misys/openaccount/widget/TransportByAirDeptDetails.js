/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.TransportByAirDeptDetails"]){dojo._hasResource["misys.openaccount.widget.TransportByAirDeptDetails"]=true;dojo.provide("misys.openaccount.widget.TransportByAirDeptDetails");dojo.experimental("misys.openaccount.widget.TransportByAirDeptDetails");dojo.require("misys.grid.GridMultipleItems");dojo.require("misys.openaccount.widget.TransportByAirDeptDetail");dojo.declare("misys.openaccount.widget.TransportByAirDeptDetails",[misys.grid.GridMultipleItems],{data:{identifier:"store_id",label:"store_id",items:[]},templatePath:null,templateString:dojo.byId("transport-by-air-dept-details-template")?dojo.byId("transport-by-air-dept-details-template").innerHTML:"",xmlTagName:"departures",xmlSubTagName:"departure",gridColumns:["departure_airport_code","departure_air_town","departure_airport_name","ref_id","tnx_id","routing_summary_sub_type"],propertiesMap:{departure_airport_code:{_fieldName:"departure_airport_code"},ref_id:{_fieldName:"ref_id"},tnx_id:{_fieldName:"tnx_id"},departure_air_town:{_fieldName:"departure_air_town"},departure_airport_name:{_fieldName:"departure_airport_name"},routing_summary_sub_type:{_fieldName:"air_dept_rs_sub_type"}},layout:[{name:"Airport Code",field:"departure_airport_code",width:"30%"},{name:"Town",field:"departure_air_town",width:"30%"},{name:"Airport Name",field:"departure_airport_name",width:"30%"},{name:" ",field:"actions",formatter:misys.grid.formatReportActions,width:"10%"},{name:"Id",field:"store_id",headerStyles:"display:none",cellStyles:"display:none"}],mandatoryFields:[],startup:function(){this.dataList=[];if(this.hasChildren()){dojo.forEach(this.getChildren(),function(_1){if(_1.createItem){var _2=_1.createItem();this.dataList.push(_2);}},this);}this.inherited(arguments);},openDialogFromExistingItem:function(_3,_4){this.inherited(arguments);},addItem:function(_5){this.inherited(arguments);},createItemsFromJson:function(_6){this.inherited(arguments);},checkDialog:function(){if(!this.dialog){var _7=dijit.byId(this.dialogId);if(_7){this.dialog=_7;}else{var id=this.dialogId?this.dialogId:"dialog-"+dojox.uuid.generateRandomUuid();var _8=this.dialogClassName?this.dialogClassName:"misys.widget.Dialog";this.dialog=dojo.eval("new "+_8+"({}, dojo.byId('"+id+"'))");this.dialog.set("refocus",false);this.dialog.set("draggable",false);dojo.addClass(this.dialog.domNode,"multipleItemDialog");this.dialog.startup();document.body.appendChild(this.dialog.domNode);}}return this.dialog;},performValidation:function(){if(dijit.byId("departure_airport_code").value===""&&dijit.byId("departure_air_town").value===""){misys.dialog.show("ERROR",misys.getLocalization("transportByAirDetMandatoryError"));return;}if(this.validateDialog(true)){this.inherited(arguments);}}});}