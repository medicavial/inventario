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
			scope.datos = {
				unidad:'',
				item:'',
				tipo:'',
				fechaini:'',
				fechafin:'',
				acceso:'',
				estatus:''
			}
		}

		scope.buscar = function(){

			if(scope.datos.unidad){
				scope.consultando = true;
				scope.datos.acceso = '';

				reportes.ordenes(scope.datos).success(function (data){
					if (data.length > 0) {
						scope.info = data;
						scope.nuevaBusqueda = false;
					}else{
						mensajes.alerta('No se encontro información disponible','error','top right','error');
					}
					scope.consultando = false;
				}).error(function (error){
					scope.info = [];
					scope.consultando = false;
					mensajes.alerta('Ocurrio un error vuelva a intentarlo','error','top right','error');

				})

			}else{
				mensajes.alerta('debes ingresar unidad','error','top right','error');
			}
		}

		scope.surtidos = function(){
			if(scope.datos.unidad){
				scope.datos.acceso = 'surtidos';
				scope.consultando = true;

				reportes.ordenes(scope.datos).success(function (data){

					console.log(data);
					if (data.length > 0) {
						scope.info = data;
						scope.nuevaBusqueda = false;
					}else{
						mensajes.alerta('No se encontro información disponible','error','top right','error');
					}
					scope.consultando = false;
				}).error(function (error){
					scope.info = [];
					scope.consultando = false;
					mensajes.alerta('Ocurrio un error vuelva a intentarlo','error','top right','error');
				})

			}else{
				mensajes.alerta('debes ingresar unidad','error','top right','error');
			}
		}

		scope.registrados = function(){
			if(scope.datos.unidad){
				scope.datos.acceso = 'registrados';
				scope.consultando = true;

				reportes.ordenes(scope.datos).success(function (data){
					if (data.length > 0) {
						scope.info = data;
						scope.nuevaBusqueda = false;
					}else{
						mensajes.alerta('No se encontro información disponible','error','top right','error');
					}
					scope.consultando = false;
				}).error(function (error){
					scope.info = [];
					scope.consultando = false;
					mensajes.alerta('Ocurrio un error vuelva a intentarlo','error','top right','error');
				})

			}else{
				mensajes.alerta('debes ingresar unidad','error','top right','error');
			}
		}

		scope.cancelados = function(){
			if(scope.datos.unidad){
				scope.datos.acceso = 'cancelados';
				scope.consultando = true;

				reportes.ordenes(scope.datos).success(function (data){
					if (data.length > 0) {
						scope.info = data;
						scope.nuevaBusqueda = false;
					}else{
						mensajes.alerta('No se encontro información disponible','error','top right','error');
					}
					scope.consultando = false;
				}).error(function (error){
					scope.info = [];
					scope.consultando = false;
					mensajes.alerta('Ocurrio un error vuelva a intentarlo','error','top right','error');
				})

			}	else{
				mensajes.alerta('debes ingresar unidad','error','top right','error');
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
					reportes.exportar('ordenes',scope.datos);
				}else if (accion.name == 'Exp. PDF'){
					mensajes.alerta('Preparando Exportación','info','top right','wb_cloudy');
					reportes.exportarPDF('ordenes',scope.datos);
				}
			});
		};

		
	}

})();