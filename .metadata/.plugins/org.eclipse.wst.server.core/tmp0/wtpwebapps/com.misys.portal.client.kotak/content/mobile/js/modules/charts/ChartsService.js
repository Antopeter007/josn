(function () {
    'use strict';

    angular.module('app.core').factory('ChartsService', ChartsService);

    /* @ngInject */
    function ChartsService($http, ContextProvider) {
        var service = {
        	getGraphData: getGraphData
        };

        return service;

       function getGraphData() {
    	   return $http.get(ContextProvider.getContext() + '/screen/AjaxScreen/action/GetMobileGraphDataAction')
                .then(function (response) {
                	return response.data;
                })
                .catch(function (msg) {

                });
        };
        
    }

})();