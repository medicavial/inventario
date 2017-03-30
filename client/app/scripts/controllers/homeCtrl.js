(function(){

	'use strict';

	angular.module('app')
	.controller('homeCtrl',homeCtrl)

	homeCtrl.$inject = ['$rootScope','$scope','datos','$state','mensajes'];

	function homeCtrl($rootScope, $scope, datos, $state, mensajes){

		$scope.datos=datos.data;

		if ($scope.datos.porCaducar>50) {
			mensajes.alerta('¡Más de 50 items están por caducar!','error','top right','warning');
		};

		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Bienvenido';

		$scope.irItems = function() {
			$state.go('index.reporteItems');
		};

		$scope.irOrdenes = function() {
			$state.go('index.ordenescompra');
		};

	}

})();
