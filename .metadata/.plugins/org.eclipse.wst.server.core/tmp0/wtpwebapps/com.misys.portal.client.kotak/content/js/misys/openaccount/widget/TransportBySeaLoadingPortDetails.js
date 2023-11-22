/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.TransportBySeaLoadingPortDetails"]){dojo._hasResource["misys.openaccount.widget.TransportBySeaLoadingPortDetails"]=true;dojo.provide("misys.openaccount.widget.TransportBySeaLoadingPortDetails");dojo.experimental("misys.openaccount.widget.TransportBySeaLoadingPortDetails");dojo.require("misys.grid.GridMultipleItems");dojo.require("misys.openaccount.widget.TransportBySeaLoadingPortDetail");dojo.declare("misys.openaccount.widget.TransportBySeaLoadingPortDetails",[misys.grid.GridMultipleItems],{data:{identifier:"store_id",label:"store_id",items:[]},handle:null,templatePath:null,templateString:dojo.byId("transport-by-sea-loading-port-details-template")?dojo.byId("transport-by-sea-loading-port-details-template").innerHTML:"",xmlTagName:"loading_ports",xmlSubTagName:"loading_port",gridColumns:["loading_port_name","routing_summary_sub_type","ref_id","tnx_id"],propertiesMap:{ref_id:{_fieldName:"ref_id"},tnx_id:{_fieldName:"tnx_id"},loading_port_name:{_fieldName:"loading_port_name"},routing_summary_sub_type:{_fieldName:"sea_loading_rs_sub_type"}},layout:[{name:"Port Name",field:"loading_port_name",width:"35%"},{name:" ",field:"actions",formatter:misys.grid.formatReportActions,width:"10%"},{name:"Id",field:"store_id",headerStyles:"display:none",cellStyles:"display:none"}],mandatoryFields:[],startup:function(){this.dataList=[];if(this.hasChildren()){dojo.forEach(this.getChildren(),function(_1){if(_1.createItem){var _2=_1.createItem();this.dataList.push(_2);}},this);}this.inherited(arguments);},openDialogFromExistingItem:function(_3,_4){this.inherited(arguments);},addItem:function(_5){this.inherited(arguments);},createItemsFromJson:function(_6){this.inherited(arguments);},checkDialog:function(){if(!this.dialog){var _7=dijit.byId(this.dialogId);if(_7){this.dialog=_7;}else{var id=this.dialogId?this.dialogId:"dialog-"+dojox.uuid.generateRandomUuid();var _8=this.dialogClassName?this.dialogClassName:"misys.widget.Dialog";this.dialog=dojo.eval("new "+_8+"({}, dojo.byId('"+id+"'))");this.dialog.set("refocus",false);this.dialog.set("draggable",false);dojo.addClass(this.dialog.domNode,"multipleItemDialog");this.dialog.startup();document.body.appendChild(this.dialog.domNode);}}return this.dialog;},performValidation:function(){if(this.validateDialog(true)){if(dijit.byId("loading_port_name")&&dijit.byId("loading_port_name").get("value")===""){misys.dialog.show("ERROR",misys.getLocalization("emptyDialogSubmitError"));}else{this.inherited(arguments);}}}});}