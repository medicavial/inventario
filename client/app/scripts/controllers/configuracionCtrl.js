(function(){


	'use strict';

	angular
	.module('app')
	.controller('configuracionCtrl',configuracionCtrl)

	configuracionCtrl.$inject = ['$rootScope','$mdDialog','busqueda','operacion', 'mensajes', 'datos'];

	function configuracionCtrl($rootScope,$mdDialog,busqueda,operacion, mensajes, datos){

		// console.log(datos);
		var scope = this;

		$rootScope.titulo = 'Configuración';
		$rootScope.cargando = false;

		$rootScope.tema = 'theme1';

		scope.guardando = false;
		scope.consultando = false;
		scope.consultaUnidad = false;
		scope.unidades = datos.data;
		scope.edicion = true;
		scope.correos = [];
		scope.itemSeleccionado = '';

		scope.datos = {
			minimo : 0,
			compra : 0,
			maxima : 0,
			unidad : '',
			item   : ''
		}


		scope.inicio = function(){

			scope.datos.compra = 0;
			scope.datos.minimo = 0;
			scope.datos.maxima = 0;
			scope.id = '';
			scope.minimo = 0;
			scope.compra = 0;
			scope.existe = false;

		}

		scope.verificaUnidad = function(unidad){

			if (unidad) {

				scope.items = [];
				scope.consultaUnidad = true;
				busqueda.configuracion(unidad).success(function (data){

					if (data.length > 0) {
						scope.edicion = true;
						scope.items = data;
					}else{
						mensajes.alerta('Esta Unidad no tiene items en stock','','top right','info_outline');
					}
					scope.consultaUnidad = false;

				});
				
			};
		}

		scope.verDetalle = function(item){


			if(item){
				
				scope.inicio();
				scope.consultando = true;
				// console.log(item);
				// var item = scope.items[index];

				scope.datos.item = item.ITE_clave;
				scope.itemNombre = item.ITE_nombre;

				busqueda.itemUnidad(item.ITE_clave,item.UNI_clave).success(function (data){

					// console.log(data);

					if (data.length > 0) {
						scope.datos.compra = Number(data[0].CON_nivelCompra);
						scope.datos.minimo = Number(data[0].CON_nivelMinimo);
						scope.datos.maxima = Number(data[0].CON_nivelMaximo);
						scope.id = data[0].id;
						scope.existe = true;
					}

					scope.minimo = Number( (scope.datos.minimo * 100)/scope.datos.maxima );
					scope.compra = Number( (scope.datos.compra * 100)/scope.datos.maxima );

					scope.edicion = false;
					scope.consultando = false;

				});
			}

		}

		scope.valida = function(){

			if (scope.datos.compra > 0 && scope.datos.minimo > 0 && scope.datos.maxima > 0) {

				if (scope.datos.minimo > scope.datos.compra || scope.datos.minimo > scope.datos.maximo) {
					return true;
				}else if(scope.datos.compra > scope.datos.maxima){
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		}

		scope.verificaMinimo = function(minimo){
			scope.datos.minimo = Number( (minimo * scope.datos.maxima)/100 );
			$rootScope.$apply();
		}

		scope.verificaCompra = function(compra){
			scope.datos.compra = Number( (compra * scope.datos.maxima)/100 );
			$rootScope.$apply();
		}

		scope.guardar = function(){
			scope.guardando = true;
			operacion.altaConfiguracion(scope.datos).success(function (data){
				scope.guardando = false;
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				scope.inicio();
				scope.edicion = true;
			});
		}

		scope.actualizar = function(){
			scope.guardando = true;
			operacion.actualizaConfiguracion(scope.id,scope.datos).success(function (data){
				scope.guardando = false;
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				scope.inicio();
				scope.edicion = true;
			});
		}

	}

})();
