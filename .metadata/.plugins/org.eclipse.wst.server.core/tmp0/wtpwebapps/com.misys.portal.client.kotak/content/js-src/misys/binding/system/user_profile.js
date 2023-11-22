dojo.provide("misys.binding.system.user_profile");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.common");
dojo.require("misys.validation.common");
dojo.require("misys.validation.login");
dojo.require("misys.validation.password");
dojo.require("dijit.form.FilteringSelect");
dojo.require("misys.form.MultiSelect");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.CheckBox");

(function(/*Dojo*/d, /*Dijit*/dj, /*Misys*/m) {

	"use strict"; // ECMA5 Strict Mode
	
	// Private functions and variables go here
	function _enableChangePassword() {
		m.toggleFields(
				(dj.byId("change_password").checked), 
				null, ["old_password_value","password_value","password_confirm"],
				false,false);
	}
	
	function _enableChangeQA(){
		if(dj.byId("change_qa").get("checked")){
			
			m.toggleFields(true,null,answerIdArray,false,false);
			m.animate("fadeIn", d.byId("qaDiv"));	
		}else{
			m.toggleFields(true,answerIdArray,null,false,false);
			m.toggleFields(false,answerIdArray,null,false,false);
			m.animate("fadeOut", d.byId("qaDiv"));	
		}
	}
	function _syncLanguageFields() {
		if(dj.byId("SelectedLanguageForChangeProf") && dj.byId("language"))
		{
			dj.byId("SelectedLanguageForChangeProf").set("value",dj.byId("language").get("value"));
		}
	}
	
	function _checkConfirmPassword(){
		m.checkConfirmPassword("password_value","password_confirm");
	}
	
	function _checkOldPassword(){
		m.checkOldPassword();
	}
	
	// Public functions & variables follow
	d.mixin(m, {

		bind : function() {
			this.setValidation("password_value", m.validateChangePasswordNP);
			this.setValidation("password_confirm", m.validateChangePasswordCP);
			this.setValidation("abbv_name", m.validateCharacters);
			this.setValidation("login_id", m.validateCharacters);
			this.connect("change_password", "onClick", _enableChangePassword);
			this.connect("change_qa", "onClick", _enableChangeQA);
			this.connect("language", "onChange", _syncLanguageFields);

			this.connect("password_value", "onBlur", _checkConfirmPassword);
			this.connect("old_password_value", "onBlur", _checkOldPassword);

		},
		onFormLoad : function() {
			m.animate("fadeOut", d.byId("qaDiv"));
		},
		beforeSubmitEncryption: function (){
			// FOR CLIENT SIDE PWD ENCRYPTION
			if(dj.byId("clientSideEncryption"))
			{
				try
				{
					if(dijit.byId('old_password_value')){dijit.byId('old_password_value').set('value', misys.encrypt(dijit.byId('old_password_value').get('value')));}
	               	if(dijit.byId('password_value')){dijit.byId('password_value').set('value', misys.encrypt(dijit.byId('password_value').get('value')));}
	               	if(dijit.byId('password_confirm')){dijit.byId('password_confirm').set('value', misys.encrypt(dijit.byId('password_confirm').get('value')));}
					return true; 
				}
				catch(error){
		     	/* show error to user */
					misys.dialog.show("ERROR", misys.getLocalization("passwordNotEncrypted"), "", function(){});
					return false;
				}
			}
		}
	});

})(dojo, dijit, misys);//Including the client specific implementation
       dojo.require('misys.client.binding.system.user_profile_client');