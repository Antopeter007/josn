/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.form.PercentNumberTextBox"]){dojo._hasResource["misys.form.PercentNumberTextBox"]=true;dojo.provide("misys.form.PercentNumberTextBox");dojo.require("dijit.form.NumberTextBox");dojo.declare("misys.form.PercentNumberTextBox",[dijit.form.NumberTextBox],{startup:function(){if(!this._started){this.inherited(arguments);this.set("value",this.get("value")*100);}this._started=true;},toXML:function(){return this.get("value")?this.get("value")/100:"";}});}