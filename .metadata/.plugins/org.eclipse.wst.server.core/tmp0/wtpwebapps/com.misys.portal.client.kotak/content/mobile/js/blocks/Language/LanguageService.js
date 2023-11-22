(function () {
    'use strict';

    angular.module('app.core').factory('LanguageService', LanguageService);

    /* @ngInject */
    function LanguageService($http, $translate, ContextProvider) {
        var service = {
            getAvailableLanguages: getAvailableLanguages,
            updateLanguage: updateLanguage,
            checkAlignmentBasedOnLanguage: checkAlignmentBasedOnLanguage,
            changeLanguage: changeLanguage
        };
        return service;

        function changeLanguage(pars) {
            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/ChangeLanguageAction', pars)
                .then(function (response) {
                    return response.data;
                }).catch(function (msg) {

                });
        }

        function getAvailableLanguages() {
            return $http.post(ContextProvider.getContext() + '/screen/AjaxScreen/action/GetAvailableLanguagesAction')
                .then(function (response) {
                    return response.data;
                }).catch(function (msg) {

                });
        }

        function checkAlignmentBasedOnLanguage(langKey) {
            var rtlLangKeys = ['ar','dv','fa','ha','he','iw','ji','ps','ur','yi'];
             var ionSlidesArray = angular.element('ion-slide');
            if(rtlLangKeys.indexOf(langKey) === -1)
        	{
            	angular.element(document.querySelector("[ui-view]"))[0].style.direction = "ltr";
            	if(ionSlidesArray.length > 0)
        		{
            		angular.forEach(ionSlidesArray,function(value,key){
            			value.style.direction = "ltr";
            		});
        		}	
        	}
            else
        	{
            	angular.element(document.querySelector("[ui-view]"))[0].style.direction = "rtl";
            	if(ionSlidesArray.length > 0)
        		{
            		angular.forEach(ionSlidesArray,function(value,key){
            			value.style.direction = "rtl";
            		});
        		}	
        	}
        }

        function updateLanguage(langKey) {
            $translate.use(langKey);
            checkAlignmentBasedOnLanguage(langKey);
        }
    }
})();