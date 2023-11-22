/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.openaccount.widget.ProductCategory"]){dojo._hasResource["misys.openaccount.widget.ProductCategory"]=true;dojo.provide("misys.openaccount.widget.ProductCategory");dojo.experimental("misys.openacount.widget.ProductCategory");dojo.require("dijit._Contained");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.openaccount.widget.ProductCategory",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{goods_id:"",ref_id:"",tnx_id:"",type:"",type_label:"",other_type:"",description:"",is_valid:"Y",createItem:function(){var _1={goods_id:this.get("goods_id"),ref_id:this.get("ref_id"),tnx_id:this.get("tnx_id"),type:this.get("type"),type_label:this.get("type_label"),other_type:this.get("other_type"),description:this.get("description"),is_valid:this.get("is_valid")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;},constructor:function(){this.inherited(arguments);}});}