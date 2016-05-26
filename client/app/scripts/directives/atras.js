(function(){

	'use strict';
	
	angular
	.module('app')
	.directive('backButton', ['$window', function($window) {
	    return {
	        restrict: 'A',
	        link: function (scope, elem) {
	            elem.bind('click', function () {
	                $window.history.back();
	            });
	        }
	    };
	}]);

})();