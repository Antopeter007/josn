(function () {
    'use strict';
    angular.module('app.changeLanguage').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.changeLanguage',
                config: {
                    url: '/changeLanguage',
                    views: {
                        'mainContent': {
                            templateUrl: "content/mobile/template/changeLanguage/changeLanguage.html",
                            controller: 'ChangeLanguageController as vm'
                        }
                    }
                }
            }
        ];
    }
})();