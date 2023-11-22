/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.grid.TopicListenerDataGrid"]){dojo._hasResource["misys.grid.TopicListenerDataGrid"]=true;dojo.provide("misys.grid.TopicListenerDataGrid");dojo.experimental("misys.grid.TopicListenerDataGrid");dojo.require("dojox.grid.EnhancedGrid");dojo.require("dojo.regexp");dojo.require("dojox.string.tokenize");dojo.declare("misys.grid.TopicListenerDataGrid",[dojox.grid.EnhancedGrid],{subscribe_topic:"",onSelectionClearedScript:"",startup:function(){this.inherited(arguments);},handleTopicEvent:function(_1,_2){if(this.selection&&this.get("selectionMode")!=""){this.selection.clear();}this._reloadGridForEventTerms(_1);},_reloadGridForEventTerms:function(_3){var _4=this.get("store"),_5=_4.url,_6={};if(_5.indexOf("&")!==-1){_5=_5.substring(0,_5.indexOf("&"));}for(key in _3){if(_3.hasOwnProperty(key)){_6[key]=_3[key];}}_4.close();_4.url=_5;this.setStore(_4,_6);}});}