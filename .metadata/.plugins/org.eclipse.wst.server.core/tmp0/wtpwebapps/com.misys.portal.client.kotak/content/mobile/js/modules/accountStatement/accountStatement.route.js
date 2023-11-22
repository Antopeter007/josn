(function () {
    'use strict';
    angular.module('app.accountStatement').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
	            state:'app.accountStatement',
	            config: {
	            	url:'/accountStatement?{account_id}&{entity}&{value}&{account_no}&{cur_code}&{account_type}',
	            	params: {
                    	account_id: null,
                    	entity:null,
                    	value:null,
                    	account_no: null,
                    	cur_code : null,
                    	account_type : null
                    },
	            	views:{
	            		'mainContent':{
	            			 templateUrl: 'content/mobile/template/accountStatement/accountStatement.html',
	            			 controller: 'AccountStatementController as vm'
	            		}
	            	}
	            	
	            }
            }
        ];
    }
})();