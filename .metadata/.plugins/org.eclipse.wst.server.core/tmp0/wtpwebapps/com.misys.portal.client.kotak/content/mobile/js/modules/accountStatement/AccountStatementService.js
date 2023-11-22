(function () {
    'use strict';

    angular.module('app.accountStatement').factory('AccountStatementService', AccountStatementService);

    /* @ngInject */
    function AccountStatementService($http, ContextProvider, Session) {
        var service = {
        		getAccountStatements: getAccountStatements
        };

        return service;
        function getAccountStatements(pageOptions,stateParams,filterParams){
        	angular.extend(filterParams, pageOptions,stateParams);
        	filterParams.token = Session.getToken();
        	return $http.post(
                    ContextProvider.getContext() + '/screen/AjaxScreen/action/GetAccountStatementMobileJSONData', filterParams)
                    .then(function (response) {
                        return response;
                    })
                    .catch(function (msg) {});
        }
    }

})();