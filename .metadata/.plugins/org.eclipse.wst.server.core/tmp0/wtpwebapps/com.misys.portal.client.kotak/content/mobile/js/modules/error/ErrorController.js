(function() {
    'use strict';

    angular
        .module('app.error')
        .controller('ErrorController', ErrorController)

    /* @ngInject */
    function ErrorController(AuthService,$state,toastr,$translate,$stateParams) {
        var vm = this;
        vm.errorMessage = $stateParams.errorMessage; 
        vm.logout = function()
        {
            AuthService.logout().then(function(result){
                $state.go('app.logout');
            });
        };        
    }
})();