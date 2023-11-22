(function () {
    'use strict';

    angular
        .module('app.changepassword')
        .controller('ChangePasswordController', ChangePasswordController);

    /* @ngInject */
    function ChangePasswordController(ChangePasswordService, $state, toastr, Session) {
        var vm = this;
        vm.pbPattern = new RegExp(Session.getPBPattern());
        vm.pbMin = Session.getPBMin();
        vm.pbMax = Session.getPBMax();
        
     // Compare Old and new Password,It should not be same.
		vm.compareOldAndNewPassword = function() {
			if (vm.changePasswordForm.$error.minlength
					|| vm.changePasswordForm.$error.pattern) {
				return;
			}
			if (ChangePasswordService.compareOldAndNewPassword(
					vm.user.password, vm.user.password_value)) {
				vm.changePasswordForm.password_value.$error.samepassword = true;
			} else if (vm.changePasswordForm.password_value) {
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
        vm.changePassword = function () {
            if (vm.changePasswordForm.$valid) {
            	vm.user.token = Session.getToken();
                ChangePasswordService.changePassword(vm.user).then(function (result) {
                    if (result) {
                        if (result.passwordChanged && result.passwordChanged === "Y") {
                            toastr.success(result.message);
                            $state.go('app.home');
                        } else if (result.passwordChanged) {
                            toastr.error(result.message);
                            vm.clearForm();
                        }
                        if(result.token) { 
                        	Session.setToken(result.token);
                        }
                    } else {
                        vm.clearForm();
                    }
                });
            }
        };
        vm.checkAllFields = function () {

			if (vm.user && vm.user.password && vm.user.password_value
					&& vm.user.password_confirm && vm.user.password !== ""
					&& vm.user.password_value !== ""
					&& vm.user.password_confirm !== "") {
				if (vm.changePasswordForm
						&& vm.changePasswordForm.password_confirm
						&& !vm.changePasswordForm.password_confirm.$error.mismatch
						&& vm.changePasswordForm.password_value
						&& !vm.changePasswordForm.password_value.$error.samepassword
						) {
					return false;
				} else {
					return true;
				}

			} else {
				return true;
			}
		}
        vm.clearForm = function () {
            vm.user = {};
        };
    }
})();