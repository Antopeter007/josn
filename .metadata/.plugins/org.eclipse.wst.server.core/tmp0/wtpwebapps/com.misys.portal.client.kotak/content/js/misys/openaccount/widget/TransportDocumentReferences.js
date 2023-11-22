/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.TransportDocumentReferences"]){dojo._hasResource["misys.openaccount.widget.TransportDocumentReferences"]=true;dojo.provide("misys.openaccount.widget.TransportDocumentReferences");dojo.experimental("misys.openaccount.widget.TransportDocumentReferences");dojo.require("misys.grid.GridMultipleItems");dojo.require("misys.openaccount.widget.TransportDocumentReference");dojo.declare("misys.openaccount.widget.TransportDocumentReferences",[misys.grid.GridMultipleItems],{data:{identifier:"store_id",label:"store_id",items:[]},templatePath:null,templateString:dojo.byId("transport-document-ref-template").innerHTML,dialogId:"transport-document-ref-template",xmlTagName:"",xmlSubTagName:"",gridColumns:["payment_tds_doc_id","payment_tds_doc_iss_date"],propertiesMap:{payment_tds_doc_id:{_fieldName:"payment_tds_doc_id"},payment_tds_doc_iss_date:{_fieldName:"payment_tds_doc_iss_date"}},layout:[{name:"Transport Document ID",field:"payment_tds_doc_id",width:"40%"},{name:"Transport Document Date",field:"payment_tds_doc_iss_date",width:"40%"},{name:" ",field:"actions",formatter:misys.grid.formatReportActions,width:"10%"}],mandatoryFields:[],startup:function(){this.dataList=[];if(this.hasChildren()){dojo.forEach(this.getChildren(),function(_1){if(_1.createItem){var _2=_1.createItem();this.dataList.push(_2);}},this);}this.inherited(arguments);},openDialogFromExistingItem:function(_3,_4){this.inherited(arguments);},createItem:function(){if(this.hasChildren&&this.hasChildren()){var _5="misys.openaccount.widget.TransportDocumentReferences";var _6=[];dojo.forEach(this.getChildren(),function(_7){if(_7.createItem){_6.push(_7.createItem());}},this);var _8={_value:_6,_type:_5};var _9={};_9["payment_tds_dataset_transport_doc_ref"]=_8;return _9;}return null;},resetDialog:function(_a){this.inherited(arguments);},addItem:function(_b){this.inherited(arguments);},createItemsFromJson:function(_c){this.inherited(arguments);},performValidation:function(){if(this.validateDialog(true)){this.inherited(arguments);}}});}