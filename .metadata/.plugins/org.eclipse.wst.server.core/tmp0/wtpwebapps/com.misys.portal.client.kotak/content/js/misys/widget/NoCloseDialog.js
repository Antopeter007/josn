/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.widget.NoCloseDialog"]){dojo._hasResource["misys.widget.NoCloseDialog"]=true;dojo.provide("misys.widget.NoCloseDialog");dojo.experimental("misys.widget.NoCloseDialog");dojo.require("dijit.Dialog");dojo.declare("misys.widget.NoCloseDialog",[dijit.Dialog],{noCloseButton:true,_changeNoCloseButton:function(){dojo.style(this.closeButtonNode,"display",this.noCloseButton?"none":"block");},postCreate:function(){this.inherited(arguments);this._changeNoCloseButton();},_onKey:function(_1){if(this.noCloseButton&&_1.charOrCode==dojo.keys.ESCAPE){return;}this.inherited(arguments);},setNoCloseButton:function(_2){this.noCloseButton=_2;this._changeNoCloseButton();}});}