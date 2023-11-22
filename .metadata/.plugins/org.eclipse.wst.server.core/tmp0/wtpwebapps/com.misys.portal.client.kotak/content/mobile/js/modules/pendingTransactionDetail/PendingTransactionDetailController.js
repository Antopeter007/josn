(function () {
    'use strict';

    angular
        .module('app.pendingTransactionDetail')
        .controller('PendingTransactionDetailController', PendingTransactionDetailController);

    /* @ngInject */
    function PendingTransactionDetailController($state, $stateParams, PendingTransactionDetailService, PendingTransactionKeys , Session) {

        var vm = this;
        var reqParameters = {};
        //form request parameters from url parameters and set token
        reqParameters.token = Session.getToken();
        reqParameters.referenceid = $stateParams.referenceid;
        reqParameters.tnxid = $stateParams.tnxid;
        
        //Get the summary or details for the transaction
        PendingTransactionDetailService.getTransactionDetail(reqParameters).then(function (result) {
            if (result.data && result.data.record) {
                if (result.data.record.key_details && result.data.record.key_details["tnx_id"] && typeof result.data.record.key_details["tnx_id"] === "number") {
                    result.data.record.key_details["tnx_id"] = (result.data.record.key_details["tnx_id"]).toString(); 
                }
                PendingTransactionKeys.setKeyDetails(result.data.record.key_details);
                vm.transactionDetails =  PendingTransactionKeys.getKeyDetails();
                vm.tnxSectionArray = result.data.record.sections;
                Session.setToken(result.data.record.key_details.token);
            } 
            else 
            {
                $state.go('app.error');
            }
        });
        
        vm.submitTransaction = function(operation) {
            $state.go('app.pendingTransactionDetail.pendingTransactionProcess',{operation : operation});
       }
    }
})();