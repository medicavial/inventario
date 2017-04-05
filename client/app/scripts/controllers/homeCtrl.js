(function(){

	'use strict';

	angular.module('app')
	.controller('homeCtrl',homeCtrl)

	homeCtrl.$inject = ['$rootScope','$scope','datos','$state','mensajes','busqueda'];

	function homeCtrl($rootScope, $scope, datos, $state, mensajes, busqueda){

		$scope.datos=datos.data;
		$scope.informacion={
			caducados: false,
			apartados: false,
		};

		$scope.cargador=false;

		if ($scope.datos.porCaducar>50) {
			// mensajes.alerta('¡Más de 50 items están por caducar!','error','top right','warning');
			setTimeout(function(){ mensajes.alerta('¡Más de 50 items están por caducar!','error','top right','warning'); }, 3000);
		};

		if ($scope.datos.porSurtir>15) {
			mensajes.alerta('Más de 15 items están reservados para receta','info','top right','info');
			// setTimeout(function(){ mensajes.alerta('¡Más de 10 items están reservados para surtir!','info','top right','info'); }, 3000);
		};


		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Bienvenido';

		$scope.irItems = function() {
			$state.go('index.reporteItems');
		};

		$scope.irOrdenes = function() {
			$state.go('index.ordenescompra');
		};

		$scope.irPorCaducar = function(){
			$state.go('index.porCaducar');
		}

		$scope.irPorSurtir = function(){
			$state.go('index.porSurtir');
		}

	}

})();
