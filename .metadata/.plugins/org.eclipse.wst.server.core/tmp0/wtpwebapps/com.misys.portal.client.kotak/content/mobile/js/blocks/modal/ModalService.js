(function () {
    'use strict';

    angular.module('blocks.modal').factory('ModalService', ModalService);

    /* @ngInject */
    function ModalService($http, $translate, ContextProvider) {
        var service = {
            setModal: setModal,
            getModal: getModal,
            setCurrencyModal:setCurrencyModal,
            getCurrencyModal:getCurrencyModal
        };
        
        
        var modal = null,currencyModal=null;
        function setModal(value) {
            modal = value;
        }
       
        function getModal() {
            return modal;
        }
        
        function setCurrencyModal(value) {
        	currencyModal = value;
        }
       
        function getCurrencyModal() {
            return currencyModal;
        }
        return service;
    }
})();