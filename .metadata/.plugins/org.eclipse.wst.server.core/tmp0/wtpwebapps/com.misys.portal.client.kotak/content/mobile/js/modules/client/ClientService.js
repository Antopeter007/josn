(function () {
    'use strict';

    angular.module('app.core').factory('ClientService', ClientService);

    /* @ngInject */
    function ClientService($http, ContextProvider, $sanitize, $sce) {
        var service = {
        		getCustomerContent: getCustomerContent
        };

        return service;

       function getCustomerContent(langKey, pre_login) {
       	   var defaultUrl = ""; 
       	   if(pre_login === true) { 
       		   defaultUrl = "content/html/mobile/pre_login_content";
    	   } else {
    		   defaultUrl = "content/html/mobile/home_content";
    	   }
    	   var langUrl = "";
    	   if(langKey && langKey.length > 0) { 
    		   langUrl = defaultUrl + "_" + langKey;
    	   } 
    	   langUrl = langUrl +".html";
    	   return $http.get(langUrl).then(function (response) {
    		    return $sce.trustAsHtml(response.data);
           })
           .catch(function (msg) {

           });
       };
    }

})();