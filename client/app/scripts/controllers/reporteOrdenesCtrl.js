(function(){

	'use strict';
	
	angular.module('app')
	.controller('reporteOrdenesCtrl',reporteOrdenesCtrl)


	reporteOrdenesCtrl.$inject = ['$rootScope','busqueda','mensajes','datos','reportes', '$mdBottomSheet'];


	function reporteOrdenesCtrl($rootScope,busqueda,mensajes,datos,reportes, $mdBottomSheet){

		var scope = this;
		$rootScope.tema = 'theme4';
		$rootScope.titulo = 'Ordenes de Compra';
		scope.unidades = datos[0].data;
		scope.items = datos[1].data;
		scope.total = 0;
		scope.limit = 10;
		scope.page = 1;
		scope.texto = {
	      text: 'Resultados por pagina:',
	      of: 'de'
	    };
		scope.paginacion = [10,20,30,40];

		scope.inicio = function(){

			scope.nuevaBusqueda = true;
			scope.almacenes = [];
			scope.datos = {
				unidad:'',
				item:'',
				tipo:'registro',
				fechaini:'',
				fechafin:'',
				acceso:''
			}
		}

		scope.buscar = function(){

			scope.consultando = true;

			reportes.ordenes(scope.datos).success(function (data){
				scope.info = data;
				scope.nuevaBusqueda = false;
				scope.consultando = false;
			}).error(function (error){
				scope.info = [];
				scope.nuevaBusqueda = false;
				scope.consultando = false
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