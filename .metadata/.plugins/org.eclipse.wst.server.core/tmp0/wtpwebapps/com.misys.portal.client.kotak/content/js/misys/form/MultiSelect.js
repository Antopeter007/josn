/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.form.MultiSelect"]){dojo._hasResource["misys.form.MultiSelect"]=true;dojo.provide("misys.form.MultiSelect");dojo.experimental("misys.form.MultiSelect");dojo.require("dijit.form.MultiSelect");dojo.declare("misys.form.MultiSelect",dijit.form.MultiSelect,{addSelected:function(_1){_1.getSelected().forEach(function(n){this.containerNode.appendChild(n);},this);this.domNode.scrollTop=this.domNode.offsetHeight;var _2=_1.domNode.scrollTop;_1.domNode.scrollTop=0;_1.domNode.scrollTop=_2;this.sortValues();},postCreate:function(){this._onChange();this.sortValues();},sortValues:function(){var _3=this;var _4=dojo.query("option",_3.containerNode).sort(function(a,b){if(a.firstChild&&b.firstChild){if(a.firstChild.nodeValue.toUpperCase()<b.firstChild.nodeValue.toUpperCase()){return -1;}else{if(a.firstChild.nodeValue.toUpperCase()>b.firstChild.nodeValue.toUpperCase()){return 1;}else{return 0;}}}});_4.forEach(function(n){if(_3.containerNode){_3.containerNode.appendChild(n);}});_3.domNode.scrollTop=0;}});}