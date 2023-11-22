(function () {
    'use strict';
    angular.module('app', [

        'app.core',
        /*
         * Feature areas
         */
        'app.login',
        'app.home',
        'app.logout',
        'app.pendingList',
        'app.error',
        'app.changepassword',
        'app.changeLanguage',
        'app.pendingTransactionDetail',
       	'app.pendingTransactionProcess',
       	'app.pendingTransactionResponse',
        'app.accountTypeBalanceSummary',
        'app.accountBalanceSummary',
        'app.accountStatement'
    ]).config(['$locationProvider', function($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);

})();