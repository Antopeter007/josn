(function () {
    'use strict';

    angular.module('app.pendingTransactionProcess').factory('PendingTransactionProcessService', PendingTransactionProcessService);

    /* @ngInject */
    function PendingTransactionProcessService($http, ContextProvider) {
    	
    	var service = {
    			getReauthMode: getReauthMode,
                submitTransaction: submitTransaction,
                returnTransaction: returnTransaction,
                validateHolidayCutOff : validateHolidayCutOff
    	};
    	return service;
    	
    	 function getReauthMode(requestParameters) {
             return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/MobileReauthenticationMode', requestParameters)
             	.then(function (response) {
                     return response.data;
                 })
                 .catch(function (msg) {

                 });
         }
        
        function submitTransaction(requestParameters) {
            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/RunSubmissionMobile', requestParameters)
                .then(function (response) {
                return response.data;
            })
            .catch(function (msg) {

            });
        }
        
        function returnTransaction(requestParameters) {
            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/ReturnPendingTransactionMobile', requestParameters)
            	.then(function (response) {
                    return response.data;
                })
                .catch(function (msg) {

                });
        }
        
        function validateHolidayCutOff(requestParameters) {
            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/ValidateHolidayCutOffMultipleSubmission', requestParameters)
            	.then(function (response) {
                    return response.data;
                })
                .catch(function (msg) {

                });
        }
    }
})();