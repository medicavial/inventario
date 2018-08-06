(function(){

	'use strict';

	angular
	.module('app')
	.controller('reporteItemsCtrl',reporteItemsCtrl)


	reporteItemsCtrl.$inject = ['$rootScope','busqueda','mensajes','reportes', '$mdBottomSheet'];

	function reporteItemsCtrl($rootScope,busqueda,mensajes,reportes, $mdBottomSheet){
		var scope = this;
		$rootScope.tema = 'theme4';
		$rootScope.titulo = 'Reporte de Items';

		scope.total = 0;
		scope.limit = 40;
		scope.page = 1;
		scope.busqueda = '';


		scope.texto = {
	      text: 'Resultados por pagina:',
	      of: 'de'
	    };
		scope.paginacion = [10,20,30,40,50,60];

		scope.inicio = function(){
			scope.buscar();
		}


		scope.buscar = function(){

			mensajes.alerta('Consultando Información','info','top right','search');

			reportes.items().success(function (data){

				scope.consultando = false;

				if (data.length > 0) {
					scope.info = data;

				}else{
					mensajes.alerta('No se encontro información disponible','error','top right','error');
				}
			}).error(function (error){
				scope.info = [];
				scope.consultando = false;
				mensajes.alerta('Ocurrio un error vuelva a intentarlo','error','top right','error');
			})

		}

		scope.exportar = function() {

			mensajes.alerta('Preparando Exportación','info','top right','wb_cloudy');
			reportes.exportar('items',scope.datos);

		};

	}

})();
