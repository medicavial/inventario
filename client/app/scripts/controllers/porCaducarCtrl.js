(function(){

	'use strict';

	angular.module('app')
	.controller('porCaducarCtrl',porCaducarCtrl)

	porCaducarCtrl.$inject = ['$rootScope','$scope','busqueda','datos','proveedores','segundaprueba','mensajes'];

	function porCaducarCtrl($rootScope,$scope,busqueda,datos,proveedores, segundaprueba, mensajes){

		var porCaducar = this;

		$rootScope.tema = 'theme4';
		$rootScope.titulo = 'Items por caducar';

		porCaducar.listado=datos.data;
		porCaducar.total=0;
		porCaducar.limit=10;
		porCaducar.page=1;
		porCaducar.texto={
			text:'Items por página:',
			of: 'de'
		};
		porCaducar.paginacion=[10,20,30,40];

		if (porCaducar.listado.length > 50) {
			mensajes.alerta('¡Más de 50 items están por caducar!','error','top right','warning');
		}

		porCaducar.onOrderChange = function (order) {
			// console.log(scope.query);
		};

	}

})();