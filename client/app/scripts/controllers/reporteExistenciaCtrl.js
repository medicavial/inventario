(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('reporteExistenciasCtrl',reporteExistenciasCtrl)


	reporteExistenciasCtrl.$inject = ['$rootScope','busqueda','mensajes','datos','reportes'];



	function reporteExistenciasCtrl($rootScope,busqueda,mensajes,datos,reportes){

		var scope = this;
		$rootScope.tema = 'theme1';
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

			scope.unidadB = scope.datos.unidad ? scope.unidadB : '';
			scope.almacenB = scope.datos.almacen ? scope.almacenB : '';
			scope.itemB = scope.datos.item ? scope.itemB : '';

			reportes.existencias(scope.datos).success(function (data){
				scope.info = data;
				scope.inicio();
			}).error(function (error){
				scope.info = [];
			})
		}

		
	}

})();