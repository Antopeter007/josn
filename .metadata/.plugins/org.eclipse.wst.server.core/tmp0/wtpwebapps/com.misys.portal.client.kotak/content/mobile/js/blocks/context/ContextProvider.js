(function () {
    'use strict';

    angular
        .module('blocks.context')
        .provider('ContextProvider', ContextProvider);

    function ContextProvider() {
        var self = this;

        self.$get = Context;

        var context = {
            path: null
        };

        function Context() {

            var contextPath = '';
            if (document.getElementById('context_path')) {
                contextPath = document.getElementById('context_path').innerHTML;
                create(contextPath);
            }
            var service = {
                create: create,
                getContext: getContext
            };
            return service;

            function create(path) {
                context.path = path;
            }

            function getContext() {
                return context.path;
            }
        }
    }
})();