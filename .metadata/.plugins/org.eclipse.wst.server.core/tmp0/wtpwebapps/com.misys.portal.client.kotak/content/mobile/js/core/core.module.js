(function () {
    'use strict';

    var core = angular
        .module('app.core', [
            'ngAnimate', 'ngSanitize', 'blocks.router', 'blocks.context', 'blocks.modal','blocks.encryption',
            'ui.router', 'ionic', 'ngMessages', 'tmh.dynamicLocale', 'pascalprecht.translate', 'blocks.Language','chart.js'
        ]);
    /* @ngInject */
    core.run(function ($rootScope, $transitions, AuthService, ModalService , $state, Session , LanguageService, $translate , $timeout, DeepLinkService) {


        $transitions.onStart({}, function(transition, toState, toParams, fromState, fromParams ) {
            // Sync the session with the server
        	Session.setFromState(transition.from().name);
            AuthService.syncSession();
            if (AuthService.isAuthenticated()) {
                if (angular.isDefined(transition.to().isLogin) && transition.to().isLogin) {
                    $state.go('app.home');
                }
            } else if (!angular.isDefined(transition.to().isLogin) || (Session.getMode() && Session.getMode() !== "")) {
                DeepLinkService.setDeepLinkState(transition.to());
                DeepLinkService.setDeepLinkParams(transition.params('to'));
                $state.go('login');
            }
            if (ModalService.getModal() && ModalService.getModal() !== null) {
                //If the current slide index doesn't equal 0, 
                //we'll let the slides go back
            	var modalObject =  ModalService.getModal();
            	if(modalObject && modalObject.viewType && modalObject.viewType === "modal")
        		{
            		modalObject.hide();
        		}
            	else
        		{
            		modalObject.close();
        		}
                ModalService.setModal(null);
                $state.go(transition.from().name);
            }
            if (ModalService.getCurrencyModal() && ModalService.getCurrencyModal() !== null) {
                //If the current slide index doesn't equal 0, 
                //we'll let the slides go back
            	var currencyModelObject =  ModalService.getCurrencyModal();
            	if(currencyModelObject && currencyModelObject.viewType && currencyModelObject.viewType === "modal")
        		{
            		currencyModelObject.hide();
        		}
            	else
        		{
            		currencyModelObject.close();
        		}
                ModalService.setCurrencyModal(null);
                $state.go(transition.from().name);
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            // Sync the session with the server
        	Session.setFromState(fromState.name);
            AuthService.syncSession();
            if (AuthService.isAuthenticated()) {
                if (angular.isDefined(toState.isLogin) && toState.isLogin) {
                    event.preventDefault();
                    $state.go('app.home');
                }
            } else if (!angular.isDefined(toState.isLogin) || (Session.getMode() && Session.getMode() !== "")) {
                DeepLinkService.setDeepLinkState(toState);
                DeepLinkService.setDeepLinkParams(toParams);
                event.preventDefault();
                $state.go('login');
            }
            if (ModalService.getModal() && ModalService.getModal() !== null) {
                //If the current slide index doesn't equal 0, 
                //we'll let the slides go back
            	var modalObject =  ModalService.getModal();
            	if(modalObject && modalObject.viewType && modalObject.viewType === "modal")
        		{
            		modalObject.hide();
        		}
            	else
        		{
            		modalObject.close();
        		}
                ModalService.setModal(null);
                event.preventDefault();
                $state.go(fromState.name);
            }
            if (ModalService.getCurrencyModal() && ModalService.getCurrencyModal() !== null) {
                //If the current slide index doesn't equal 0, 
                //we'll let the slides go back
            	var currencyModelObject =  ModalService.getCurrencyModal();
            	if(currencyModelObject && currencyModelObject.viewType && currencyModelObject.viewType === "modal")
        		{
            		currencyModelObject.hide();
        		}
            	else
        		{
            		currencyModelObject.close();
        		}
                ModalService.setCurrencyModal(null);
                event.preventDefault();
                $state.go(fromState.name);
            }
        });
        
        $rootScope.$on('$stateChangeSuccess', 
        		function(event, toState, toParams, fromState, fromParams) { 
        	
        			if((fromState.name === "app.changeLanguage" || fromState.name === "login")  && toState.name === "app.home")
    				{
        				 $timeout( function() {
        					 LanguageService.checkAlignmentBasedOnLanguage($translate.use());
        			       }, 50);
        				
    				}
        });
        		
    });

})();