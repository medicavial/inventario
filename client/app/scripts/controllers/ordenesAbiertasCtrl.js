(function(){

	'use strict';

	angular.module('app')
	.controller('ordenesAbiertasCtrl',ordenesAbiertasCtrl)

	ordenesAbiertasCtrl.$inject = ['$rootScope','$scope','busqueda','datos','reportes','proveedores','segundaprueba','mensajes','$mdDialog', 'pdf'];

	function ordenesAbiertasCtrl($rootScope,$scope,busqueda,datos,reportes,proveedores, segundaprueba, mensajes,$mdDialog,pdf){

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

	function detalleOrdenCtrl($rootScope,$scope,operacion,busqueda,$mdDialog, pdf, $state){
		console.log($scope.listado);
    	busqueda.detalleOrdenAbierta($rootScope.idOrden).success(function (data){
    		$scope.detalle = data;
    		console.log($scope.detalle[0]);
				console.log($rootScope.permisos);
				$scope.permiso = $rootScope.permisos;
    	});

			$scope.cerrar = function(ev,orden) {

				console.log('entra cerrar');
					// Abre ventana de confirmacion
					var confirm = $mdDialog.confirm()
								.title('¿Desactivar cerrar la orden?')
								.content('')
								.ariaLabel('Cerrar orden')
								.ok('Si')
								.cancel('No')
								.targetEvent(ev)
								.closeTo({
						bottom: 1500
						 });

					$mdDialog.show(confirm).then(function() {
						// console.log(orden);
						var info = {
							usuario:$rootScope.id,
							orden: orden.OCM_clave
						}

						operacion.cerrarOrden(info).success( function (data){
							mensajes.alerta(data.respuesta,'success','top right','done_all');
							orden.OCM_incompleta = 0;
							orden.OCM_cerrada = 1;
							$state.reload();
						})
					});
			};

			$scope.cancelar = function(ev,orden) {
					// var orden = scope.info[index];
					var confirm = $mdDialog.prompt()
								.title('¿Deseas Cancelar la orden?')
								.content('')
								.placeholder('Motivo de cancelación')
								.ariaLabel('Motivo de cancelación')
								.ok('Si')
								.cancel('No')
								.targetEvent(ev)
								.closeTo({
						bottom: 1500
						 });

					$mdDialog.show(confirm).then(function(motivo) {
						// console.log(motivo);
						var info = {
							usuario:$rootScope.id,
							orden:orden.OCM_clave,
							motivo:motivo
						}

						operacion.cancelarOrden(info).success( function (data){
							mensajes.alerta(data.respuesta,'success','top right','done_all');
							orden.OCM_cancelada = 1;
							$state.reload();
						})
					});
			};

		$scope.cerrarDialogo = function(){
			$mdDialog.cancel();
			$state.reload();
		};

	};

	}

})();
