(function () {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        var otherwise = function($injector) {
            var $state = $injector.get("$state");
            $state.go("login");
        };
        routerHelper.configureStates(getStates(), otherwise);
    }

    function getStates() {
        return [
            {
                state: 'app',
                config: {
                    url: "/app",
                    abstract: true,
                    templateUrl: "content/mobile/template/menu/menu.html",
                    resolve: {
                        /* @ngInject */
                        getMenus: function ($http, ContextProvider) {
                                return $http.post(ContextProvider.getContext() + "/screen/AjaxScreen/action/MenuBuilderMobile")
                                    .then(function (response) {
                                    return response.data;
                                }).catch(function (msg) {

                                });
                            },
			            /* @ngInject */
			            postLoginData : function ($http, ContextProvider, Session) {
			               if(Session.getUserName() === "")
			               {
			               return $http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/MobileResourceAction")
			                    .then(function (response) {
			                        Session.setMode(response.data.mode);
									Session.setCommonToken(response.data.commonToken);
			                        Session.setLoginId(response.data.loginid);
			                        Session.setCompany(response.data.company);
			                        Session.setPBMax(response.data.pb_max);
			                        Session.setPBMin(response.data.pb_min);
			                        Session.setPBPattern(response.data.pb_charset);
			                        Session.setDesktopRedirectURL(response.data.desktop_redirect_url);
			                        return response.data;
			                    }).catch(function (msg) {
			
			                    });
			               }
			            }
                    },
                    /* @ngInject */
                    controller: function($scope, getMenus , LanguageService ,  Session){
                    	LanguageService.updateLanguage(getMenus.language);
                        $scope.menus = getMenus.menus;
                        $scope.desktopRedirectURL = Session.getDesktopRedirectURL();
                        $scope.loginId = Session.getLoginId();
                        $scope.company = Session.getCompany();
                        Session.setToken(getMenus.token);
                        
                    }
                    
                }
            }
        ];
    }
})();