(function () {
    'use strict';

    angular.module('app.changeLanguage').controller('ChangeLanguageController',
        ChangeLanguageController);

    /* @ngInject */
    function ChangeLanguageController(toastr, $state, LanguageService, Language, Session) {
        /*jshint validthis: true */

        var vm = this;
        var msg = null;

        LanguageService.getAvailableLanguages().then(function (response) {
            vm.availableLanguages = response.languages;
            vm.initValue = response.language.id;
        });

        vm.changeLanguage = function (langKey) {
        	var pars ={};
        	pars.token = Session.getToken();
			pars.language = langKey;        	
            LanguageService.changeLanguage(pars).then(function (result) {
                if (result.status === 1) {
                	$state.go('app.home');
                    LanguageService.updateLanguage(result.userLanguage);
                    vm.initValue = result.userLanguage;
                    msg = Language.getLocaleValue('LANG_CHG_SUCCESS');
                    Session.setLanguageSelected(result.userLanguage);
                    Session.setToken(result.token);
                    //toastr.success(msg);
                } else {
                    msg = Language.getLocaleValue('LANG_CHG_SUCCESS');
                    toastr.success(msg);
                }
            });
        };
    }
})();