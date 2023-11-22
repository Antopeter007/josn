(function () {
    'use strict';

    angular
        .module('app.pendingTransactionResponse')
        .controller('PendingTransactionResponseController', PendingTransactionResponseController);

    /* @ngInject */
    function PendingTransactionResponseController($state, $stateParams, PendingTransactionKeys, $window) {

        var vm = this;
        vm.responseMessage = "";
        vm.responseMessageStatus = true;
        
        if ($stateParams.responseMessage) {
            vm.responseMessageStatus = $stateParams.responseMessage.status;
            vm.responseMessage = $stateParams.responseMessage.message;
        }
        else
        {
            $state.go('app.pendingList');
            PendingTransactionKeys.resetTransactionDetails();
        }
        vm.transactionDetails = PendingTransactionKeys.getKeyDetails();
        
        vm.toPending = function() {
            $state.go('app.pendingList');
            PendingTransactionKeys.resetTransactionDetails();
        };
        
        vm.toTransactionDetail = function() {
        	$window.history.back();
        	PendingTransactionKeys.resetTransactionDetails();
        };
        
    }
})();