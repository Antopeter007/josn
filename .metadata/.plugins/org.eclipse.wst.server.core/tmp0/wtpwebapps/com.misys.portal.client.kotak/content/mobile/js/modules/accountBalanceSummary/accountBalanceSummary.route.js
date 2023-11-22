(function () {
    'use strict';
    angular.module('app.accountBalanceSummary').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.accountBalanceSummary',
                config: {
                    url: '/accountBalanceSummary?{account_type}&{entity}&{account_ccy}',
                    params: {
                    	account_type: null,
                    	entity:null,
                    	account_ccy:null
                    },
                    views: {
                        'mainContent': {
                            templateUrl: 'content/mobile/template/accountBalanceSummary/accountBalanceSummary.html',
                            controller: 'AccountBalanceController as vm',
                            resolve: {
                                /* @ngInject */
                                getStaticData: function ($http, ContextProvider, AccountBalanceFilterService) {
                                        return $http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/GetStaticDataMobile",{
                                            'option': 'accountBalanceType'
                                        })
                                            .then(function (response) {
                                            	AccountBalanceFilterService.setaccountBalanceFilterData(response.data);
                                            }).catch(function (msg) {

                                            });
                                },
					            /* @ngInject */
					            getCurrencyData: function ($http, ContextProvider, AccountBalanceFilterService) {
					                    return $http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/GetStaticDataMobile",{
					                        'option': 'accountBalanceTypeCurrency'
					                    })
					                        .then(function (response) {
					                        	AccountBalanceFilterService.setaccountBalanceCurrencyData(response.data);
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