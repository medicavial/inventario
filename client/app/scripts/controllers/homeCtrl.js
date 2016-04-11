(function(){

	"use strict"

	angular.module('app')
	.controller('homeCtrl',homeCtrl)

	homeCtrl.$inject = ['$rootScope'];

	function homeCtrl($rootScope){

		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Bienvenido';

	}

})();