(function() {
	'use strict';
	angular.module('app.login').controller('LoginController', LoginController);
	/* @ngInject */
    function LoginController(AuthService, $state, Session, LanguageService, Language,ChangePasswordService, DeepLinkService, ClientService, EncryptionProvider, $http, ContextProvider) {
		/* jshint validthis: true */

		var vm = this;
		var preProcessData = "";
		$http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/MobileResourceAction")
			.then(function (response) {
				Session.setMode(response.data.mode);
				Session.setUserName(response.data.username);
				Session.setCompany(response.data.company);
				Session.setPBMax(response.data.pb_max);
				Session.setPBMin(response.data.pb_min);
				Session.setPBPattern(response.data.pb_charset);
				Session.setHTMLModulus(response.data.htmlUsedModulus);
				Session.setCr_Seq(response.data.cr_seq);
				preProcessData = response.data;
				return response.data;
			}).then(function() {
		var availableLanguageJSON = preProcessData.languages;
		var determinedLang = Language.getPreferredLanguage();
		vm.user = {};
		vm.mode = "";
		vm.invalidChar = "";
		vm.selectedLanguage = preProcessData.language;
		vm.availableLanguages = availableLanguageJSON;
		vm.pbPattern = new RegExp(preProcessData.pb_charset);
		vm.pbMin = preProcessData.pb_min;
		vm.pbMax = preProcessData.pb_max;

		for (var i = 0; i < availableLanguageJSON.length; i++) {
			if (determinedLang === availableLanguageJSON[i].id) {
				vm.selectedLanguage = availableLanguageJSON[i];
				break;
			}
		}
		// If Mode is there,Save it and keep it.
		if (Session.getMode() !== "") {
			vm.mode = Session.getMode();
			// Mode Specific Data
			if (vm.mode === "change_password_qa"
					|| vm.mode === "change_password") {
				vm.user.username = Session.getUserName();
				vm.user.company = Session.getCompany();
				Session.setUserName("");
				Session.setCompany("");
			}
		}
		
		
		if(Session.getFromState() !== '' && Session.getFromState() !== 'relogin')
			{
				vm.message= Session.getMessage();
			}	
		
		// Compare Old and new Password,It should not be same.
		vm.compareOldAndNewPassword = function() {
			if (vm.changePasswordForm.$error.minlength
					|| vm.changePasswordForm.$error.pattern) {
				return;
			}
			if(ChangePasswordService.compareOldAndNewPassword(vm.user.password,vm.user.password_value)){
				vm.changePasswordForm.password_value.$error.samepassword = true;
			}
			else if(vm.changePasswordForm.password_value){
				vm.changePasswordForm.password_value.$error.samepassword = false;
			}
		};
		// Compare New and Confirm password they should be same.
		vm.compareNewAndConfirmPassword = function() {
			if (vm.changePasswordForm.$error.minlength
					|| vm.changePasswordForm.$error.pattern) {
				return;
			}
			if(ChangePasswordService.compareNewAndConfirmPassword(vm.user.password_value,vm.user.password_confirm)){
				vm.changePasswordForm.password_confirm.$error.mismatch = true;
			}
			else if(vm.changePasswordForm.password_confirm){
				vm.changePasswordForm.password_confirm.$error.mismatch = false;
			}
		};
		// Validate new User name at client level
		vm.validateNewUserName = function() {
			var strValidCharacters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/-?.,+_";
			var isValid = true;
			if (vm.user.new_user_name) {
				angular.forEach(vm.user.new_user_name, function(theChar) {
					if (strValidCharacters.indexOf(theChar) < 0 && isValid) {
						isValid = false;
						vm.invalidChar = theChar;
					}
				});
			}
			if (!isValid) {
				vm.changePasswordForm.new_user_name.$error = {
					invalidname : true
				};
			} else {
				vm.changePasswordForm.new_user_name.$error = {
					invalidname : false
				};
			}

		};
		// Disable Submit button till form is valid.
		vm.checkAllFields = function() {

			if (vm.user && vm.user.password && vm.user.password_value
					&& vm.user.password_confirm && vm.user.password !== ""
					&& vm.user.password_value !== ""
					&& vm.user.password_confirm !== "") {
				if (vm.changePasswordForm
						&& vm.changePasswordForm.password_confirm
						&& !vm.changePasswordForm.password_confirm.$error.mismatch
						&& vm.changePasswordForm.password_value
						&& !vm.changePasswordForm.password_value.$error.samepassword
						&& (vm.mode === "change_password_qa"
								&& vm.changePasswordForm.new_user_name && (vm.changePasswordForm.new_user_name === "" || !vm.changePasswordForm.new_user_name.$error.invalidname) || vm.mode === "change_password")) {
					return false;
				} else {
					return true;
				}

			} else {
				return true;
			}
		};

		vm.login = function() {
			if (vm.myForm && vm.myForm.$valid || vm.termsConditionForm
					&& vm.termsConditionForm.$valid || vm.changePasswordForm
					&& vm.changePasswordForm.$valid) {
				$http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/MobileResourceAction")
				.then(function (response) {
					Session.setMode(response.data.mode);
					Session.setUserName(response.data.username);
					Session.setCompany(response.data.company);
					Session.setPBMax(response.data.pb_max);
					Session.setPBMin(response.data.pb_min);
					Session.setPBPattern(response.data.pb_charset);
					Session.setHTMLModulus(response.data.htmlUsedModulus);
					Session.setCr_Seq(response.data.cr_seq);
					vm.user.tandcflag = "on";
				vm.user.userSelectedLanguage = vm.selectedLanguage.id;
				if(document.getElementById('client_side_encryption').innerHTML==='true'){
					if(vm.user.password!=='' && vm.user.password !== undefined){
						var encryptedPassword = EncryptionProvider.encryptText(vm.user.password);
						vm.user.password = encryptedPassword;
					}
					if(vm.user.password_value!=='' && vm.user.password_value!==undefined){
						var encryptedPassword = EncryptionProvider.encryptText(vm.user.password_value);
						vm.user.password_value = encryptedPassword;
					}
					if(vm.user.password_confirm!=='' && vm.user.password_confirm!==undefined){
						var encryptedPassword = EncryptionProvider.encryptText(vm.user.password_confirm);
						vm.user.password_confirm = encryptedPassword;
					}
				}
				
				AuthService.login(vm.user).then(function(result) {
					if (result) {
						if (result.mode && result.mode !== "") {
							vm.mode = result.mode;
							Session.setMode(result.mode);
						} else {
							Session.create();
							Session.setMode("");
							if(result.message!==""){
								Session.setSessionMessage(result.message);
							}
                            if(DeepLinkService.getDeepLinkState() !== null)
                            {
                                $state.go(DeepLinkService.getDeepLinkState().name, DeepLinkService.getDeepLinkParams());
                            }
                            else
                            {
                                $state.go('app.home');
                            }
							LanguageService.updateLanguage(vm.selectedLanguage.id);
						}
					} else {
						vm.clearForm();
					}
				});
				});
			}
		};
		LanguageService.updateLanguage(vm.selectedLanguage.id);
		vm.preLoginContent={};
		//To display the pre-login content 
		ClientService.getCustomerContent(vm.selectedLanguage.id, true).then(function (result) {
        	vm.preLoginContent=result;
        });
		
		vm.changeLanguage = function(langKey) {
			vm.preLoginContent={};
			LanguageService.updateLanguage(langKey);
			//To display the pre-login content 
			ClientService.getCustomerContent(langKey, true).then(function (result) {
	        	vm.preLoginContent=result;
	        });						
		};

		vm.logout = function() {
			vm.commonToken= Session.getCommonToken();
			AuthService.logout({commonToken:vm.commonToken}).then(function() {
				Session.setMode("");
				$state.go('relogin');
			});
		};

		vm.clearForm = function() {
			vm.user.password = '';
			if(vm.myForm && vm.myForm.$submitted)
				{
					vm.myForm.$submitted = false;
				}
			if (vm.user.password_value && vm.user.password_confirm) {
				vm.user.password_value = '';
				vm.user.password_confirm = '';
			}
		};
			})
			.catch(function (msg) {

			});
	}
})();