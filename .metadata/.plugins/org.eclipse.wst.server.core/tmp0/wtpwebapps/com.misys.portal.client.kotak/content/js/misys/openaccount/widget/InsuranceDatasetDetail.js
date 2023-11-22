/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.InsuranceDatasetDetail"]){dojo._hasResource["misys.openaccount.widget.InsuranceDatasetDetail"]=true;dojo.provide("misys.openaccount.widget.InsuranceDatasetDetail");dojo.experimental("misys.openacount.widget.InsuranceDatasetDetail");dojo.require("dijit._Contained");dojo.require("dijit._Container");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.InsuranceDatasetDetail",[dijit._Widget,dijit._Contained,dijit._Container,misys.layout.SimpleItem],{ids_match_issuer_name:"",ids_match_issuer_country:"",ids_identification:"",ids_identification_type:"",ids_match_iss_date:"",ids_match_amount:"",ids_match_transport:"",ids_match_assured_party:"",insurance_dataset_bic:"",insurance_dataset_req_clause:"",startup:function(){this.inherited(arguments);},buildRendering:function(){this.inherited(arguments);var _1=this.getChildren();dojo.forEach(_1,function(_2){dojo.attr(_2.domNode,"style",{display:"none"});});},createItem:function(){var _3=this.get("insurance_dataset_bic");var _4="";if(_3){_4=new misys.openaccount.widget.InsuranceSubmittrBics();_4.createItemsFromJson(_3);}var _5=this.get("insurance_dataset_req_clause");var _6="";if(_5){_6=new misys.openaccount.widget.InsuranceRequiredClauses();_6.createItemsFromJson(_5);}var _7={ids_match_issuer_name:this.get("ids_match_issuer_name"),ids_match_issuer_country:this.get("ids_match_issuer_country"),ids_identification:this.get("ids_identification"),ids_identification_type:this.get("ids_identification_type"),ids_match_iss_date:this.get("ids_match_iss_date"),ids_match_amount:this.get("ids_match_amount"),ids_match_transport:this.get("ids_match_transport"),ids_match_assured_party:this.get("ids_match_assured_party"),insurance_dataset_bic:"",insurance_dataset_req_clause:""};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_8){if(_8.createItem){var _9=_8.createItem();if(_9!=null){dojo.mixin(_7,_9);}}},this);}return _7;},constructor:function(){}});}