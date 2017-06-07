(function(){

	'use strict';

	angular.module('app')
	.controller('ordenesAbiertasCtrl',ordenesAbiertasCtrl)

	ordenesAbiertasCtrl.$inject = ['$rootScope','$scope','busqueda','datos','reportes','proveedores','segundaprueba','mensajes','$mdDialog'];

	function ordenesAbiertasCtrl($rootScope,$scope,busqueda,datos,reportes,proveedores, segundaprueba, mensajes,$mdDialog){
    	
    	busqueda.unidadesUsuario($rootScope.id).success(function (data){
    		$scope.listaUnidades = data;
    	});

		$rootScope.tema = 'theme4';
		$rootScope.titulo = 'Ordenes de compra abiertas';

		$scope.listado=datos.data;
		$scope.total=0;
		$scope.limit=10;
		$scope.page=1;
		$scope.texto={
			text:'Registros por página:',
			of: 'de'
		};
		$scope.paginacion=[10,20,30,40];

		if ($scope.listado.length > 15) {
			mensajes.alerta('Más de 15 items están reservados para receta','info','top right','info');
		};

		$scope.onOrderChange = function (order) {
			// console.log(scope.query);
		};

		$scope.xUnidad = function (unidad) {
	    	busqueda.consultaOrdenesAbiertas(unidad).success(function (data){
	    		$scope.listado=data;
	    		// console.log(data);
	    	});
		};

		$scope.abreModal = function (id, ev) {
			$rootScope.idOrden = id;

			$mdDialog.show({
				controller: detalleOrdenCtrl,
				templateUrl: 'views/detalleOrden.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false
			})
		};

		$scope.exportaExcel = function () {
			reportes.ordenesAbiertas($rootScope.unidadesAdmin);
		};

	function detalleOrdenCtrl($rootScope,$scope,busqueda,$mdDialog){
    	busqueda.detalleOrdenAbierta($rootScope.idOrden).success(function (data){
    		$scope.detalle = data;
    		// console.log($scope.detalle[0]);
    	});
		$scope.cerrarDialogo = function(){
			$mdDialog.cancel();
		};

	};

	}

})();