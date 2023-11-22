(function () {
    'use strict';

    angular.module('app.pendingTransactionDetail').factory('PendingTransactionKeys', PendingTransactionKeys);

    /* @ngInject */
    function PendingTransactionKeys() {
        var service = {
            getKeyDetails: getKeyDetails,
            setKeyDetails: setKeyDetails,
            setListKeys : setListKeys,
            getListKeys : getListKeys,
            getToken : getToken,
            setToken : setToken,
            resetTransactionDetails : resetTransactionDetails
        };


        var keyDetails = null;
        var listKeys = null;
        var token = null;
        
        function getKeyDetails() {

            return keyDetails;
        }

        function setKeyDetails(value) {

            keyDetails = value;
        }
        
        function getListKeys() {

            return listKeys;
        }

        function setListKeys(value) {

            listKeys = value;
        }
        
        function getToken() {

            return token;
        }

        function setToken(value) {

            token = value;
        }
        
        function resetTransactionDetails() {
        	keyDetails = null;
            listKeys = null;
            token = null;
        }

        return service;
    }
})();