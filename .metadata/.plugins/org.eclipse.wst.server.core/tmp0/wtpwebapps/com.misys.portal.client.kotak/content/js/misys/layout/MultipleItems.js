/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.layout.MultipleItems"]){dojo._hasResource["misys.layout.MultipleItems"]=true;dojo.provide("misys.layout.MultipleItems");dojo.experimental("misys.layout.MultipleItems");dojo.require("dijit._Templated");dojo.require("dijit._Widget");dojo.require("dijit._Container");dojo.declare("misys.layout.MultipleItems",[dijit._Widget,dijit._Templated,dijit._Container],{widgetsInTemplate:true,xmlTagName:"",name:"",startup:function(){this.name=this.id;this.inherited(arguments);this.renderSections();},renderSections:function(){var _1=this.getChildren();if(_1.length!==0){this.noItemLabelNode.style.display="none";this.itemsNode.style.display="";}else{this.noItemLabelNode.style.display="";this.itemsNode.style.display="none";}},clear:function(){this.destroyDescendants(false);this.renderSections();},toXML:function(){var _2=["<",this.xmlTagName,">"];var _3=this.getChildren();if(_3&&_3.length>0){dojo.forEach(_3,function(_4){_2.push(_4.toXML());});}_2.push("</",this.xmlTagName,">");return _2.join("");}});}