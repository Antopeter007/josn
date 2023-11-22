/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.OtherCertificateDatasetDetail"]){dojo._hasResource["misys.openaccount.widget.OtherCertificateDatasetDetail"]=true;dojo.provide("misys.openaccount.widget.OtherCertificateDatasetDetail");dojo.experimental("misys.openacount.widget.OtherCertificateDatasetDetail");dojo.require("dijit._Contained");dojo.require("dijit._Container");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.OtherCertificateDatasetDetail",[dijit._Widget,dijit._Contained,dijit._Container,misys.layout.SimpleItem],{ocds_cert_type:"",ocds_cert_type_hidden:"",other_certificate_dataset_bic:"",createItem:function(){var _1=this.get("other_certificate_dataset_bic");var _2="";if(_1){_2=new misys.openaccount.widget.OtherCertificateSubmittrBics();_2.createItemsFromJson(_1);}var _3={ocds_cert_type:this.get("ocds_cert_type"),ocds_cert_type_hidden:this.get("ocds_cert_type_hidden"),other_certificate_dataset_bic:""};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_4){if(_4.createItem){var _5=_4.createItem();if(_5!=null){dojo.mixin(_3,_5);}}},this);}return _3;},constructor:function(){}});}