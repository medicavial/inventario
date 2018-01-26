(function(){
	'use strict';
	angular
	.module('app')
	.controller('ajusteLotesCtrl',ajusteLotesCtrl)

	ajusteLotesCtrl.$inject = ['$rootScope','$scope','busqueda','mensajes','datos','reportes', '$mdBottomSheet', '$state', '$mdDialog', 'operacion'];

	function ajusteLotesCtrl($rootScope, $scope, busqueda,mensajes,datos,reportes, $mdBottomSheet, $state, $mdDialog, operacion){

		if ( $rootScope.permisos.PER_clave === 1 || $rootScope.permisos.PER_clave === 2 ) {
			// console.log($rootScope.permisos);
			console.info('Permitido');
		} else {
			console.error('Prohibido');
			$state.go('index.home');
		}

		var scope = this;
		$rootScope.tema = 'purple';
		$rootScope.titulo = 'Ajuste de lotes';
		scope.unidades = datos[0].data;
		scope.total = 0;
		scope.limit = 10;
		scope.page = 1;
		scope.busqueda = '';

		scope.texto = {
	      text: 'Resultados por pagina:',
	      of: 'de'
	    };
		scope.paginacion = [10,20,30,40];

		scope.inicio = function(){
			scope.nuevaBusqueda = true;
			scope.consultando = false;
			scope.items = datos[1].data;
			// scope.tiposItem = datos[2].data;
			scope.almacenes = [];
			scope.datos = {
				unidad:'',
				almacen:'',
				item:'',
				tipo:'',
				permiso: $rootScope.permisos.PER_clave,
				verCeros: true,
				lote: ''
			}
		}

		$rootScope.buscaNuevamente = function(){
			scope.buscar();
		};

		scope.agregaUnidad = function(unidad){
			scope.unidadB = ' ' + unidad;
		}

		scope.agregaAlmacen = function(almacen){
			scope.almacenB = ' /' + almacen;
		}

		scope.agregaItem = function(item){
			scope.itemB = ' /' + item;
		}

		scope.agregaLote = function(lote){
			scope.loteB = ' / Lote: ' + lote.toUpperCase();
		}

		scope.cargaAlmacenes = function(unidad){
			busqueda.almacenesUnidad(unidad).success(function (data){
					// console.log(data);
					scope.almacenes = data;
			});
		};

		scope.cargaItems = function(almacen){
			busqueda.itemsAlmacen(almacen).success(function (data){
				scope.items = data;
			});
		};

		scope.buscar = function(){
			if (scope.datos.unidad && scope.datos.almacen && scope.datos.item) {
				// console.log(scope.datos);
				scope.consultando = true;
				scope.unidadB = scope.datos.unidad ? scope.unidadB : '';
				scope.almacenB = scope.datos.almacen ? scope.almacenB : '';
				scope.itemB = scope.datos.item ? scope.itemB : '';

				reportes.lotes(scope.datos).success(function (data){

					scope.consultando = false;
					scope.info = data;

					if (data.length > 0) {
						scope.nuevaBusqueda = false;
					}else{
						mensajes.alerta('No se encontro información disponible','error','top right','error');
					}
				}).error(function (error){
					scope.info = [];
					scope.consultando = false;
					mensajes.alerta('Ocurrio un error vuelva a intentarlo','error','top right','error');
				})

			}else{
				mensajes.alerta('Es necesario llenar todos los datos','warning','top right','info');
			}
		}

		scope.detalleLote = function( lote ) {
			lote.LOT_cantidad = parseInt(lote.LOT_cantidad);
			lote.EXI_cantidad = parseInt(lote.EXI_cantidad);

			$mdDialog.show({
				controller: revisionLotesCtrl,
				templateUrl: 'views/detalleLote.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				escapeToClose: false,
				locals:{datos: lote},
			});
		};

		function revisionLotesCtrl ($scope, datos, $mdDialog, operacion ) {
				$scope.trabajando = false;
		    $scope.loteEditor = datos;
				$scope.loteEditor.LOT_cantidadOriginal = datos.LOT_cantidad;
				$scope.loteEditor.LOT_caducidad = datos.LOT_caducidad.substr(0, 7);
				$scope.loteEditor.LOT_caducidadOriginal = datos.LOT_caducidad.substr(0, 7);

				$scope.guardaCambios = function(){

					if ( $scope.loteEditor.LOT_cantidad == $scope.loteEditor.LOT_cantidadOriginal
							 && $scope.loteEditor.LOT_caducidad == $scope.loteEditor.LOT_caducidadOriginal ) {
								 	mensajes.alerta('No hay cambios','warning','top right','warning');
					} else{
							$scope.trabajando = true;
							$scope.loteEditor.USU_clave = $rootScope.id;
							console.log($scope.loteEditor);
							mensajes.alerta('Procesando cambios','info','top right','info');

							operacion.ajusteLote( $scope.loteEditor ).success(function (data){
								$scope.trabajando = false;
								mensajes.alerta('Datos procesados','success','top right','check_circle');
								console.log(data);
								$rootScope.buscaNuevamente();
								$scope.cerrarDialogo();
							}).error(function (error){
								scope.info = [];
								$scope.trabajando = false;
								mensajes.alerta('Ocurrio un error vuelva a intentarlo','error','top right','error');
							})
					}
				};

				$scope.cerrarDialogo = function (){
					$mdDialog.hide();
					$scope.loteEditor={};
				};
		}

		scope.opciones = function() {
			$mdBottomSheet.show({
				templateUrl: 'views/opcionesReporte.html',
				controller: 'opcionesCtrl',
				clickOutsideToClose: true
			}).then(function(accion) {
					console.log(accion);
				if (accion.name == 'Nuevo') {
					scope.inicio();
				}else if (accion.name == 'Editar'){
					scope.nuevaBusqueda = true;
				}else if (accion.name == 'Exp. Excel'){
					mensajes.alerta('Preparando Exportación','info','top right','wb_cloudy');
					reportes.exportar('lotes',scope.datos);
				}else if (accion.name == 'Exp. PDF'){
					mensajes.alerta('Preparando Exportación','info','top right','wb_cloudy');
					reportes.exportarPDF('lotes',scope.datos);
				}
			});
		};

	}

})();
