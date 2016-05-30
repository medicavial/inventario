(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('reporteExistenciasCtrl',reporteExistenciasCtrl)


	reporteExistenciasCtrl.$inject = ['$rootScope','busqueda','mensajes','datos','reportes', '$mdBottomSheet'];

	function reporteExistenciasCtrl($rootScope,busqueda,mensajes,datos,reportes, $mdBottomSheet){

		var scope = this;
		$rootScope.tema = 'theme4';
		$rootScope.titulo = 'Existencias';
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
			scope.almacenes = [];
			scope.datos = {
				unidad:'',
				almacen:'',
				item:''
			}
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

			scope.consultando = true;
			scope.unidadB = scope.datos.unidad ? scope.unidadB : '';
			scope.almacenB = scope.datos.almacen ? scope.almacenB : '';
			scope.itemB = scope.datos.item ? scope.itemB : '';

			reportes.existencias(scope.datos).success(function (data){
				scope.consultando = false;
				scope.info = data;
				scope.nuevaBusqueda = false;
			}).error(function (error){
				scope.info = [];
			})
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
					reportes.exportar('existencias',scope.datos);
				}else if (accion.name == 'Exp. PDF'){
					mensajes.alerta('Preparando Exportación','info','top right','wb_cloudy');
					reportes.exportarPDF('existencias',scope.datos);
				}
			});
		};

	}

})();