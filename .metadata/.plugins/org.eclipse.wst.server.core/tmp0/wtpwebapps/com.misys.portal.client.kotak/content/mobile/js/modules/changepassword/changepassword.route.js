(function () {
    'use strict';
    angular.module('app.changepassword').run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app.changePassword',
                config: {
                    url: '/changepassword',
                    cache: false,
                    views: {
                        'mainContent': {
                            templateUrl: 'content/mobile/template/changepassword/change_password.html',
                            controller: 'ChangePasswordController as vm'

                        }
                    }

                }
            }
        ];
    }
})();