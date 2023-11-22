/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.system.widget.LicenseProduct"]){dojo._hasResource["misys.system.widget.LicenseProduct"]=true;dojo.provide("misys.system.widget.LicenseProduct");dojo.experimental("misys.system.widget.LicenseProduct");dojo.require("dijit._Contained");dojo.require("dijit._Container");dojo.require("dijit._Widget");dojo.require("misys.layout.SimpleItem");dojo.declare("misys.system.widget.LicenseProduct",[dijit._Widget,dijit._Contained,misys.layout.SimpleItem],{product_code:"",sub_product_code:"",product_type_code:"",product_code_hidden:"",sub_product_code_hidden:"",product_type_code_hidden:"",constructor:function(){},createItem:function(){var _1={product_code:this.get("product_code"),sub_product_code:this.get("sub_product_code"),product_type_code:this.get("product_type_code"),product_code_hidden:this.get("product_code_hidden"),sub_product_code_hidden:this.get("sub_product_code_hidden"),product_type_code_hidden:this.get("product_type_code_hidden")};if(this.hasChildren&&this.hasChildren()){dojo.forEach(this.getChildren(),function(_2){if(_2.createItem){_1.push(_2.createItem());}},this);}return _1;}});}