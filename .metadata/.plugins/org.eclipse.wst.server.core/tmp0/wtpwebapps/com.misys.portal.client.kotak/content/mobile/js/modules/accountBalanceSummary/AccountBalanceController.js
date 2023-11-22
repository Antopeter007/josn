(function () {
	'use strict';

	angular.module('app.accountBalanceSummary').controller(
		'AccountBalanceController', AccountBalanceController);

	/* @ngInject */
	function AccountBalanceController($scope, Session, $state, $stateParams, $ionicLoading,
		$ionicModal, $timeout, $ionicScrollDelegate,
		AccountBalanceService, AccountBalanceFilterService, ModalService, $http, ContextProvider) {
		var vm = this;
		vm.entityname = '';
		vm.currency = '';
		vm.accountBalanceItems = [];
		vm.accountBalanceItemsCount;
		vm.parameters = $stateParams;
		vm.accountBalanceSum;
		vm.userDefaultCurrency = '';
		//Pagination parameters
		var pageCount = 1;
		var numOfRecordsPerLoop = 5;
		var paginationParameters = {
			count: (numOfRecordsPerLoop).toString(),
			start: (pageCount * numOfRecordsPerLoop - numOfRecordsPerLoop).toString()
		};
		//Model Objects
		var modalObject, currencyModelObject;
		vm.menus = ["entity", 'currency'];

		$http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/GetStaticDataMobile", {
			'option': 'accountBalanceType'
		})
			.then(function (response) {
				AccountBalanceFilterService.setaccountBalanceFilterData(response.data);
				vm.filterModalData = AccountBalanceFilterService.getaccountBalanceFilterData();
			}).then(function () {
				$http.post(ContextProvider.getContext() + "/screen/MobileResourceScreen/action/GetStaticDataMobile", {
					'option': 'accountBalanceTypeCurrency'
				})
					.then(function (response) {
						AccountBalanceFilterService.setaccountBalanceCurrencyData(response.data);
						vm.currencyModalData = AccountBalanceFilterService.getaccountBalanceCurrencyData();
					}).then(function () {
						//Loading Sign
						// $ionicLoading.show();

						//Filter Model Data for the menu in filter

						vm.filterForm = {};

						vm.changeMenu = function (menu) {
							vm.menuOption = menu;
							$timeout(function () {
								$ionicScrollDelegate.resize();
								$ionicScrollDelegate.scrollTop(true);
							}, 50);
						};
						//Keeping an entity is mandatory if using list def for with entity user
						vm.clearModalValue = function () {
							if (vm.filterModalData.entities && vm.filterModalData.entities.length > 0) {
								vm.filterForm = { "entity": vm.filterModalData.entities[0].abbv_name };
							}
							else {
								vm.filterForm = {};
							}

						};

						vm.clearCurrencyModalValue = function () {
							if (vm.userDefaultCurrency !== '') {
								vm.filterForm.account_ccy = vm.userDefaultCurrency;
							}
						};

						$ionicModal.fromTemplateUrl('content/mobile/template/accountBalanceSummary/accountBalanceFilterModal.html', {
							scope: $scope,
							animation: 'slide-in-up'
						}).then(function (modal) {
							modalObject = modal;
						});

						$ionicModal.fromTemplateUrl('content/mobile/template/accountBalanceSummary/accountBalanceCurrencySearch.html', {
							scope: $scope,
							animation: 'slide-in-up'
						}).then(function (modal) {
							currencyModelObject = modal;
						});

						vm.openModal = function () {
							vm.menuOption = vm.filterModalData.menus[0];
							//Keeping an entity is mandatory if using list def for with entity user
							if (!vm.filterForm.entity && vm.filterModalData.entities && vm.filterModalData.entities.length > 0) {
								vm.filterForm.entity = vm.entityname;
							}
							modalObject.show();
							ModalService.setModal(modalObject);
						};
						vm.closeModal = function () {

							modalObject.hide();
							ModalService.setModal(null);
						};

						vm.openCurrencyModal = function () {
							vm.menuOption = vm.currencyModalData.menus[0];
							//Keeping an entity is mandatory if using list def for with entity user
							if (!vm.filterForm.account_ccy) {
								vm.filterForm.account_ccy = vm.currency;
							}
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

						//Check is the object is empty
						vm.isEmpty = function (obj) {
							for (var prop in obj) {
								if (obj.hasOwnProperty(prop)) {
									return false;
								}
							}
							return true;
						};

						if (vm.parameters) {
							if (vm.parameters.entity) {
								vm.entityname = vm.parameters.entity;
							}
							if (vm.parameters.account_ccy) {
								vm.currency = vm.parameters.account_ccy;
							}
							if (vm.filterModalData && vm.filterModalData.entities && vm.filterModalData.entities.length > 0 && vm.entityname === '') {
								vm.entityname = vm.filterModalData.entities[0].abbv_name;
								angular.extend(vm.parameters, { "entity": vm.filterModalData.entities[0].abbv_name });
							}
							AccountBalanceService.getAccountBalanceSummary(paginationParameters,
								vm.parameters, {}).then(function (result) {
									vm.accountBalanceSum = result.data.sum[0];
									vm.accountBalanceItems = result.data.items;
									vm.accountBalanceItemsCount = result.data.numRows;
									vm.userDefaultCurrency = result.data.userDefaultCurrency;
									Session.setToken(result.data.token);
									// $ionicLoading.hide();
								});
						}

						vm.applyFilter = function () {
							resetPagination();
							vm.entityname = vm.filterForm.entity != null ? vm.filterForm.entity : '';
							// $ionicLoading.show();
							if (vm.parameters) {
								if (vm.filterForm && vm.filterForm.entity && vm.filterForm.entity !== '') {
									vm.parameters.entity = vm.filterForm.entity;
								}
								if (vm.filterForm && vm.filterForm.account_ccy && vm.filterForm.account_ccy !== '') {
									vm.parameters.account_ccy = vm.filterForm.account_ccy;
								}
								AccountBalanceService.getAccountBalanceSummary(paginationParameters, vm.parameters, vm.filterForm ? vm.filterForm : {}).then(function (result) {
									vm.accountBalanceSum = result.data.sum[0];
									vm.accountBalanceItems = result.data.items;
									vm.accountBalanceItemsCount = result.data.numRows;
									// $ionicLoading.hide();
								});
							}
							vm.closeModal();

						};

						vm.applyCurrency = function () {
							resetPagination();
							// $ionicLoading.show();
							if (vm.parameters) {
								if (vm.filterForm && vm.filterForm.entity && vm.filterForm.entity !== '') {
									vm.parameters.entity = vm.filterForm.entity;
								}
								if (vm.filterForm && vm.filterForm.account_ccy && vm.filterForm.account_ccy !== '') {
									vm.parameters.account_ccy = vm.filterForm.account_ccy;
								}
								AccountBalanceService.getAccountBalanceSummary(paginationParameters, vm.parameters, vm.filterForm ? vm.filterForm : {}).then(function (result) {
									vm.accountBalanceSum = result.data.sum[0];
									vm.accountBalanceItems = result.data.items;
									vm.accountBalanceItemsCount = result.data.numRows;
									// $ionicLoading.hide();
								});
							}
							vm.closeCurrencyModal();

						};

						vm.addItems = function () {
							pageCount++;
							paginationParameters.start = pageCount * numOfRecordsPerLoop - numOfRecordsPerLoop;
							AccountBalanceService.getAccountBalanceSummary(paginationParameters, vm.parameters, vm.filterForm ? vm.filterForm : {}).then(function (result) {
								vm.accountBalanceItems = vm.accountBalanceItems.concat(result.data.items);
								$scope.$broadcast('scroll.infiniteScrollComplete');
							});
						};
						vm.moreDataCanBeLoaded = function () {
							if (vm.accountBalanceItems.length < vm.accountBalanceItemsCount) {
								return true;
							}
							return false;
						};

						function resetPagination() {
							pageCount = 1;
							paginationParameters.start = pageCount * numOfRecordsPerLoop - numOfRecordsPerLoop;

						}

						vm.getStatements = function (item, entity) {
							var reqParams = {};
							if (entity && entity !== "") {
								reqParams.entity = entity;
							}
							item.forEach(function (arrayItem) {
								if (arrayItem.account_no) {
									reqParams.account_no = arrayItem.value;
								}
								if (arrayItem.cur_code) {
									reqParams.cur_code = arrayItem.value;
								}
								if (arrayItem.account_id) {
									reqParams.account_id = arrayItem.value;
								}
								if (arrayItem.account_type) {
									reqParams.account_type = arrayItem.value;
								}
							}, {});

							if (reqParams != '') {
								$state.go('app.accountStatement', reqParams);
							}
						};
					});
			}).catch(function (msg) {

			});
	}
})();