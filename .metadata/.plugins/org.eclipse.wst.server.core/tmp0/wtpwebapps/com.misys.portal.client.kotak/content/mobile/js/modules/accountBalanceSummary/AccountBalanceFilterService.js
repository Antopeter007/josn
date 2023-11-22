(function () {
    'use strict';

    angular.module('app.accountBalanceSummary').factory('AccountBalanceFilterService', AccountBalanceFilterService);

    /* @ngInject */
    function AccountBalanceFilterService() {
        var accountBalanceFilterData,accountBalanceCurrencyData;
        var service = {
            getaccountBalanceFilterData: getaccountBalanceFilterData,
            setaccountBalanceFilterData: setaccountBalanceFilterData,
            getaccountBalanceCurrencyData:getaccountBalanceCurrencyData,
            setaccountBalanceCurrencyData:setaccountBalanceCurrencyData
            
        };

        return service;

        function getaccountBalanceFilterData() {
            return accountBalanceFilterData;
        }

        function setaccountBalanceFilterData(param) {
        	accountBalanceFilterData = param;
        }
        
        function getaccountBalanceCurrencyData() {
            return accountBalanceCurrencyData;
        }

        function setaccountBalanceCurrencyData(param) {
        	accountBalanceCurrencyData = param;
        }
    }

})();