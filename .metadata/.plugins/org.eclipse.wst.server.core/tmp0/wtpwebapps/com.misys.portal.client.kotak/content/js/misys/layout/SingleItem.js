/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.layout.SingleItem"]){dojo._hasResource["misys.layout.SingleItem"]=true;dojo.provide("misys.layout.SingleItem");dojo.experimental("misys.layout.SingleItem");dojo.require("dijit._Widget");dojo.require("dijit._Contained");dojo.declare("misys.layout.SingleItem",[dijit._Widget,dijit._Contained],{xmlTagName:"",startup:function(){this.inherited(arguments);var _1=this.getChildren();dojo.forEach(_1,function(_2,_3,_4){_2.startup();});},removeItem:function(){var _5=this;var _6=function(){var _7=_5.getParent();_5.destroyRecursive(false);_7.renderSections();};misys.dialog.show("CONFIRMATION",misys.getLocalization("confirmDeletionGridRecord"),"",_6);},toXML:function(){var _8=["<",this.xmlTagName,">"],_9;var _a=this.getChildren();dojo.forEach(_a,function(_b){_8.push(misys.fieldToXML(_b));});_8.push("</",this.xmlTagName,">");return _8.join("");}});}