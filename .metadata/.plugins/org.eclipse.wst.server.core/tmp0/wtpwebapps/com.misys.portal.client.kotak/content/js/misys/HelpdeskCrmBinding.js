/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.HelpdeskCrmBinding"]){dojo._hasResource["misys.HelpdeskCrmBinding"]=true;dojo.provide("misys.HelpdeskCrmBinding");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("misys.widget.Dialog");fncDoBinding=function(){};fncShowDialog=function(_1,_2,_3,_4){var _5=dijit.byId(_2);if(!_5){dojo.require("misys.widget.Dialog");dojo.require("dijit.form.Button");dojo.parser.parse(_1);_5=dijit.byId(_2);dojo.addClass(_5.domNode,"dialog");}var _6=dojo.byId("dialogButtons"),_7=dijit.byId(_4).domNode,_8=dojo.byId("alertDialogContent");dojo.style(_6,"display","block");dojo.style(_7,"display","inline-block");dojo.style(_8,"display","block");var _9=""+_2+"Title";_5.set("title",misys.getLocalization(_9));misys.dialog.connect(_2,"onKeyPress",function(_a){if(_a.keyCode==dojo.keys.ESCAPE){dojo.stopEvent(_a);}});misys.dialog.connect(_4,"onMouseUp",function(){misys.dialog.disconnect(_5);_5.hide();});_5.show();};}