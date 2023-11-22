(function () {
    'use strict';
    angular.module('app.logout').
    controller('LogoutController', LogoutController);

    /* @ngInject */
    function LogoutController(AuthService, $state,$translate, Language, Session) {
        var vm = this;
        vm.commonToken= Session.getCommonToken();
        vm.logout = function () {
            AuthService.logout({commonToken:vm.commonToken}).then(function (result) {
                $state.go('relogin');
                var msg = Language.getLocaleValue('LOGOUT_SUCCESS');                
            });
        };
    }
})();