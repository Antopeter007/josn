(function () {
    'use strict';
    angular.module('app.error').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.error',
                config: {
                    url: '/error',
                    params: {errorMessage:null},
                    views: {
                        'mainContent': {
                            templateUrl: 'content/mobile/template/error/error.html',
                            controller: 'ErrorController as vm'
                        }
                    }
                }
            }
        ];
    }
})();