(function () {
    'use strict';

    angular.module('app.pendingList').factory('PendingListService', PendingListService);

    /* @ngInject */
    function PendingListService($http, ContextProvider) {
        var service = {
            getPendingList: getPendingList,
            getPendingListCount : getPendingListCount 
        };

        return service;

        function getPendingList(pageOptions, filterParams) {
            angular.extend(filterParams, pageOptions);

            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/GetPendingListMobile', filterParams)
                .then(function (response) {
                    return response;
                })
                .catch(function (msg) {

                });
        }
        
        function getPendingListCount() {

            return $http.get(ContextProvider.getContext() + '/screen/AjaxScreen/action/GetPendingListMobile')
                .then(function (response) {
                    return response.data.numRows;
                })
                .catch(function (msg) {

                });
        }
    }

})();