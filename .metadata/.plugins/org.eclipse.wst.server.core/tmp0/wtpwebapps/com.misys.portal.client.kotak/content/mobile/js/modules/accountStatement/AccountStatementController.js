(function(){
	angular.module('app.accountStatement').controller('AccountStatementController', AccountStatementController);
	/* @ngInject */	
	function AccountStatementController($scope, $stateParams, $timeout, $ionicModal, $filter, $ionicLoading, AccountStatementService, ModalService, $ionicScrollDelegate){
		var vm=this;
		vm.parameters=$stateParams;
		vm.value='';
		vm.entityname = '';
		vm.dateOptions=[];
		vm.filter={
				type:1
		};
		vm.filterApplied = false;
		var  pageCount = 1;
        var  numOfRecordsPerLoop = 5;
		var  paginationParameters = {
	            count: (numOfRecordsPerLoop).toString(),
	            start: (pageCount * numOfRecordsPerLoop - numOfRecordsPerLoop).toString()
	        };
		vm.filter = {};
		vm.value = '';
		
		$ionicModal.fromTemplateUrl('content/mobile/template/accountStatement/accountStatementFilterModal.html', {
	            scope: $scope,
	            animation: 'slide-in-up'
	        }).then(function (modal) {
	        	modalObject = modal;
	        });
		 
		vm.openModal = function () {
				
				vm.exceeded=false;
				vm.fromDateGreater=false;	
				if(vm.filter.type=='')
            	{
            	 vm.filter.type=1;
            	}
				if(vm.filter.type!='6')
					{
					vm.fromDate='';
					vm.toDate='';
					}
	            modalObject.show();
	            ModalService.setModal(modalObject);
	        };
	        
	    vm.closeModal = function(){
	    	  modalObject.hide();
	    	  ModalService.setModal(null);
	    	  vm.filter.type=vm.value;
	    	  vm.exceeded=false;
	    	  vm.fromDateGreater=false;
	      };
	    
	    vm.check = function () {
	            vm.value = vm.filter.type;
	        };
	    $scope.$on('$destroy', function () {
	        	modalObject.remove();
	        });
	      
	    vm.checkRange= function(){
	    	  if(document.getElementById('range').disabled){
	    		  return true;
	    	  } else{
	    		  return false;
	    	  }
	      };
	    
	    vm.validateDate = function(){
	    	if(vm.fromDate && vm.toDate){
	    	vm.noOfDays= Math.abs((vm.fromDate.getTime()-vm.toDate.getTime())/86400000);
	    	vm.exceeded=false;
	    	vm.fromDateGreater=false;
	    	if(vm.fromDate.getTime()>vm.toDate.getTime()){
	    		vm.fromDateGreater=true;
	    		vm.fromDate=null;
	    		vm.toDate=null;
	    	}
	    	if(!vm.fromDateGreater && vm.noOfDays>vm.limitRange){
	    		vm.exceeded=true;
	    		vm.toDate=null;
	    	}
	    	}
	    };
	      
	    vm.applyFilter = function(){
	    	resetPagination();
	    	
	    	 if(vm.filter && vm.filter.type)
	    		 {
	    		 	vm.value=vm.filter.type;
	    		 	if(vm.value !==1)
	    		 		{
	    		 			vm.filterApplied = true;
	    		 		}
	    		 	else
	    		 		{
	    		 			vm.filterApplied = false;
	    		 		}
	    		 }
	    	 if(vm.parameters){
	    		 vm.parameters.value=vm.value;
	    	 }
	    	 if((vm.value===6) && vm.parameters){
	    		 vm.parameters.create_date = $filter('date')(vm.fromDate, "dd/MM/yyyy");
	    		 vm.parameters.create_date2 = $filter('date')(vm.toDate, "dd/MM/yyyy");
	    	 }
	    	 AccountStatementService.getAccountStatements(paginationParameters,vm.parameters,{}).then(function(result){
					vm.statements=result.data.items;
	        		vm.count=result.data.numRows;
	        		$ionicLoading.hide();
				});
	    	 if(vm.parameters.create_date && vm.parameters.create_date2){
	    		 delete vm.parameters.create_date;
	    		 delete vm.parameters.create_date2;
	    	 }
	    	 vm.closeModal();
	    	 $timeout(function () {
	                $ionicScrollDelegate.resize();
	                $ionicScrollDelegate.scrollTop(true);
	            }, 50);
	     };
	     
	     vm.clearModalValue = function () {
	    	 
	    	 if(vm.dateOptions && vm.value!='')
	    		 {
	    		 vm.filter={type:vm.value};
	    		 }
	    	 else{
	    		 vm.filter = {type:1};
	    		 vm.filterApplied = false;
	    	 }	
	    	
	        };
	     
	     
	     vm.addItems = function () {
	         pageCount++;
	         paginationParameters.start = pageCount * numOfRecordsPerLoop - numOfRecordsPerLoop;
	         AccountStatementService.getAccountStatements(paginationParameters,vm.parameters,vm.filterForm ? vm.filterForm : {}).then(function(result) {
					vm.statements = vm.statements.concat(result.data.items);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
		 	};
		 	
		 vm.moreDataCanBeLoaded = function () {
			 if(vm.statements){
		       if (vm.statements.length < vm.count) {
		           return true;
		       }
		       return false;
		   }};
		
		if(vm.parameters){
			
			if(vm.parameters.entity)
				{
				vm.entity=vm.parameters.entity;
				}
			vm.filter={type:1};
			vm.parameters.value='1';
			AccountStatementService.getAccountStatements(paginationParameters,vm.parameters,{}).then(function(result){
				vm.statements=result.data.items;
        		vm.count=result.data.numRows;
        		vm.credit= result.data.credit;
        		vm.debit= result.data.debit;
        		vm.limitRange= result.data.limit_range;
			});
		};
		function resetPagination() {
            pageCount = 1;
            paginationParameters.start = pageCount * numOfRecordsPerLoop - numOfRecordsPerLoop;

        }
		
		vm.dateOptions=[
		            {name: "Default", value:"1"},
		            {name:"Current Date", value:"2"},
					{name:"Previous Date", value:"3"},
					{name:"Previous Month", value:"4"},
					{name:"Current Month", value:"5"},
					{name:"Range", value:"6"}];
		}
		
		
		
})();