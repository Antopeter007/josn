/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.form._FilteringTermSelect"]){dojo._hasResource["misys.form._FilteringTermSelect"]=true;dojo.provide("misys.form._FilteringTermSelect");dojo.require("dijit.form.FilteringSelect");dojo.declare("misys.form._FilteringTermSelect",[dijit.form.FilteringSelect],{_optionValue:"",constructor:function(_1,_2){this.inherited(arguments);},_onBlur:function(){this.inherited(arguments);this.onChange();},toXML:function(){return this._optionValue;}});}