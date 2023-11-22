(function () {
    'use strict';

    angular.module('app.accountTypeBalanceSummary').factory('AccountTypeBalanceFilterService', AccountTypeBalanceFilterService);

    /* @ngInject */
    function AccountTypeBalanceFilterService() {
        var accountTypeBalanceFilterData;
        var accountTypeBalanceCurrencyData;
        var service = {
            getaccountTypeBalanceFilterData: getaccountTypeBalanceFilterData,
            setaccountTypeBalanceFilterData: setaccountTypeBalanceFilterData,
            getaccountTypeBalanceCurrencyData:getaccountTypeBalanceCurrencyData,
            setaccountTypeBalanceCurrencyData:setaccountTypeBalanceCurrencyData
        };

        return service;

        function getaccountTypeBalanceFilterData() {
            return accountTypeBalanceFilterData;
        }

        function setaccountTypeBalanceFilterData(param) {
        	accountTypeBalanceFilterData = param;
        }
        function getaccountTypeBalanceCurrencyData() {
            return accountTypeBalanceCurrencyData;
        }

        function setaccountTypeBalanceCurrencyData(param) {
        	accountTypeBalanceCurrencyData = param;
        }
    }

})();