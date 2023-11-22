(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('AuthService', AuthService);

    /* @ngInject */
    function AuthService($http, Session, ContextProvider) {


        var service = {
            login: login,
            logout: logout,
            syncSession: syncSession,
            isAuthenticated: isAuthenticated,
            isReauthEnabled : isReauthEnabled
        };
        return service;

        function login(credentials) {
            return $http.post(ContextProvider.getContext() + '/screen/GTPLoginScreen/action/GTPLoginAction', credentials)
                .then(function (response) {
                    return response.data;
                }).catch(function (msg) {

                });
        }
        
        function logout(credentials) {
            return $http.post(ContextProvider.getContext() + '/action/GTPExtendedLogoutUser', credentials)
                .then(function (res) {
                    Session.destroy();
                });
        }

        function syncSession() {

            var xhr = new XMLHttpRequest();
            xhr.open('post', ContextProvider.getContext() + '/screen/AjaxScreen/action/MobileSyncSession', false);
            xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
            xhr.send();
            if(xhr.responseText !== '' && (Session.getFromState() !=='' && Session.getFromState() !== 'relogin'))
            	{
            		Session.setMessage(xhr.responseText);
            	}
            var contentType = xhr.getResponseHeader('content-type');
            if (contentType && contentType.match("application/json;") !== null) {
                Session.create();
            } else {
                Session.destroy();
            }
        }

        function isAuthenticated() {
            return Session.user;
        }
        
        function isReauthEnabled(token) {
            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/MobileReauthenticationMode', token)
                .then(function (res) {
                	Session.setHTMLModulusForReauth(res.data.htmlUsedModulus);
                	Session.setCr_SeqForReauth(res.data.cr_seq);
            		return res;
            });
        }
    }
})();