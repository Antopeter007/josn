(function () {
    'use strict';

    angular.module('app.home').controller('HomeController', HomeController);

    /* @ngInject */
    function HomeController($rootScope, $state, PendingListService, Session, $sce, ContextProvider, HomeService, Language, $ionicSlideBoxDelegate, $timeout, $ionicScrollDelegate, ChartsService, $scope, $translate, ClientService, $ionicPopup, ModalService) {
        var vm = this;
        vm.errMsg = "";
        vm.currSlide = 0;
        vm.graph_data = {};
        vm.message="";
        
        HomeService.getInternalNews().then(function (result) {
        	vm.hasNews = {};
        	vm.hasNews = result.data.news_record;
        	if(vm.hasNews)
        	{
	        	var newsRecords = result.data.news_record,
	        	    topicArray =  result.data.topic_id_array ? result.data.topic_id_array : null;
	        	vm.newsJSON	= []; 
	        	var newsRecord, topic; 
	        	if(newsRecords ) {
	        		if(newsRecords.length > 0) { 
	        			for(var i=0; i<newsRecords.length; i++) {
			        		newsRecord = newsRecords[i];
			        		if(topicArray !== null) {
			        			topic = topicArray[newsRecord.topic_id];
			        		} else {
			        			topic = result.data.channel_record.topics.topic;
			        		}
			        		
			        		vm.newsJSON.push({description: $sce.trustAsHtml(newsRecord.description) , 
			        			title:(newsRecord.title)?newsRecord.title:'', 
			        			topic_link : topic ? topic.link:'', 
			        			topic_img_id : topic? ContextProvider.getContext() + '/screen/AjaxScreen/action/GetCustomerLogo?logoid='+topic.img_file_id:'', 
			        			topic_title : topic ? topic.title:'', 
			        			news_link : newsRecord.link });
	        			}
	        		} else {
	        			newsRecord = newsRecords;
		        		if(topicArray !== null) {
		        			topic = topicArray[newsRecord.topic_id];
		        		} else {
		        			topic = result.data.channel_record.topics.topic;
		        		}
		        		
		        		vm.newsJSON.push({description: $sce.trustAsHtml(newsRecord.description) , 
		        			title:(newsRecord.title)?newsRecord.title:'', 
		        			topic_link : topic ? topic.link:'', 
		        			topic_img_id : topic? ContextProvider.getContext() + '/screen/AjaxScreen/action/GetCustomerLogo?logoid='+topic.img_file_id:'', 
		        			topic_title : topic ? topic.title:'', 
		        			news_link : newsRecord.link});
	        		}
	        	}
        	}
        	else
        	{
        		vm.errMsg = Language.getLocaleValue('NO_NEWS_RECORDS');
        	}
        });
        
        PendingListService.getPendingListCount().then(function (result) {
            $rootScope.count = result;
        });
          
        vm.sanitizeURL = function (input) {
        	var txt = document.createElement("textarea");
            txt.innerHTML = input;
        	return txt.value;
        }
        ChartsService.getGraphData().then(function (result) {
        	if(angular.element(document.querySelector("[ui-view]"))[0].style.direction === "rtl") {
        		for (var i = 0; i < result.length; i++) {
        			var result_i = result[i];
        			if(result_i.ChartType && result_i.ChartType==='line') { 
	        			if(result_i.amounts) {
	            			for(var j=0; j<result_i.amounts.length;j++) { 
	            				result_i.amounts[j] = result_i.amounts[j].reverse();
	            			}
	            		}
	            		if(result_i.labels) {
	            			result_i.labels = result_i.labels.reverse();
	            		}
	            		if(result_i.series) {
	            			result_i.series = result_i.series.reverse();
	            		}
	            		result[i]=result_i;	        			
        			}
        		}
        	}
        	vm.graph_data_list = result;
        });
        
		var languageSelected = (Session.getLanguageSelected() != null && Session.getLanguageSelected() != undefined) ? Session.getLanguageSelected() : $translate.use();
        ClientService.getCustomerContent(languageSelected, false).then(function(response){
        	vm.customerContent = response;
        });
        
        vm.toPending= function()
        {
        	$state.go('app.pendingList');
        }
        
        vm.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        vm.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };
        
        vm.slideChanged = function () {
            $ionicScrollDelegate.scrollTop();
            vm.currSlide = $ionicSlideBoxDelegate.currentIndex();
            
            $timeout( function() {
                $ionicScrollDelegate.resize();
              }, 50);
        };
        
        vm.message= Session.getSessionMessage();
        var showPopUp = function(){
        	var myPopUp = $ionicPopup.show({
        		cssClass : angular.element(document.querySelector("[ui-view]"))[0].style.direction === "rtl" ? 'dir-right' : 'dir-left',
        		template: '<textarea type="text" name="message" id="session_message" autofocus ng-model="vm.message" readonly>',
        		title: "Session Message",
        		scope : $scope,
        		buttons: [
                          { 
                          	text: "Ok",
                          	type: 'button-positive',
                          	onTap: function(e) {
                          		ModalService.setModal(null);
                          	}
                          }]
        	});
        	ModalService.setModal(myPopUp);
        	Session.setSessionMessage("");
        };
        if(vm.message!=="" && vm.message!==undefined){
        	$scope.$on("$ionicView.loaded", showPopUp);
        }
        
       $timeout( function() {
    	   vm.slidesCount = angular.element("ion-slide").length;
    	  }, 50);
        
   }
})();