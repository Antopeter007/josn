(function () {
    'use strict';
    angular.module('app.pendingList').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.pendingList',
                config: {
                    url: '/pendingList',
                    views: {
                        'mainContent': {
                            templateUrl: 'content/mobile/template/pendingList/pendingList.html',
                            controller: 'PendingListController as vm',
                            resolve: {
                                /* @ngInject */
                                getStaticData: function ($http, ContextProvider, PendingListFilterDataService) {
                                        //Get Static data for the filter modal and save in service object
                                        return $http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/GetStaticDataMobile")
                                            .then(function (response) {
                                                PendingListFilterDataService.setpendingListFilterData(response.data);
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