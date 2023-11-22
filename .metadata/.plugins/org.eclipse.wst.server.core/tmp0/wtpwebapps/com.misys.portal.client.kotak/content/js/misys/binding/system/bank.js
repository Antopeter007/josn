/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.binding.system.bank"]){dojo._hasResource["misys.binding.system.bank"]=true;dojo.provide("misys.binding.system.bank");dojo.require("dojo.data.ItemFileReadStore");dojo.require("dijit.form.FilteringSelect");dojo.require("dijit.layout.TabContainer");dojo.require("misys.validation.login");dojo.require("misys.validation.password");dojo.require("misys.form.common");dojo.require("misys.validation.common");dojo.require("dijit.form.Form");dojo.require("dijit.form.Button");dojo.require("dijit.form.TextBox");dojo.require("dijit.form.ValidationTextBox");dojo.require("dijit.form.CheckBox");dojo.require("dijit.layout.ContentPane");(function(d,dj,m){function _1(){m.checkConfirmPassword("password_value","password_confirm");};d.mixin(m,{bind:function(){m.setValidation("iso_code",m.validateBICFormat);m.setValidation("email",m.validateEmailAddr);m.setValidation("web_address",m.validateWebAddr);m.setValidation("password_value",m.validateChangePasswordNP);m.setValidation("password_confirm",m.validateChangePasswordCP);m.setValidation("abbv_name",m.validateCharactersExcludeSpace);m.setValidation("_country",m.validateCountry);m.setValidation("base_cur_code",m.validateCurrency);m.setValidation("phone",m.validatePhoneOrFax);m.setValidation("fax",m.validateFax);m.setValidation("telex",m.validateTelex);m.setValidation("address_line_1",m.validateSwiftAddressCharacters);m.setValidation("address_line_2",m.validateSwiftAddressCharacters);m.setValidation("dom",m.validateSwiftAddressCharacters);m.setValidation("liquidity_branch_reference",m.validateLiquidityBranchReference);m.connect("draftButton","onClick",m.beforeSaveValidations);m.setValidation("address_line_1",m.validateSwiftAddressCharacters);m.setValidation("address_line_2",m.validateSwiftAddressCharacters);m.setValidation("dom",m.validateSwiftAddressCharacters);m.connect("create_admin","onClick",function(){m.toggleFields(this.get("checked"),null,["password_value","password_confirm"]);});m.connect("abbv_name","onChange",function(){m.checkAbbvNameExists();});m.connect("abbv_name","onKeyPress",function(e){if(e.keyCode===32||e.charCode===32){dojo.stopEvent(e);}});m.connect("password_value","onBlur",_1);},onFormLoad:function(){var _2=dj.byId("create_admin");var _3=dj.byId("liquidity_branch_reference");if(_3&&_3.get("value")!==null){misys._config.liqBranchRef=_3.get("value");}if(_2){m.toggleFields(_2.get("checked"),null,["password_value","password_confirm"]);}if(dojo.byId("img_view_full_details")){dojo.style(dojo.byId("img_view_full_details"),{"display":"none"});}},beforeSaveValidations:function(){var _4=dijit.byId("abbv_name").get("value");var _5=dijit.byId("name").get("value");var _6=dijit.byId("address_line_1").get("value");if(!(_4.length>0)){m._config.onSubmitErrorMsg=m.getLocalization("custAbbvNameEmptyError");dijit.byId("abbv_name").focus();return false;}if(!(_5.length>0)){m._config.onSubmitErrorMsg=m.getLocalization("mandatoryFieldsError");dijit.byId("abbv_name").focus();return false;}if(!(_6.length>0)){m._config.onSubmitErrorMsg=m.getLocalization("mandatoryFieldsError");dijit.byId("abbv_name").focus();return false;}else{return true;}}});})(dojo,dijit,misys);dojo.require("misys.client.binding.system.bank_client");}