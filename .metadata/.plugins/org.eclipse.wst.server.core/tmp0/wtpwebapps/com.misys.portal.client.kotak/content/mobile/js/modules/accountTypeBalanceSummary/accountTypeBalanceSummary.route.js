(function () {
    'use strict';
    angular.module('app.accountTypeBalanceSummary').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.accountTypeBalanceSummary',
                config: {
                    url: '/accountTypeBalanceSummary',
                    views: {
                        'mainContent': {
                            templateUrl: 'content/mobile/template/accountTypeBalanceSummary/accountTypeBalanceSummary.html',
                            controller: 'AccountTypeBalanceController as vm',
                            resolve: {
                            	/* @ngInject */
                            	 getStaticData: function ($http, ContextProvider, AccountTypeBalanceFilterService) {
                                     return $http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/GetStaticDataMobile",{
                                         'option': 'accountBalanceType'
                                     })
                                         .then(function (response) {
                                         	AccountTypeBalanceFilterService.setaccountTypeBalanceFilterData(response.data);
                                         }).catch(function (msg) {

                                         });
                             },
					            /* @ngInject */
					            getCurrencyData: function ($http, ContextProvider, AccountTypeBalanceFilterService) {
					                    return $http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/GetStaticDataMobile",{
					                        'option': 'accountBalanceTypeCurrency'
					                    })
					                        .then(function (response) {
					                        	AccountTypeBalanceFilterService.setaccountTypeBalanceCurrencyData(response.data);
					                        }).catch(function (msg) {
					
					                        });
					            }
                        }
                    }
                }
            }
            }
        ];
    }
})();