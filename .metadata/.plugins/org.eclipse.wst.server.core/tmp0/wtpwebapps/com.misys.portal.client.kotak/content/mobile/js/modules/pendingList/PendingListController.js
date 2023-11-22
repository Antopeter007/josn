(function () {
    'use strict';

    angular
        .module('app.pendingList')
        .controller('PendingListController', PendingListController);

    /* @ngInject */
    function PendingListController($scope, $rootScope, $state, $ionicLoading, $ionicModal, $ionicScrollDelegate, $timeout, PendingListService, PendingListFilterDataService , ModalService, $http, ContextProvider) {

        var vm = this;
        var pageCount = 1;
        var numOfRecordsPerLoop = 5;
        var paginationParameters = {
            count: (numOfRecordsPerLoop).toString(),
            start: (pageCount * numOfRecordsPerLoop - numOfRecordsPerLoop).toString()
        };

        var modalObject;
        vm.pendingItemCount;
        vm.pendingListItem = [];
        vm.filterApplied = false;
        $http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/GetStaticDataMobile")
        .then(function (response) {
            PendingListFilterDataService.setpendingListFilterData(response.data);
            // $ionicLoading.show();
            //Load initial set of transactions
            PendingListService.getPendingList(paginationParameters, {}).then(function (result) {
                vm.pendingListItem = result.data.items;
                vm.pendingItemCount = result.data.numRows;
                $rootScope.count = result.data.numRows;
                // $ionicLoading.hide();
            });

            //this is called from infiniteScroll directive from html when vm.moreDataCanBeLoaded is true to load next set of transactions
            vm.addItems = function () {
                pageCount++;
                var startIntValue = pageCount * numOfRecordsPerLoop - numOfRecordsPerLoop;
                if (vm.filterApplied && vm.filterForm && (vm.filterForm.cur_code || vm.filterForm.entity || vm.filterForm.parameter1)) {
                    vm.filterForm.start = startIntValue.toString();
                    PendingListService.getPendingList(vm.filterForm, {}).then(function (result) {
                        vm.pendingListItem = vm.pendingListItem.concat(result.data.items);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
                }
                else {
                    paginationParameters.start = startIntValue.toString();
                    PendingListService.getPendingList(paginationParameters, {}).then(function (result) {
                        vm.pendingListItem = vm.pendingListItem.concat(result.data.items);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
                }
            };

            //Check whether more transactions can be loaded
            vm.moreDataCanBeLoaded = function () {
                if (vm.pendingListItem.length < vm.pendingItemCount) {
                    return true;
                }
                return false;
            };

            //On select of a transaction, the details are loaded 
            vm.getTransactionDetail = function (item) {
                var reqParameters = {};
                angular.forEach(item, function (value, key) {
                    if (value.name === 'ref_id') {
                        reqParameters.referenceid = value.value;
                    }
                    if (value.name === 'tnx_id') {
                        reqParameters.tnxid = value.value;
                    }
                    else if (value.name && value.name === 'token') {
                        reqParameters.token = value.value;
                    }
                }, {});
                if (reqParameters) {
                    $state.go('app.pendingTransactionDetail', reqParameters);
                }
            };

            //method is called to reset pagination (on applying filter)
            function resetPagination() {
                pageCount = 1;
                var startIntValue = pageCount * numOfRecordsPerLoop - numOfRecordsPerLoop;
                paginationParameters.start = startIntValue.toString();

            }
            //Called from modal to filter transactions
            vm.applyFilter = function () {
                resetPagination();
                if (vm.filterForm && (vm.filterForm.cur_code || vm.filterForm.entity || vm.filterForm.parameter1)) {
                    vm.filterApplied = true;
                }
                PendingListService.getPendingList(paginationParameters, vm.filterForm ? vm.filterForm : {}).then(function (result) {
                    vm.pendingListItem = result.data.items;
                    vm.pendingItemCount = result.data.numRows;
                    vm.closeModal();
                });

            };
            //  Modal static data
            vm.filterModalData = PendingListFilterDataService.getpendingListFilterData();
            vm.filterForm = {};

            vm.changeMenu = function (menu) {
                vm.menuOption = menu;
                $timeout(function () {
                    $ionicScrollDelegate.resize();
                    $ionicScrollDelegate.scrollTop(true);
                }, 50);
            };

            vm.clearModalValue = function () {
                vm.filterForm = {};
                vm.filterApplied = false;
            };
            //ionic moddal
            $ionicModal.fromTemplateUrl('content/mobile/template/pendingList/pendingFilterModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                modalObject = modal;

            });

            vm.openModal = function () {
                vm.menuOption = vm.filterModalData.menus[0];
                modalObject.show();
                ModalService.setModal(modalObject);
            };

            vm.closeModal = function () {
                modalObject.hide();
                ModalService.setModal(null);
            };

            $scope.$on('$destroy', function () {
                modalObject.remove();

            });

            //to highlight active menu in filter modal 
            vm.isMenuActive = function (menuOption) {
                return vm.menuOption === menuOption;
            };
        }).catch(function (msg) {

        });  
    }
})();