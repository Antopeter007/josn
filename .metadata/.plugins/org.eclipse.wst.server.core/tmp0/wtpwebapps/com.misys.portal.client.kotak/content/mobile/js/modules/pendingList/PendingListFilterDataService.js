(function () {
    'use strict';

    angular.module('app.pendingList').factory('PendingListFilterDataService', PendingListFilterDataService);

    /* @ngInject */
    function PendingListFilterDataService() {
        var pendingListFilterData;
        var service = {
            getpendingListFilterData: getpendingListFilterData,
            setpendingListFilterData: setpendingListFilterData
        };

        return service;

        function getpendingListFilterData() {
            return pendingListFilterData;
        }

        function setpendingListFilterData(param) {
            pendingListFilterData = param;
        }
    }

})();