(function () {
    'use strict';

    var core = angular.module('app.core');

    //Toaster Config for messages.
    core.config(toastrConfig);
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-top-center';
    }

    //Other configuration
    core.config(configure);
    /* @ngInject */
    function configure($logProvider, routerHelperProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        /*exceptionHandlerProvider.configure(config.appErrorPrefix);*/
        routerHelperProvider.configure({
            docTitle: '' + ': '
        });
    }

    //Configuration for l10n/i18n Translate using angular-translate
    core.config(configureLocalization);
    /* @ngInject */
    function configureLocalization($translateProvider, LanguageProvider) {
        $translateProvider.useStaticFilesLoader({
            	
            	files: [{
                    prefix: 'content/mobile/localization/misys_i18n_',
                    suffix: '.json'
                }, {
                    prefix: 'content/mobile/localization/misys_i18n_client_',
                    suffix: '.json'
                }]
        });
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.determinePreferredLanguage(LanguageProvider.$get().getPreferredLanguage);
        $translateProvider.fallbackLanguage(default_language ? default_language.innerHTML : 'en');
    }

    core.config(configureInterceptor);
    /* @ngInject */
    function configureInterceptor($httpProvider) {
        // Configure $http to catch authentication error responses
        $httpProvider.interceptors.push(['$injector', function ($injector) {
            return $injector.get('AuthInterceptorService');
        }]);
    }
})();