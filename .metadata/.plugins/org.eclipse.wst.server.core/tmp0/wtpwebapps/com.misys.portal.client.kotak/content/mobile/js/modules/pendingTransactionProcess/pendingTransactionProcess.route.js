(function () {
    'use strict';
    angular.module('app.pendingTransactionProcess').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.pendingTransactionDetail.pendingTransactionProcess',
                config: {
                    params: {
                       operation : null
                    },
                    views: {
                        'mainContent': {
                            templateUrl: 'content/mobile/template/pendingTransactionProcess/pendingTransactionProcess.html',
                            controller: 'PendingTransactionProcessController as vm'
                        }
                    }
                }
            }
        ];
    }
})();