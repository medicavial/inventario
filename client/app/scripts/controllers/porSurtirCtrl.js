(function(){

	'use strict';

	angular.module('app')
	.controller('porSurtirCtrl',porSurtirCtrl)

	porSurtirCtrl.$inject = ['$rootScope','$scope','busqueda','datos','proveedores','segundaprueba','mensajes', 'operacion', '$state'];

	function porSurtirCtrl($rootScope,$scope,busqueda,datos,proveedores, segundaprueba, mensajes, operacion, $state){

		var porSurtir = this;

		$rootScope.tema = 'theme4';
		$rootScope.titulo = 'Items por surtir';

		$scope.trabajando = false;

		porSurtir.listado=datos.data;
		porSurtir.total=0;
		porSurtir.limit=10;
		porSurtir.page=1;
		porSurtir.texto={
			text:'Items por página:',
			of: 'de'
		};
		porSurtir.paginacion=[10,20,30,40];

		if (porSurtir.listado.length > 15) {
			mensajes.alerta('Más de 15 items están reservados para receta','info','top right','info');
		};

		porSurtir.onOrderChange = function (order) {
			// console.log(scope.query);
		};

		$scope.actualizaPorSurtir = function(){
			console.info('actualiza');
			$scope.trabajando = true;
			operacion.eliminaReservasAntiguas().success(function (data){
					console.log(data);
					$scope.trabajando = false;
					$state.reload();
			});
		}
	}

})();
