(function () {
    'use strict';

    angular.module('app.accountBalanceSummary').factory('AccountBalanceService', AccountBalanceService);

    /* @ngInject */
    function AccountBalanceService($http, ContextProvider, Session) {
    	 var service = {
         		getAccountBalanceSummary: getAccountBalanceSummary
         };
    	 return service;
    	
    	 function getAccountBalanceSummary(pageOptions,stateParams,filterParams) {
         	angular.extend(filterParams, pageOptions,stateParams);
         	 filterParams.token= Session.getToken();
             return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/GetAccountBalancesForTypeMobile', filterParams)
                 .then(function (response) {
                     return response;
                 })
                 .catch(function (msg) {

                 });
    	 }
    }

})();