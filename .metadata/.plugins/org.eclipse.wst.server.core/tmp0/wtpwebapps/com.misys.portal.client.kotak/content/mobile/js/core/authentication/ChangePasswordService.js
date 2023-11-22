(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('ChangePasswordService', ChangePasswordService);

    /* @ngInject */
    function ChangePasswordService($http, ContextProvider) {

        var service = {
            changePassword: changePassword,
            compareOldAndNewPassword:compareOldAndNewPassword,
            compareNewAndConfirmPassword:compareNewAndConfirmPassword
            
        };
        return service;


        function changePassword(data) {
            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/ChangePasswordAction', data)
                .then(function (response) {
                    return response.data;
                }).catch(function (msg) {

                });
        }
        function compareOldAndNewPassword(oldPassword,newPassword)
        {
        	if(oldPassword && newPassword && (oldPassword === newPassword))
        		{
        			return true;
        		}
        	else
        		{
        		  	return false;
        		}
        }
        function compareNewAndConfirmPassword(newPassword,confirmPassword)
        {
        	if(newPassword && confirmPassword && (newPassword !== confirmPassword))
        		{
        			return true;
        		}
        	else
        		{
        		  	return false;
        		}
        }
    }
})();