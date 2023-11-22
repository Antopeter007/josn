(function () {
    'use strict';

    angular.module('app.accountTypeBalanceSummary').factory('AccountTypeBalanceService', AccountTypeBalanceService);

    /* @ngInject */
    function AccountTypeBalanceService($http, ContextProvider, Session) {
        var service = {
        		getAccountypeBalanceSummary: getAccountypeBalanceSummary
        };

        return service;

        function getAccountypeBalanceSummary(pageOptions, filterParams) {
        	angular.extend(filterParams, pageOptions);
        	 filterParams.token= Session.getToken();
            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/GetAccountBalanceByTypeMobile', filterParams)
                .then(function (response) {
                    return response;
                })
                .catch(function (msg) {

                });
        }
    }

})();