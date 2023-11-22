/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["misys.validation.password"]){dojo._hasResource["misys.validation.password"]=true;dojo.provide("misys.validation.password");(function(d,m){function _1(_2){var _3=m._e2ee.password_mimimum_length;var _4=m._e2ee.password_maximum_length;var _5=_2.get("value").length;if((_5<_3)||(_5>_4)){return false;}return true;};function _6(_7){var _8;var _9=m._e2ee.password_charset;try{_8=new RegExp(_9);}catch(error){return false;}if(!_8.test(_7.get("value"))){return false;}else{return true;}};d.mixin(m,{validateChangePasswordNP:function(){var _a=dijit.byId("change_username");var _b=dijit.byId("username");var _c=dijit.byId("login_id");var _d=dijit.byId("new_user_name");var _e;if(_a&&_a.get("checked")&&_d&&_d.get("value")!=""){_e=_d;}else{if(_b&&_b.get("value")!=""){_e=_b;}else{if(_c&&_c.get("value")!=""){_e=_c;}}}if(_e){if(_e.get("value")==dijit.byId("password_value").get("value").toUpperCase()){this.invalidMessage=m.getLocalization("passwordSameAsLoginIdError");return false;}else{if((dijit.byId("password_value").get("value").toUpperCase().indexOf(_e.get("value").toUpperCase()))!==-1&&"false"===misys._e2ee.allowUserNameInPasswordValue){this.invalidMessage=m.getLocalization("passwordContainsLoginIdError");return false;}}}if(!_1(this)){this.invalidMessage=m.getLocalization("invalidPasswordLengthError",[m._e2ee.password_mimimum_length,m._e2ee.password_maximum_length]);return false;}if(!_6(this)){this.invalidMessage=m.getLocalization("invalidPasswordCharError");return false;}if(dijit.byId("password")||dijit.byId("old_password_value")){if(!m.validateWithExistingPassword()){this.invalidMessage=m.getLocalization("newPasswordSameAsOldPasswordError");return false;}}return true;},validateChangePasswordCP:function(){if(!_1(this)){this.invalidMessage=m.getLocalization("invalidPasswordLengthError",[m._e2ee.password_mimimum_length,m._e2ee.password_maximum_length]);return false;}if(!_6(this)){this.invalidMessage=m.getLocalization("invalidPasswordCharError");return false;}if(!m.validateChangePasswordS("password_value","password_confirm")){this.invalidMessage=m.getLocalization("nonMatchingPasswordError");return false;}return true;},validateWithExistingPassword:function(){var _f=dijit.byId("password_value").get("value");var _10="";if(dijit.byId("password")){_10=dijit.byId("password").get("value");}else{if(dijit.byId("old_password_value")){_10=dijit.byId("old_password_value").get("value");}}if(_10!=""&&_f!=""){if(_10==_f){return false;}}return true;},validateChangePasswordS:function(_11,_12){var _13=dijit.byId(_11).get("value");var _14=dijit.byId(_12).get("value");if(_13!=""&&_14!=""){if(_14!=_13){this.invalidMessage=m.getLocalization("nonMatchingPasswordError");return false;}}return true;},checkConfirmPassword:function(_15,_16){var _17=dijit.byId(_15).get("value");var _18=dijit.byId(_16).get("value");if(_17!=""&&_18!=""){if(_18!=_17){dijit.byId(_16)._set("state","Error");dijit.byId(_16).invalidMessage=m.getLocalization("nonMatchingPasswordError");dijit.byId(_16).focus();}}},checkOldPassword:function(){if(dijit.byId("password")||dijit.byId("old_password_value")){if(!m.validateWithExistingPassword()){dijit.byId("password_value")._set("state","Error");dijit.byId("password_value").invalidMessage=m.getLocalization("newPasswordSameAsOldPasswordError");dijit.byId("password_value").focus();}}},validateChangePassword:function(){return m.validateChangePasswordS("password_value","password_confirm");}});})(dojo,misys);dojo.require("misys.client.validation.password_client");}