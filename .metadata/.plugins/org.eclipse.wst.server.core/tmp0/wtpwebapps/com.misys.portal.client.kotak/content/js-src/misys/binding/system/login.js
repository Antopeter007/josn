dojo.provide("misys.binding.system.login");
/*
 -----------------------------------------------------------------------------
 Scripts for the login page.
 
 Note: the function fncFormSpecificValidation is required

 Copyright (c) 2000-2010 Misys (http://www.misys.com),
 All Rights Reserved. 

 version:   1.0
 date:      19/03/08
 -----------------------------------------------------------------------------
*/

dojo.require("dojo.parser");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.validation.common");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dojo._base.json");
dojo.require("misys.form.common");
dojo.require("misys.validation.login");
dojo.require("misys.validation.password");
dojo.require("misys.common");

(function(/*Dojo*/ d, /*Dijit*/dj, /*Misys*/m){
	
	"use strict"; // ECMA5 Strict Mode
	
	function _enableNewUserName()
	{
		if ((dj.byId("change_username").checked)) {
			dj.byId("new_user_name").set("disabled", false);
			dj.byId("new_user_name").set("required", true);
		} else {
			dj.byId("new_user_name").set("value", "");
			dj.byId("new_user_name").set("required", false);
			dj.byId("new_user_name").set("disabled", true);
		}
	}
	
	function _enableChangePassword(){
		m.toggleFields(
				(dj.byId("change_password").checked), 
				null, ["old_password_value","password_value","password_confirm"],
				false,false);
	}

	function _isTermsAndConditionsAgreed()
	{
		var flagField = dijit.byId('tandcflag');
   		var hideTT = function() {dijit.hideTooltip(flagField.domNode);};
		if(flagField && flagField.get("checked") === false)
		{
			var displayMessage = misys.getLocalization('acceptTermsAndConditions');
			flagField.set("state","Error");
			dijit.hideTooltip(flagField.domNode);
			dijit.showTooltip(displayMessage, flagField.domNode, 0);
			setTimeout(hideTT, 2000);
		}
	}
	
	function _checkConfirmPassword(){
		m.checkConfirmPassword("password_value","password_confirm");
	}
	
	d.mixin(m, {
		bind : function() {
			m.setValidation("username", m.validateAlphaNumeric);
			m.setValidation("company", m.validateCharactersExcludeSpace);
			m.setValidation("password_value", m.validateChangePasswordNP);
			m.setValidation("password_confirm", m.validateChangePasswordCP);	
			m.setValidation("new_user_name", m.validateCharactersExcludeSpace);
			m.connect("new_user_name", "onKeyPress", function(e) {
				if(e.keyCode === 32 || e.charCode === 32){
					dojo.stopEvent(e);
				}
			});
			m.connect("change_username", "onClick", _enableNewUserName);
			m.connect("new_user_name", "onChange", m.checkUserExists);
			m.connect('email', 'onBlur', function(){
				m.checkEmailExists();
			});	
			m.setValidation("email", m.validateEmailAddr);
			m.setValidation("phone", m.validatePhoneOrFax);
			
			m.connect("languageSelection","onChange",function(){
				document.location.href =  m._config.context + m._config.servlet + "/screen/" + dj.byId("path").get("value") + "?userselectedLanguage=" + dj.byId("languageSelection").get("value");
			});

			m.connect("submit", "onMouseOver", _isTermsAndConditionsAgreed);
			m.connect("password_value", "onBlur", _checkConfirmPassword);
		},
		onFormLoad : function() {
			setTimeout(function(){
				dijit.byId("company").focus();
			}, 100);
		},
	    onFormClear : function() {
			dj.byId("username").set("value","");
			dj.byId("password").set("value","");
			dj.byId("company").set("value","");
			dj.byId("username").set("state", "");
			dj.byId("password").set("state", "");
			dj.byId("company").focus();
			dj.byId("company").set("state", "");
			dijit.hideTooltip(dj.byId("company").domNode);
			
		},
		onFormClearChangePassword : function() {
			dj.byId("password").set("value","");
			dj.byId("password_value").set("value","");
			dj.byId("password_confirm").set("value","");
			dj.byId("username").focus();
		},
		beforeSubmitEncryption: function (){
			// FOR CLIENT SIDE PWD ENCRYPTION
			if(dj.byId("clientSideEncryption"))
			{
				try
				{
					if(dijit.byId('password')){dijit.byId('password').set('value', misys.encrypt(dijit.byId('password').get('value')));}
					if(dijit.byId('password_value')){dijit.byId('password_value').set('value', misys.encrypt(dijit.byId('password_value').get('value')));}
					if(dijit.byId('password_confirm')){dijit.byId('password_confirm').set('value', misys.encrypt(dijit.byId('password_confirm').get('value')));}
					if(dijit.byId("submit"))
					{
						dijit.byId("submit").set("disabled",true);
					}
					else if(dijit.byId("login"))
					{
						dijit.byId("login").set("disabled",true);
					}
					return true; 
				}
				catch(error){
		     	/* show error to user */
					misys.dialog.show("ERROR", misys.getLocalization("passwordNotEncrypted"), "", function(){});
					if(dijit.byId("submit"))
					{
						dijit.byId("submit").set("disabled",false);
					}
					else if(dijit.byId("login"))
					{
						dijit.byId("login").set("disabled",false);
					}
					return false;
				}
			}
			else
			{
				if(dijit.byId("submit"))
				{
					dijit.byId("submit").set("disabled",true);
				}
				else if(dijit.byId("login"))
				{
					dijit.byId("login").set("disabled",true);
				}
				return true;
			}
		}
	});
})(dojo, dijit, misys);
//Including the client specific implementation
       dojo.require('misys.client.binding.system.login_client');