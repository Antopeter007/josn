(function () {
    'use strict';
    angular.module('app.logout').run(appRun);
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.logout',
                config: {
                    url: '/logout',
                    views: {
                        'mainContent': {
                            templateUrl: 'content/mobile/template/logout/logout.html',
                            controller: 'LogoutController as vm'
                        }
                    }
                }
			    },
            {
                state: 'relogin',
                config: {
                    url: '/relogin',
                    templateUrl: 'content/mobile/template/logout/relogin.html',
                    controller: 'LogoutController as vm',
                    isLogin: true
                }
			    }
		    ]
    };
})();