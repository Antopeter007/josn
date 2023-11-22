(function() {
	 'use strict';
    angular.module('app.login').run(appRun);

 	/* @ngInject */
	function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }
    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    templateUrl: 'content/mobile/template/login/login.html',
                    controller: 'LoginController as vm',
                    resolve: {
                        /* @ngInject */
                        preProcessData : function ($http, ContextProvider, Session) {
                           return $http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/MobileResourceAction")
                                .then(function (response) {
                                    Session.setMode(response.data.mode);
                                    Session.setUserName(response.data.username);
                                    Session.setCompany(response.data.company);
                                    Session.setPBMax(response.data.pb_max);
                                    Session.setPBMin(response.data.pb_min);
                                    Session.setPBPattern(response.data.pb_charset);
                                    Session.setHTMLModulus(response.data.htmlUsedModulus);
                                    Session.setCr_Seq(response.data.cr_seq);
                                    return response.data;
                                }).catch(function (msg) {

                                });
                        }
                    },
                    isLogin : true
                }
            }
        ];
    }
})();


