(function(){
	'use strict';
	angular
	.module('app')
	.controller('ajusteLotesCtrl',ajusteLotesCtrl)

	ajusteLotesCtrl.$inject = ['$rootScope','busqueda','mensajes','datos','reportes', '$mdBottomSheet', '$state'];

	function ajusteLotesCtrl($rootScope,busqueda,mensajes,datos,reportes, $mdBottomSheet, $state){

		if ( $rootScope.permisos.PER_clave === 1 ) {
			// console.log($rootScope.permisos);
			console.log('Permitido');
		} else {
			console.log('Prohibido');
			$state.go('index.home')
		}

		var scope = this;
		$rootScope.tema = 'theme7';
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
			scope.tiposItem = datos[2].data;
			scope.almacenes = [];
			scope.datos = {
				unidad:'',
				almacen:'',
				item:'',
				tipo:'',
				permiso: $rootScope.permisos.PER_clave,
				verCeros: false,
			}
			console.log(scope.datos);
		}


		scope.agregaUnidad = function(unidad){
			scope.unidadB = ' ' + unidad;
		}

		scope.agregaAlmacen = function(almacen){
			scope.almacenB = ' /' + almacen;
		}

		scope.agregaItem = function(item){
			scope.itemB = ' /' + item;
		}

		scope.cargaAlmacenes = function(unidad){

			busqueda.almacenesUnidad(unidad).success(function (data){
					console.log(data);
					scope.almacenes = data;
			});
		};

		scope.cargaItems = function(almacen){
			busqueda.itemsAlmacen(almacen).success(function (data){
				scope.items = data;
			});
		};

		scope.buscar = function(){


			if (scope.datos.unidad) {

				console.log(scope.datos);

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
				mensajes.alerta('debes ingresar unidad y tipo','error','top right','error');
			}
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
