(function(){

	'use strict';
	
	angular.module('app')
	.controller('loginCtrl',loginCtrl)

	loginCtrl.$inject = ['auth','$rootScope'];

	function loginCtrl(auth, $rootScope){

		var sesion = this;
		$rootScope.cargando = false;
		$rootScope.tema = 'theme1';

		sesion.inicio = function(){
			sesion.datos = {
				usuario:'',
				psw:'',
				guardar:false
			}
		}

		sesion.login = function(){
			if (sesion.loginForm.$valid) {
				$rootScope.cargando = true;
				auth.login(sesion.datos);
			};
		}

	}

})();