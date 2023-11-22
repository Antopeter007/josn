(function () {

    'use strict';
    angular.module('app.core').

    factory('AuthInterceptorService', AuthInterceptorService);

    /* @ngInject */
    function AuthInterceptorService($q, $injector, toastr) {

        return {
            // This is the responseError interceptor
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    // Return a new promise
                    $injector.get('$state').go('login');
                    toastr.error(rejection.data.message);
                } else if (rejection.status === 417 ||
                    (rejection.status === undefined)) {
                    var state = $injector.get('$state');
                    if (state && state.includes("app")) {
                    	if(rejection && rejection.data && rejection.data.message) { 
                    		$injector.get('$state').go("app.error", { errorMessage: rejection.data.message});
                    	} else {
                    		$injector.get('$state').go("app.error");
                    	}
                    	
                    }
                }

                /* If not a 401, do nothing with this error.
                 * This is necessary to make a `responseError`
                 * interceptor a no-op. */
                return $q.reject(rejection);
            }
        };
    }

})();