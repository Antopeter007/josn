/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.dialog.bank"]){dojo._hasResource["misys.binding.dialog.bank"]=true;dojo.provide("misys.binding.dialog.bank");dojo.require("dijit.layout.TabContainer");(function(d,dj,m){d.mixin(m.dialog,{bind:function(){m.setValidation("popup_country",m.validateCountry);m.setValidation("popup_phone",m.validatePhoneOrFax);m.setValidation("popup_fax",m.validatePhoneOrFax);m.setValidation("popup_telex",m.validatePhoneOrFax);m.setValidation("popup_email",m.validateEmailAddr);m.setValidation("popup_web_address",m.validateWebAddr);m.setValidation("popup_bei",m.validateBEIFormat);m.setValidation("popup_iso_code",m.validateBICFormat);m.setValidation("popup_address_line_1",m.validateSwiftAddressCharacters);m.setValidation("popup_address_line_2",m.validateSwiftAddressCharacters);m.setValidation("popup_dom",m.validateSwiftAddressCharacters);m.connect("popup_post_code","onBlur",function(){dj.byId("popup_swift_address_address_line_1").set("value",this.get("value"));});m.connect("popup_address_line_1","onBlur",function(){dj.byId("popup_address_line_1").set("value",this.get("value"));});}});})(dojo,dijit,misys);dojo.require("misys.client.binding.dialog.bank_client");}