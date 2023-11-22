(function () {
    'use strict';

    angular.module('app.pendingTransactionDetail').factory('PendingTransactionDetailService', PendingTransactionDetailService);

    /* @ngInject */
    function PendingTransactionDetailService($http, ContextProvider) {
        var service = {
            getTransactionDetail: getTransactionDetail
        };

        return service;

        function getTransactionDetail(requestParameter) {
        	requestParameter.mode = "UNSIGNED";
            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/GetPendingTransactionMobile', requestParameter)
                .then(function (response) {
                    return response;
                })
                .catch(function (msg) {

                });
        }
    }

})();