(function () {
    'use strict';

    angular
        .module('app.accountTypeBalanceSummary')
        .controller('AccountTypeBalanceController', AccountTypeBalanceController);

    /* @ngInject */
    function AccountTypeBalanceController($scope, Session, $state, $ionicLoading, $ionicModal, $timeout, $ionicScrollDelegate, AccountTypeBalanceService, AccountTypeBalanceFilterService, ModalService, $http, ContextProvider) {

        var vm = this, pageCount = 1, numOfRecordsPerLoop = 10000, paginationParameters = {
            count: (numOfRecordsPerLoop).toString(),
            start: (pageCount * numOfRecordsPerLoop - numOfRecordsPerLoop).toString()
        };
        //Model Objects
        var modalObject, currencyModelObject;
        var pars = {};
        vm.filterApplied = false;
        vm.accountTypebalanceItem = [];
        vm.popoverFields = {};
        vm.entityname = '';
        vm.userDefaultCurrency = '';
        $http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/GetStaticDataMobile", {
            'option': 'accountBalanceType'
        })
            .then(function (response) {
                AccountTypeBalanceFilterService.setaccountTypeBalanceFilterData(response.data);
            }).then(function () {
                $http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/GetStaticDataMobile", {
                    'option': 'accountBalanceTypeCurrency'
                })
                    .then(function (response) {
                        AccountTypeBalanceFilterService.setaccountTypeBalanceCurrencyData(response.data);
                    }).then(function () {
                        // $ionicLoading.show();
                        //Check is the object is empty
                        vm.isEmpty = function (obj) {
                            for (var prop in obj) {
                                if (obj.hasOwnProperty(prop)) {
                                    return false;
                                }
                            }
                            return true;
                        };

                        vm.menus = ["entity", 'currency'];

                        //Filter Model Data for the menu in filter
                        vm.filterModalData = AccountTypeBalanceFilterService.getaccountTypeBalanceFilterData();
                        //Currency Model Data for the equivalant currency search
                        vm.currencyModalData = AccountTypeBalanceFilterService.getaccountTypeBalanceCurrencyData();

                        vm.filterForm = {};

                        vm.changeMenu = function (menu) {
                            vm.menuOption = menu;
                            $timeout(function () {
                                $ionicScrollDelegate.resize();
                                $ionicScrollDelegate.scrollTop(true);
                            }, 50);
                        };

                        //Keeping an entity is mandatory if using list def 
                        vm.clearModalValue = function () {
                            if (vm.filterModalData.entities && vm.filterModalData.entities.length > 0) {
                                vm.filterForm = { "entity": vm.filterModalData.entities[0].abbv_name };
                            }

                            else {
                                vm.filterForm = {};
                            }

                        };

                        vm.clearCurrencyModalValue = function () {
                            if (vm.userDefaultCurrency !== "") {
                                vm.filterForm.account_ccy = vm.userDefaultCurrency;
                            }
                        };
                        $ionicModal.fromTemplateUrl('content/mobile/template/accountTypeBalanceSummary/accountTypeBalanceFilterModal.html', {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            modalObject = modal;
                        });

                        $ionicModal.fromTemplateUrl('content/mobile/template/accountTypeBalanceSummary/accountTypeBalanceCurrencySearch.html', {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            currencyModelObject = modal;
                        });

                        vm.openModal = function () {
                            vm.menuOption = vm.filterModalData.menus[0];
                            //Keeping an entity is mandatory if using list def for with Entity user
                            if (!vm.filterForm.entity && vm.filterModalData.entities && vm.filterModalData.entities.length > 0) {
                                vm.filterForm.entity = vm.filterModalData.entities[0].abbv_name;
                            }
                            modalObject.show();
                            ModalService.setModal(modalObject);
                        };

                        vm.closeModal = function () {

                            modalObject.hide();
                            ModalService.setModal(null);
                        };

                        vm.openCurrencyModal = function () {
                            //Get the currency to be set to the model
                            if (!vm.filterForm.account_ccy && vm.userDefaultCurrency !== '') {
                                vm.filterForm.account_ccy = vm.userDefaultCurrency;
                            }

                            vm.menuOption = vm.currencyModalData.menus[0];
                            currencyModelObject.show();
                            ModalService.setCurrencyModal(currencyModelObject);
                        };

                        vm.closeCurrencyModal = function () {
                            currencyModelObject.hide();
                            ModalService.setCurrencyModal(null);
                        };

                        $scope.$on('$destroy', function () {
                            modalObject.remove();
                            currencyModelObject.remove();
                        });

                        vm.isMenuActive = function (menuOption) {
                            return vm.menuOption === menuOption;
                        };
                        //Currency Model will always be active
                        vm.isCurrencyMenu = function () {
                            return true;
                        };

                        vm.applyFilter = function () {
                            vm.entityname = vm.filterForm.entity != null ? vm.filterForm.entity : '';
                            vm.filterApplied = true;
                            // $ionicLoading.show();
                            AccountTypeBalanceService.getAccountypeBalanceSummary(paginationParameters, vm.filterForm ? vm.filterForm : {}).then(function (result) {
                                vm.accountTypebalanceItems = result.data.items;
                                // $ionicLoading.hide();
                            });
                            vm.closeModal();

                        };
                        //Apply equivalent currency search
                        vm.applyCurrency = function () {
                            // $ionicLoading.show();
                            if (!vm.filterForm.entity && vm.entityname !== '') {
                                vm.filterForm.entity = vm.entityname;
                            }
                            AccountTypeBalanceService.getAccountypeBalanceSummary(paginationParameters, vm.filterForm ? vm.filterForm : {}).then(function (result) {
                                vm.accountTypebalanceItems = result.data.items;
                                // $ionicLoading.hide();
                            });
                            vm.closeCurrencyModal();

                        };

                        if (vm.filterModalData && vm.filterModalData.entities && vm.filterModalData.entities.length > 0) {
                            vm.entityname = vm.filterModalData.entities[0].abbv_name;
                            pars.entity = vm.filterModalData.entities[0].abbv_name;
                        }
                        pars.token = Session.getToken();
                        AccountTypeBalanceService.getAccountypeBalanceSummary(paginationParameters, pars).then(function (result) {
                            vm.accountTypebalanceItems = result.data.items;
                            vm.userDefaultCurrency = result.data.userDefaultCurrency;
                            Session.setToken(result.data.token);
                            // $ionicLoading.hide();
                        });


                        vm.getAccounts = function (item, entityName) {
                            var reqParameters = {};
                            reqParameters.token = Session.getToken();
                            if (entityName && entityName !== '') {
                                reqParameters.entity = entityName;
                            }
                            angular.forEach(item, function (value, key) {
                                if (key === 'acct_type_code') {
                                    reqParameters.acct_type_code = value;
                                }
                                else if (key === 'value') {
                                    reqParameters.account_ccy = value[0].account_ccy;
                                }
                                else if (key === 'acct_type') {
                                    reqParameters.account_type = value;
                                }
                            }, {});
                            if (reqParameters) {
                                $state.go('app.accountBalanceSummary', reqParameters);
                            }
                        };
                    })
            })
            .catch(function (msg) {

            });
    }
})();