/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.layout.MultipleItems"]){dojo._hasResource["misys.layout.MultipleItems"]=true;dojo.provide("misys.layout.MultipleItems");dojo.experimental("misys.layout.MultipleItems");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit._Container");dojo.declare("misys.layout.MultipleItems",[dijit._Widget,dijit._Templated,dijit._Container],{widgetsInTemplate:true,noItemLabel:"",addItemLabel:"",startup:function(){this.inherited(arguments);this.renderSections();},renderSections:function(){var _1=this.getChildren();if(_1.length!==0){this.noItemLabelNode.style.display="none";this.itemsNode.style.display="";}else{this.noItemLabelNode.style.display="";this.itemsNode.style.display="none";}}});}