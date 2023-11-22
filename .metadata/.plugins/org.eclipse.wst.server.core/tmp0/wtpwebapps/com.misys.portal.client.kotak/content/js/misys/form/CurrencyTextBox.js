/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.form.CurrencyTextBox"]){dojo._hasResource["misys.form.CurrencyTextBox"]=true;dojo.provide("misys.form.CurrencyTextBox");dojo.experimental("misys.form.CurrencyTextBox");dojo.require("dijit.form.CurrencyTextBox");dojo.declare("misys.form.CurrencyTextBox",dijit.form.CurrencyTextBox,{validator:function(_1,_2){var _3,_4=_1;if(_2&&_2.places&&_1){var _5=dojo.i18n.normalizeLocale(_2.locale),_6=dojo.i18n.getLocalization("dojo.cldr","number",_5),_7=_6.decimal;var _8=_2.places;if(_1.indexOf(_7)>=0){_3=_1.substring(_1.indexOf(_7)+1,_1.length);if(_8>_3.length){while(_3.length<_8){_4=_4+"0";_3=_3+"0";}this.textbox.value=_4;this._set("displayedValue",this.get("displayedValue"));}}}return (new RegExp("^(?:"+this.regExpGen(_2)+")"+(this.required?"":"?")+"$")).test(_4)&&(!this.required||!this._isEmpty(_1))&&(this._isEmpty(_1)||this.parse(_1,_2)!==undefined);}});}