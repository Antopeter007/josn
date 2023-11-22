/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.grid._ViewManager"]){dojo._hasResource["misys.grid._ViewManager"]=true;dojo.provide("misys.grid._ViewManager");dojo.require("dojox.grid._ViewManager");dojo.declare("misys.grid._ViewManager",[dojox.grid._ViewManager],{measureContent:function(){var h=0;this.forEach(function(_1){var _2=0;if(_1.contentNode.childNodes.length>0){_2=_1.contentNode.childNodes[0].offsetHeight;}h=Math.max(_2,h);});return h;}});}