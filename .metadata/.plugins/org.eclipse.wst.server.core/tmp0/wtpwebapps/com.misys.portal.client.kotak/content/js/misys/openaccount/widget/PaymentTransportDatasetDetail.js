/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.PaymentTransportDatasetDetail"]){dojo._hasResource["misys.openaccount.widget.PaymentTransportDatasetDetail"]=true;dojo.provide("misys.openaccount.widget.PaymentTransportDatasetDetail");dojo.experimental("misys.openacount.widget.PaymentTransportDatasetDetail");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("dijit._Container");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.PaymentTransportDatasetDetail",[dijit._Widget,dijit._Contained,dijit._Container,misys.layout.SimpleItem],{payment_tds_version:"",payment_tds_id:"",payment_tds_bic:"",payment_tds_prop_date:"",payment_tds_actual_date:"",payment_tds_dataset_transported_goods:"",payment_tds_dataset_transport_doc_ref:"",createItem:function(){var _1=this.get("payment_tds_dataset_transported_goods");var _2="";if(_1){_2=new misys.openaccount.widget.TransportedGoodsDetails();_2.createItemsFromJson(_1);}var _3=this.get("payment_tds_dataset_transport_doc_ref");var _4="";if(_3){_4=new misys.openaccount.widget.TransportDocumentReferences();_4.createItemsFromJson(_3);}var _5={payment_tds_version:this.get("payment_tds_version"),payment_tds_id:this.get("payment_tds_id"),payment_tds_bic:this.get("payment_tds_bic"),payment_tds_prop_date:this.get("payment_tds_prop_date"),payment_tds_actual_date:this.get("payment_tds_actual_date"),payment_tds_dataset_transported_goods:"",payment_tds_dataset_transport_doc_ref:""};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_6){if(_6.createItem){var _7=_6.createItem();if(_7!=null){dojo.mixin(_5,_7);}}},this);}return _5;},constructor:function(){}});}