(function () {
    'use strict';

    angular.module('app.home').factory('HomeService', HomeService);

    /* @ngInject */
    function HomeService($http, ContextProvider) {

        var service = {
            getInternalNews: getInternalNews
        };
        return service;

        function getInternalNews() {
            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/MobileInternalNewsAction')
                .then(function (res) {
                	return res;
                });
        }
    }
})();