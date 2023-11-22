(function () {
    'use strict';
    angular.module('app.home').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.home',
                config: {
                    url: '/home',
                    views: {
                        'mainContent': {
                            templateUrl: "content/mobile/template/home/home.html",
                            controller: 'HomeController as vm'
                        }
                    }
                }
            
            }
        ];
    }
})();