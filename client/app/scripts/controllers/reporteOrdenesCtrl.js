(function(){

	'use strict';
	
	angular.module('app')
	.controller('reporteOrdenesCtrl',reporteOrdenesCtrl)


	reporteOrdenesCtrl.$inject = ['$rootScope','busqueda','mensajes','datos','reportes'];


	function reporteOrdenesCtrl($rootScope,busqueda,mensajes,datos,reportes){

		var scope = this;
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Ordenes de Compra';
		scope.unidades = datos[0].data;
		scope.total = 0;
		scope.limit = 10;
		scope.page = 1;
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
				tipo:'registro',
				fechaini:'',
				fechafin:''
			}
		}

		scope.buscar = function(){
			reportes.ordenes(scope.datos).success(function (data){
				scope.info = data;
				scope.inicio();
			}).error(function (error){
				scope.info = [];
			})
		}

		
	}

})();