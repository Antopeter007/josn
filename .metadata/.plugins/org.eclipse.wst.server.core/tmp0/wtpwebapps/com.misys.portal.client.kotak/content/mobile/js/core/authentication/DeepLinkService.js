(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('DeepLinkService', DeepLinkService);

    /* @ngInject */
    function DeepLinkService($http, Session, ContextProvider) {

        var deepLinkState = null;
        var deepLinkParams = null;
        var service = {
            setDeepLinkState : setDeepLinkState,
            getDeepLinkState : getDeepLinkState,
            setDeepLinkParams : setDeepLinkParams,
            getDeepLinkParams : getDeepLinkParams
        };
        
        return service;

        function setDeepLinkState(toState) {
            deepLinkState = toState;
        }

        function getDeepLinkState() {
            return deepLinkState;
        }
        
        function setDeepLinkParams(toParams) {
            deepLinkParams = toParams;
        }

        function getDeepLinkParams() {
            return deepLinkParams;
        }
    }
})();