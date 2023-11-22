(function () {
    'use strict';

    angular.module('blocks.Language').provider('Language',
        LanguageProvider);

    function LanguageProvider() {
        var self = this;

        self.$get = Language;
        /* @ngInject */
        function Language($filter) {

            var service = {
                getPreferredLanguage: getPreferredLanguage,
                getLocaleValue: getLocaleValue
            };
            return service;

            function getLocaleValue(key) {
                return $filter('translate')(key);
            }

            function getPreferredLanguage() {
                var navLanguage = getBrowserLanguage();
                var language = navLanguage.substring(0, 2);
                var country = navLanguage.substring(3, 5);
                var lang = null;
                if (country && country.length > 0) {
                    lang = language + '_' + country;
                    return lang;
                } else {
                    lang = language;
                    return lang;
                }
            }

            function getBrowserLanguage() {
                var browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
                    i,
                    language;

                for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
                    language = navigator[browserLanguagePropertyKeys[i]];
                    if (language && language.length) {
                        return language;
                    }
                }
                return null;
            }
        }
    }
})();