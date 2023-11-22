(function () {
    'use strict';

    angular.module('app.accountStatement').factory('AccountStatementFilterService', AccountStatementFilterService);

    /* @ngInject */
    function AccountStatementFilterService() {
        var accountStatementFilterData;
        var service = {
            getaccountStatementFilterData: getaccountStatementFilterData,
            setaccountStatementFilterData: setaccountStatementFilterData
        };

        return service;

        function getaccountStatementFilterData() {
            return accountStatementFilterData;
        }

        function setaccountStatementFilterData(param) {
        	accountStatementFilterData = param;
        }
    }

})();