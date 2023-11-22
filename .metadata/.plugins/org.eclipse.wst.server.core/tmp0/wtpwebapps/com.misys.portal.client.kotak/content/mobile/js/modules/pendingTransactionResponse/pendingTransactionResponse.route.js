(function () {
    'use strict';
    angular.module('app.pendingTransactionResponse').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.pendingTransactionResponse',
                config: {
                    url: '/pendingTransactionResponse',
                    params: {
                        responseMessage: ""
                    },
                    views: {
                        'mainContent': {
                            templateUrl: 'content/mobile/template/pendingTransactionResponse/pendingTransactionResponse.html',
                            controller: 'PendingTransactionResponseController as vm'
                        }
                    }
                }
            }
        ];
    }
})();