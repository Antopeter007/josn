dojo.provide("misys.validation.password");

// Copyright (c) 2000-2013 Misys (http://www.misys.com),
// All Rights Reserved. 
//
// summary:
// 		Validations for the login/change password pages.
//
// version:   1.2
// date:      20/04/11
// author:    Cormac Flynn

(function(/* Dojo */ d, /* Misys */ m){
	
	"use strict"; // ECMA5 Strict Mode
	
	// Private functions

	
	function _validatePasswordLength (/* Widget */ field){
		// summary:
	    // Validate the length of the password
		
	   
		var minLength =  m._e2ee.password_mimimum_length;
		var maxLength = m._e2ee.password_maximum_length;
		var passwordLength = field.get("value").length;
		if ((passwordLength < minLength) || (passwordLength > maxLength))
		{
			return false;
		}
  		return true;
	
	}
	function _validatePasswordCharacter (/* Widget */ field){
		// summary:
	    // Validate the content of the specified field against the given
		// character set.
	    // tags:
	    // private
		var regExp;
		var regExpInput = m._e2ee.password_charset;
		try
	  	{
	  		regExp = new RegExp(regExpInput);
	  	}
	  	catch (error)
	  	{
	  		console.debug('Error while parsing the password charset');
	  		
	  		return false;
	  	}
	  	
  		if (!regExp.test(field.get('value')))
  		{		
  			console.debug('Password not matching regular expression check -- portal.properties');
  			return false;
  		} 
  		else{
  			console.debug('Password matching regular expression check -- portal.properties');
  			return true;
  		}
  		
	}
	
	d.mixin(m, {
		
		/**
		 * <h4>Summary:</h4>
		 * Validate a change password, testing if the password and the, 
		 * confirm password's fields are the same.
		 * @method validateChangePasswordNP
		 */
		validateChangePasswordNP : function(){
			// summary:
		    // Validate a change password, testing if the password and the
			// confirm password's
			// fields are the same.
		    // tags:
		    // public, validation
			
			//LoginId and Password Validation: Password can not be same as login user name 
			var changeUserNameCheckbox = dijit.byId("change_username");
			var userName = dijit.byId("username");
			var loginId = dijit.byId("login_id");
			var newUserName = dijit.byId("new_user_name");
			var loginIDtobeVerified;
			if(changeUserNameCheckbox && changeUserNameCheckbox.get('checked') && newUserName && newUserName.get('value') != "")
            {
               loginIDtobeVerified =  newUserName;
            }
			else
            {
	            if (userName && userName.get('value') != "")
                {
                    loginIDtobeVerified = userName;
                } 
	            else if (loginId && loginId.get('value') != "")
                {
                      loginIDtobeVerified = loginId;
                }
            }
			if(loginIDtobeVerified)
			{
				if(loginIDtobeVerified.get("value") == dijit.byId("password_value").get("value").toUpperCase())
				{
					this.invalidMessage = m.getLocalization("passwordSameAsLoginIdError");
					return false;
				}
				else if((dijit.byId("password_value").get("value").toUpperCase().indexOf(loginIDtobeVerified.get("value").toUpperCase())) !== -1 && "false" === misys._e2ee.allowUserNameInPasswordValue)
                {
                    this.invalidMessage = m.getLocalization("passwordContainsLoginIdError");
                    return false;
                }
			}
			// Validation 1.a.: Validate the new password value entered is satisfying the password policy
			if(!_validatePasswordLength(this)){
				this.invalidMessage = m.getLocalization('invalidPasswordLengthError', [ m._e2ee.password_mimimum_length,m._e2ee.password_maximum_length ]);
				return false;
			}
			// Validation 1.b.: Validate the new password value entered is satisfying the password policy
			if(!_validatePasswordCharacter(this)){
				this.invalidMessage = m.getLocalization('invalidPasswordCharError');
				return false;
			}
			
			// Validation 2: Validate the new password value entered is not same as the old password if present in the scree.
			// we are checking for both the elements with id 'password' or 'old_password_value' 
			// because different XLS has with different id/name
			if(dijit.byId('password') || dijit.byId('old_password_value')){
				if(!m.validateWithExistingPassword()){
					this.invalidMessage = m.getLocalization('newPasswordSameAsOldPasswordError');
					return false;
				}
			}			
			
			return true;
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * Validate a change password, testing if the password and the, 
		 * confirm password's fields are the same.
		 * @method validateChangePasswordCP
		 */
		validateChangePasswordCP : function(){
			// summary:
		    // Validate a change password, testing if the password and the
			// confirm password's
			// fields are the same.
		    // tags:
		    // public, validation
			
			// Validation 1.a.: Validate the new password value entered is satisfying the password policy
			if(!_validatePasswordLength(this)){
				this.invalidMessage = m.getLocalization('invalidPasswordLengthError', [ m._e2ee.password_mimimum_length,m._e2ee.password_maximum_length ]);
				return false;
			}
			// Validation 1.b.: Validate the new password value entered is satisfying the password policy
			if(!_validatePasswordCharacter(this)){
				this.invalidMessage = m.getLocalization('invalidPasswordCharError');
				return false;
			}
			
			// Validation 2: Validate the new password value and the confirm password is same
			if(!m.validateChangePasswordS('password_value','password_confirm'))
			{
				this.invalidMessage = m.getLocalization('nonMatchingPasswordError');
				return false;
			}
			return true;
			
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method checks the new password value with existing (old) password value, 
		 * if there is a mismatch it highlight the current field with error message and return false.
		 * @method validateWithExistingPassword
		 */
		validateWithExistingPassword : function(){
			
			var newPasswordValue = dijit.byId('password_value').get('value');
			var existingPasswordValue = "";
			if (dijit.byId('password')){
				existingPasswordValue = dijit.byId('password').get('value');
			}else if(dijit.byId('old_password_value')){
				existingPasswordValue = dijit.byId('old_password_value').get('value');
			}
			
			console.debug('[Validate] Validating Password Change - New Password vs OldPassword');
			if(existingPasswordValue != '' && newPasswordValue != ''){
				if(existingPasswordValue == newPasswordValue){
					return false;
				}
			}			
			return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method checks the password confirm value with password value, 
		 * if there is a mismatch it highlight the current field with error message and return false.
		 * @param {String} passwdfldName
		 * @param {String} passwdconfmName
		 * @method validateChangePasswordS
		 */
		validateChangePasswordS : function(/* String */ passwdfldName,passwdconfmName){
		
			var newPasswordValue = dijit.byId(passwdfldName).get('value');
			var newPasswordConfirmValue = dijit.byId(passwdconfmName).get('value');
			console.debug('[Validate] Validating Password Change - New Password vs Confirm Password');
			if(newPasswordValue != '' && newPasswordConfirmValue != ''){
				// if 'password' and 'confirm password' values are not the same
				if(newPasswordConfirmValue != newPasswordValue){
					this.invalidMessage = m.getLocalization('nonMatchingPasswordError');
					return false;
				}
			}
			return true;
		},
		
		/**
		 * <h4>Summary:</h4>
		 * This method checks the password confirm value with password value, 
		 * if there is a mismatch it highlight the confirm password field with error message.
		 * @param {String} passwdfldName
		 * @param {String} passwdconfmName
		 * @method checkConfirmPassword
		 */
		checkConfirmPassword : function(/* String */ passwdfldName,passwdconfmName){
		
			var newPasswordValue = dijit.byId(passwdfldName).get('value');
			var newPasswordConfirmValue = dijit.byId(passwdconfmName).get('value');
			console.debug('[Validate] Validating Password Change - New Password vs Confirm Password');
			if(newPasswordValue != '' && newPasswordConfirmValue != ''){
				// if 'password' and 'confirm password' values are not the same
				if(newPasswordConfirmValue != newPasswordValue){
					dijit.byId(passwdconfmName)._set("state","Error");
					dijit.byId(passwdconfmName).invalidMessage = m.getLocalization('nonMatchingPasswordError');
					dijit.byId(passwdconfmName).focus();
				}
			}
		},
		
		
		checkOldPassword : function( ){
			
			if(dijit.byId('password') || dijit.byId('old_password_value')){
				if(!m.validateWithExistingPassword()){
					dijit.byId('password_value')._set("state","Error");
					dijit.byId('password_value').invalidMessage = m.getLocalization('newPasswordSameAsOldPasswordError');
					dijit.byId('password_value').focus();
				}
			}
		},
		
		//This function should not be used for Client - rather use validateChangePasswordNP/validateChangePasswordCP
		validateChangePassword : function(){
			// summary:
		    // Validate a change password, testing if the password and the
			// confirm password's
			// fields are the same.
		    // tags:
		    // public, validation
			return m.validateChangePasswordS('password_value','password_confirm');
		}
	});

})(dojo, misys);//Including the client specific implementation
       dojo.require('misys.client.validation.password_client');