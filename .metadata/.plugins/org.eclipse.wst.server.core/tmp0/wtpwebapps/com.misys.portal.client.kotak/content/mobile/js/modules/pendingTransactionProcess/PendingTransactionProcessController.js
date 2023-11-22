(function () {
    'use strict';

	angular
	    .module('app.pendingTransactionProcess')
	    .controller('PendingTransactionProcessController', PendingTransactionProcessController);
	
	/* @ngInject */
    function PendingTransactionProcessController($scope, $stateParams, $state, $ionicPopup, $window, toastr, PendingTransactionProcessService, PendingTransactionKeys , AuthService , ModalService , Language, Session, EncryptionProvider) {
	
		var vm = this;
        vm.transactionDetails = PendingTransactionKeys.getKeyDetails();
        vm.operation = $stateParams.operation;
        vm.returnCommentsError = false;
        
        var validateHolidayCutOff = function() {
        	var requestParam = {};
        	vm.autoForwardTransactionDetails = [];
        	var str = "";
            
            requestParam.list_keys = PendingTransactionKeys.getKeyDetails().list_keys;
            requestParam.token = Session.getToken();
            PendingTransactionProcessService.validateHolidayCutOff(requestParam).then(function(result){
            	vm.isAutoForward = !result.isValid;
            	
            	if(result.autoForwardTransactionDetails && result.autoForwardTransactionDetails.length > 0)
            	{
            		str = result.autoForwardTransactionDetails[0];
                    if (str.length > 0) {
                        var ref_id = str.split(" ")[0];
                        var sub_product_code = str.substring(str.indexOf(' '), str.indexOf(' (')).trimLeft();
                        var amount = str.match(/\(([^)]+)\)/)[1];
                        
                        (vm.autoForwardTransactionDetails).push(ref_id);
                        (vm.autoForwardTransactionDetails).push(sub_product_code);
                        (vm.autoForwardTransactionDetails).push(amount);
                    }
            	}
            });
        	
        };
        
        if(vm.operation === 'submit')
    	{
            if(PendingTransactionKeys.getKeyDetails() && PendingTransactionKeys.getKeyDetails() !== null)
            {
                validateHolidayCutOff();
            }
        	else
            {
                $state.go('app.pendingList');
            }
    	}
        
        var showPopup = function() {
            vm.data = {};
            var popUpTitle = Language.getLocaleValue('REAUTH_POPUP_MSG');
            var popUpCancelTitle = Language.getLocaleValue('POPUP_CANCEL');
            var popUpSubmitTitle = Language.getLocaleValue('POPUP_SUBMIT');

            vm.pbMax = Session.getPBMax();
            
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
            	
            	cssClass : angular.element(document.querySelector("[ui-view]"))[0].style.direction === "rtl" ? 'dir-right' : 'dir-left',
                template: '<input type="password" name="reauth" id="reauth" autofocus ng-model="vm.data.reauth" maxlength="{{vm.pbMax}}" >',
                title: popUpTitle,
                scope : $scope,
                buttons: [
                    { 
                    	text: popUpCancelTitle,
                    	type: 'button-assertive',
                    	onTap: function(e) {
                    		ModalService.setModal(null);
                    	}
                    },
                    {
                        text: '<b>'+popUpSubmitTitle+'</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if(!vm.data.reauth)
                            {
                                e.preventDefault();
                            }
                            else
                            {
                                ModalService.setModal(null);
                                $scope.$broadcast(vm.operation, {reAuthValue : vm.data.reauth}); 
                            }
                        }
                    }
                ]
            });
            ModalService.setModal(myPopup);
        };
        
		vm.submitTransaction = function() {
            //auto forward
			if(vm.operation === 'return' && !vm.returnComments)
			{
				vm.returnCommentsError = true;
			}
			else
			{
				vm.returnCommentsError = false;
				AuthService.isReauthEnabled(PendingTransactionKeys.getKeyDetails()).then(function(result){
                if(result.data && result.data.reAuthType === 'PASSWORD')
                {
                    showPopup();
                }
                else
                {
                    $scope.$broadcast(vm.operation, {});
                }
	            });
			}
		};
        
        $scope.$on('submit',function(event, args) {
            var requestParam = {};
            if(args.reAuthValue && document.getElementById('client_side_encryption').innerHTML==='true'){
            	var encryptedPassword = EncryptionProvider.encryptText(args.reAuthValue);
            	requestParam.reauth_otp_response = encryptedPassword;
            }
            else if(args.reAuthValue)
            {
                requestParam.reauth_otp_response = args.reAuthValue;
            }
            requestParam.autoForward = 'Y';
            requestParam.list_keys = PendingTransactionKeys.getKeyDetails().list_keys;
            requestParam.token = Session.getToken();
            PendingTransactionProcessService.submitTransaction(requestParam).then(function(result){
            	if(result.reauth)
        		{
            		toastr.error(result.message);
        		}
            	else
        		{
            		$state.go("app.pendingTransactionResponse",{responseMessage : result});
        		}
            });
        });
        
        $scope.$on('return',function(event, args) {
        	var requestParam = {};
            if(args.reAuthValue)
            {
                requestParam.reauth_otp_response = args.reAuthValue;
            }
            requestParam.list_keys = PendingTransactionKeys.getKeyDetails().list_keys;
            requestParam.token = Session.getToken();
            requestParam.returnComments = vm.returnComments;
            PendingTransactionProcessService.returnTransaction(requestParam).then(function(result){
            	if(result.reauth)
        		{
            		toastr.error(result.message);
        		}
            	else
        		{
            		$state.go("app.pendingTransactionResponse",{responseMessage : result});
        		}
            });
        });
        
		vm.cancel = function() {
            $state.go('app.pendingTransactionDetail');
		};
		
		vm.toPending= function()
        {
        	$state.go('app.pendingList');
        };
	}
})();