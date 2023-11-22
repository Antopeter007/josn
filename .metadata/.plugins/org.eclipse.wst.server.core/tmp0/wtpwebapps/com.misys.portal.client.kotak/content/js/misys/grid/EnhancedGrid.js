/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.grid.EnhancedGrid"]){dojo._hasResource["misys.grid.EnhancedGrid"]=true;dojo.provide("misys.grid.EnhancedGrid");dojo.experimental("misys.grid.EnhancedGrid");dojo.require("dojox.grid.EnhancedGrid");dojo.declare("misys.grid.EnhancedGrid",[dojox.grid.EnhancedGrid],{keepSelection:false,toXML:function(){var _1={xmlRoot:this.xmlTagName,ignoreDisabled:true},_2=[];var _3=this.selection.getSelected();if(_3.length>0){if(_1.xmlRoot){_2=["<",_1.xmlRoot,">"];}this._parseGridNode(_2,_3,this);if(_1.xmlRoot){_2.push("</",_1.xmlRoot,">");}return _2.join("");}},test:function(){},_parseGridNode:function(_4,_5,_6){if(dojo.isArray(_5)&&_5!==null){dojo.forEach(_5,function(_7){if(_7!==null){this._parseGridNode(_4,_7,_6);}},this);}else{dojo.forEach(_6.store.getAttributes(_5),function(_8){if(_8!==null){dojo.forEach(_6.store.getValues(_5,_8),function(_9){if(_9!==null&&(dojo.isArray(_9)||!dojo.isString(_9))){_4.push("<",_8,">");_4.push(this._parseGridNode(_4,_9,_6));_4.push("</",_8,">");}else{_4.push("<",_8,">",dojox.html.entities.encode(_9,dojox.html.entities.html),"</",_8,">");}},this);}},this);}}});}