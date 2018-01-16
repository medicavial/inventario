(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('reporteMovimientosCtrl',reporteMovimientosCtrl)


	reporteMovimientosCtrl.$inject = ['$rootScope','busqueda','mensajes','datos','reportes', '$mdBottomSheet'];

	function reporteMovimientosCtrl($rootScope,busqueda,mensajes,datos,reportes, $mdBottomSheet){

		var scope = this;
		$rootScope.tema = 'theme4';
		$rootScope.titulo = 'Movimientos';
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
				fechaInicio: null,
				fechaFinal: null,
			}
			scope.fechaInicio=null;
			scope.fechaFinal=null;
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

		scope.cambio = function(){
			console.log(scope.datos);

			var d = new Date(scope.fechaInicio),
			        month = '' + (d.getMonth() + 1),
			        day = '' + d.getDate(),
			        year = d.getFullYear();

			    if (month.length < 2) month = '0' + month;
			    if (day.length < 2) day = '0' + day;

			    if (scope.fechaInicio==null) {
			    	scope.datos.fechaInicio
			    } else{
			    	scope.datos.fechaInicio= year+'-'+month+'-'+day+' 00:00:00';
			    };

			var d = new Date(scope.fechaFinal),
			        month = '' + (d.getMonth() + 1),
			        day = '' + d.getDate(),
			        year = d.getFullYear();

			    if (month.length < 2) month = '0' + month;
			    if (day.length < 2) day = '0' + day;

			    if (scope.fechaFinal==null) {
			    	scope.datos.fechaFinal
			    } else{
			    	scope.datos.fechaFinal= year+'-'+month+'-'+day+' 23:59:59';
			    };
		}

		scope.buscar = function(){
			scope.datos.fechaInicio = scope.datos.fechaInicio.substring(0, 10);
			scope.datos.fechaFinal = scope.datos.fechaFinal.substring(0, 10);

			// console.log( scope.datos.fechaInicio, scope.datos.fechaFinal );

			if (scope.datos.fechaInicio==null || scope.datos.fechaFinal==null) {
				mensajes.alerta('Se requiere fecha de inicial y final para generar el reporte','error','top right','error');
			} else{
				// if (scope.datos.unidad) {

					scope.consultando = true;
					scope.unidadB = scope.datos.unidad ? scope.unidadB : '';
					scope.almacenB = scope.datos.almacen ? scope.almacenB : '';
					scope.itemB = scope.datos.item ? scope.itemB : '';

					reportes.movimientos(scope.datos).success(function (data){

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
					
				// }else{
				// 	mensajes.alerta('debes ingresar unidad y tipo','error','top right','error');
				// }
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
					reportes.exportar('movimientos',scope.datos);
				}else if (accion.name == 'Exp. PDF'){
					mensajes.alerta('Preparando Exportación','info','top right','wb_cloudy');
					reportes.exportarPDF('movimientos',scope.datos);
				}
			});
		};

	}

})();