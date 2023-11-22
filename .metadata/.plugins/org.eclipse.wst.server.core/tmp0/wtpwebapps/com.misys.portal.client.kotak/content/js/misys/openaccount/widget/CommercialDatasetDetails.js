/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.CommercialDatasetDetails"]){dojo._hasResource["misys.openaccount.widget.CommercialDatasetDetails"]=true;dojo.provide("misys.openaccount.widget.CommercialDatasetDetails");dojo.experimental("misys.openaccount.widget.CommercialDatasetDetails");dojo.require("misys.grid.GridMultipleItems");dojo.require("misys.openaccount.widget.CommercialDatasetDetail");dojo.declare("misys.openaccount.widget.CommercialDatasetDetails",[misys.grid.GridMultipleItems],{data:{identifier:"store_id",label:"store_id",items:[]},handle:null,templatePath:null,templateString:dojo.byId("commercial-ds-details-template").innerHTML,dialogId:"commercial-ds-details-dialog-template",xmlTagName:"ComrclDataSetReqrd",xmlSubTagName:"Submitr",gridColumns:["BIC"],propertiesMap:{BIC:{_fieldName:"cds_bic"}},bicMap:{BIC:{_fieldName:"BIC"}},layout:[{name:"Bic",field:"BIC",width:"90%"},{name:" ",field:"actions",formatter:misys.grid.formatReportActions,width:"10%"},{name:"Id",field:"store_id",headerStyles:"display:none",cellStyles:"display:none"}],mandatoryFields:["BIC"],startup:function(){this.dataList=[];if(this.hasChildren()){dojo.forEach(this.getChildren(),function(_1){if(_1.createItem){var _2=_1.createItem();this.dataList.push(_2);}},this);}this.inherited(arguments);},openDialogFromExistingItem:function(_3,_4){this.inherited(arguments);},addItem:function(_5){this.inherited(arguments);},createDataGrid:function(){this.inherited(arguments);var _6=this.grid;var _7=dijit.byId("commercial-ds");misys.connect(_6,"onDelete",function(){misys.dialog.connect(dijit.byId("okButton"),"onMouseUp",function(){_7.addButtonNode.set("disabled",false);},"alertDialog");});},toXML:function(){var _8=[];_8.push("<commercial_dataset>");_8.push("<![CDATA[");if(this.grid){this.grid.store.fetch({query:{store_id:"*"},onComplete:dojo.hitch(this,function(_9,_a){_8.push(this.itemToXML(_9,this.xmlSubTagName));})});}_8.push("]]>");_8.push("</commercial_dataset>");return _8.join("");},itemToXML:function(_b,_c){var _d=[];dojo.forEach(_b,function(_e){if(_e){if(this.xmlTagName){_d.push("<",this.xmlTagName,">");}if(_c){_d.push("<",_c,">");}for(var _f in _e){var _10=dojo.isArray(_e[_f])?_e[_f][0]:_e[_f];if(dojo.isObject(_10)&&_10._type){var _11=_10._type;var _12=dojo.eval(_11);var _13=new _12({});_d.push("<",_13.xmlTagName,">");_d.push(this.itemToXML(_10._values,_13.xmlSubTagName,_d));_d.push("</",_13.xmlTagName,">");}else{if(_f!="store_id"&&_f.match("^_")!="_"){_10=dojo.isArray(_e[_f])?_e[_f][0]:_e[_f];_10+="";for(var _14 in this.bicMap){if(this.bicMap[_14]._fieldName===_f){_d.push("<",_14,">",dojox.html.entities.encode(_10,dojox.html.entities.html),"</",_14,">");break;}}}}}if(_c){_d.push("</",_c,">");}if(this.xmlTagName){_d.push("</",this.xmlTagName,">");}}},this);return _d.join("");},createItemsFromJson:function(_15){this.inherited(arguments);},performValidation:function(){if(this.validateDialog(true)){if(dijit.byId("seller_bank_bic")&&dijit.byId("seller_bank_bic").get("value")!==""&&dijit.byId("cds_bic").get("value")!==dijit.byId("seller_bank_bic").get("value")){misys.dialog.show("ERROR",misys.getLocalization("commercialDatasetBicSellerBicError"));}else{this.inherited(arguments);}}},updateData:function(){this.inherited(arguments);dijit.byId("add_commercial_ds_button").set("disabled",true);}});}