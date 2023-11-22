/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.form.SpreadTextBox"]){dojo._hasResource["misys.form.SpreadTextBox"]=true;dojo.provide("misys.form.SpreadTextBox");dojo.require("dijit.form.NumberTextBox");dojo.declare("misys.form.SpreadTextBox",[dijit.form.NumberTextBox],{startup:function(){if(!this._started){this.inherited(arguments);this.set("value",this.get("value")*10000);}this._started=true;},toXML:function(){return this.get("value")?this.get("value")/100:"";}});}