var myApp = angular.module("app.login");

myApp.directive('capitalize', function() {
   return {
     restrict: 'A',
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
        	if (!inputValue)
        	{
        		return;
        	}
        	
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         };
         modelCtrl.$parsers.unshift(capitalize);
     }
   };
});