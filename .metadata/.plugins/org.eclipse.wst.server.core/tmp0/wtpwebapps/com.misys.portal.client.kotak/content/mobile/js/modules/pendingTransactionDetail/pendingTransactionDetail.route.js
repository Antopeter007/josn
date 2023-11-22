(function () {
    'use strict';
    angular.module('app.pendingTransactionDetail').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.pendingTransactionDetail',
                config: {
                    url: '/pendingTransactionDetail?referenceid&tnxid',
                    params: {
                        token: null,
                        list_keys: null
                    },
                    views: {
                        'mainContent': {
                            templateUrl: 'content/mobile/template/pendingTransactionDetail/pendingTransactionDetail.html',
                            controller: 'PendingTransactionDetailController as vm'
                        }
                    }
                }
            }
        ];
    }
})();