(function(){
	'use strict';
	angular
	.module('app')
	.controller('ajusteLotesCtrl',ajusteLotesCtrl)

	ajusteLotesCtrl.$inject = ['$rootScope','$scope','busqueda','mensajes','datos','reportes', '$mdBottomSheet', '$state', '$mdDialog', 'operacion'];

	function ajusteLotesCtrl($rootScope, $scope, busqueda,mensajes,datos,reportes, $mdBottomSheet, $state, $mdDialog, operacion){

		if ( $rootScope.permisos.PER_clave == 1 || $rootScope.permisos.PER_clave == 2 ) {
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

		scope.nombreAlmacen = function( cveAlmacen ){
			for (var i = 0; i < scope.almacenes.length; i++) {
				if ( scope.almacenes[i].ALM_clave == cveAlmacen ) {
					return scope.almacenes[i];
				}
			}
		};

		scope.detallesItem = function( cveItem ){
			for (var i = 0; i < scope.items.length; i++) {
				if ( scope.items[i].ITE_clave == cveItem ) {
					return scope.items[i];
				}
			}
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

		scope.registraLote = function(){
			var datos = {
				ITE_clave: scope.datos.item,
				ALM_clave: scope.datos.almacen,
				EXI_clave: 0,
				EXI_cantidad: 0,
				numLote:'',
				LOT_cantidad:null,
				LOT_caducidad: '',
				cadAnio: '',
				cadMes: '',
				observaciones: '',
				precaucion: false,
				modificaExistencias: false,
				USU_clave: $rootScope.id,
				item: scope.detallesItem( scope.datos.item ),
				almacen: scope.nombreAlmacen( scope.datos.almacen ),
				parametros: scope.datos,
			};

			if ( scope.info.length > 0 ) {
				datos.EXI_cantidad = scope.info[0].EXI_cantidad;
				datos.EXI_clave = scope.info[0].EXI_clave;
			}

			console.log('nuevo');
			$mdDialog.show({
				controller: creacionLoteCtrl,
				templateUrl: 'views/altaLote.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				escapeToClose: false,
				locals:{datos: datos},
			});
		}

		function creacionLoteCtrl ($scope, datos, $mdDialog, operacion ) {
			$scope.trabajando = false;
			$scope.nuevos = datos;
			$scope.fechas = operacion.fechas();

			$scope.guardaAlta = function(){
				// console.log($scope.nuevos);
				operacion.altaLote( $scope.nuevos ).success(function (data){
					$scope.trabajando = false;
					console.log(data);

					if (data.respuesta == 'Registrado') {
						mensajes.alerta('Lote registrado correctamente','success','top right','check_circle');
						$rootScope.buscaNuevamente();
						$scope.cerrarDialogo();
					} else{
						if (data.info) {
							mensajes.alerta(data.info,'warning','top right','warning');
						}
						else{
							mensajes.alerta('No se hicieron cambios','warning','top right','warning');
						}
					}
				}).error(function (error){
					scope.info = [];
					$scope.trabajando = false;
					mensajes.alerta('Ocurrio un error, vuelva a intentarlo','error','top right','error');
					console.log(error);
				})
			}

			$scope.nuevaCaducidad = function (){
				$scope.nuevos.LOT_caducidad = $scope.nuevos.cadAnio+'-'+$scope.nuevos.cadMes;
				console.log($scope.nuevos.LOT_caducidad);
			}

			$scope.cerrarDialogo = function(){
				$scope.nuevos={};
				$rootScope.buscaNuevamente();
				$mdDialog.hide();
			}
		}

		function revisionLotesCtrl ($scope, datos, $mdDialog, operacion ) {
				$scope.trabajando = false;
				$scope.loteEditor = datos;
				$scope.loteEditor.LOT_cantidadOriginal = datos.LOT_cantidad;
				$scope.loteEditor.LOT_caducidad = datos.LOT_caducidad.substr(0, 7);
				$scope.loteEditor.LOT_caducidadOriginal = datos.LOT_caducidad.substr(0, 7);
				$scope.loteEditor.mesNuevo =datos.LOT_caducidad.substr(5, 7);
				$scope.loteEditor.anioNuevo = parseInt(datos.LOT_caducidad.substr(0, 4));
				$scope.loteEditor.LOT_obsAjuste = '';
				$scope.fechas = operacion.fechas();

				$scope.nuevaCaducidad = function (){
					$scope.loteEditor.LOT_caducidad = $scope.loteEditor.anioNuevo+'-'+$scope.loteEditor.mesNuevo;
					console.log($scope.loteEditor.LOT_caducidad);
				}

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
								console.log(data);

								if (data.respuesta == 1) {
									mensajes.alerta('Datos procesados correctamente','success','top right','check_circle');
									$rootScope.buscaNuevamente();
									$scope.cerrarDialogo();
								} else{
									if (data.info) {
										mensajes.alerta(data.info,'warning','top right','warning');
									}
									else{
										mensajes.alerta('No se hicieron cambios','warning','top right','warning');
									}
								}
							}).error(function (error){
								scope.info = [];
								$scope.trabajando = false;
								mensajes.alerta('Ocurrio un error, vuelva a intentarlo','error','top right','error');
								console.log(error);
							})
					}
				};

				$scope.cerrarDialogo = function (){
					$scope.loteEditor={};
					$rootScope.buscaNuevamente();
					$mdDialog.hide();
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
