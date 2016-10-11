(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('altaMovimientosCtrl',altaMovimientosCtrl)

	
	altaMovimientosCtrl.$inject = ['$rootScope','datos','operacion','mensajes','$q','$filter','busqueda'];



	function altaMovimientosCtrl($rootScope,datos,operacion,mensajes,$q,$filter,busqueda){

		console.log(datos);

		$rootScope.cargando = false;
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Alta de Movimientos';
		
		var scope = this;

		scope.items = datos[0].data;
		scope.tiposmovimiento = datos[1].data;
		scope.almacenes = datos[2].data;
		scope.tiposajuste = datos[3].data;
		scope.bloqueoMov = false;

		// console.log(scope.items);

		scope.agregaMovimiento = function(){

			console.log(scope.datos);

			scope.movimientos.push({
				almacen:scope.datos.almacen.ALM_clave,
				almacenTexto:scope.datos.almacen.ALM_nombre,
				item:scope.item.ITE_clave,
				itemTexto:scope.item.ITE_nombre,
				cantidad:scope.datos.cantidad,
				tipomov:scope.datos.tipomov,
				tipoa:scope.datos.tipoa,
				orden:scope.datos.orden,
				lote:scope.datos.lote,
				idLote:scope.datos.idLote,
				caducidad:scope.datos.caducidad,
				usuario:scope.datos.usuario,
				observaciones:scope.datos.observaciones
			});

		    scope.item = '';
		    scope.datos.item = '';
		    scope.datos.observaciones = '';
		    scope.datos.cantidad = '';
		    scope.busqueda = null;
		    scope.disponible = '';
		    scope.cantidadLote = 0;
			scope.lote = '';
			scope.lotes = [];


		}

		scope.inicio = function(){

			scope.movimientos = [];
			scope.existeLote = false;
			scope.busqueda = null;
		    scope.consultado = consultado;
		    scope.consultaLote = consultaLote;
		    scope.item = '';
		    scope.almacen = '';
		    scope.disponible = '';
		    scope.cantidadLote = 0;
			scope.lote = '';
			scope.lotes = [];

			scope.datos = {
				almacen:'',
				item:'',
				cantidad:'',
				tipomov:'',
				tipoa:'',
				orden:'',
				lote:'',
				idLote:'',
				caducidad:'',
				usuario:$rootScope.id,
				observaciones:''
			}

			scope.guardando = false;
		}

		scope.selectedItemChange= function(){

			console.log(scope.datos.almacen);
			console.log(scope.item);
			if (scope.datos.almacen != '' && scope.item) {
				scope.datos.lote = '';
				scope.datos.idLote = '';
				scope.datos.caducidad = '';
				scope.verificaExistencia(JSON.stringify(scope.datos.almacen));
			};

        };

		scope.mensajeError = function(){
			mensajes.alerta('Ocurrio un error intentalo nuevamente','error','top right','error');
		}

		scope.datosLote = function(lote){

			console.log(lote);

			if (lote) {
				var dato = JSON.parse(lote);

				// console.log(dato);
				scope.datos.idLote = dato.LOT_clave;
				scope.datos.lote = dato.LOT_numero;
				scope.datos.caducidad = moment(dato.LOT_caducidad).toDate();
				scope.cantidadLote = dato.LOT_cantidad;
				scope.existeLote = true;

				scope.verificaCantidadLote();
			};
		}

		scope.verificaLote = function(){
			

			var lote = scope.datos.lote;
				console.log(lote);	
			
			if (lote != '') {
				

				mensajes.alerta('Verificando Lote','info','top right','search');
				busqueda.lote(lote).success(function (data){

					if (data) {
						mensajes.alerta('Lote Existente','success','top right','done');
						scope.datos.idLote = data.LOT_clave;
						scope.datos.caducidad = moment(data.LOT_caducidad).toDate();
						scope.existeLote = true;
					}else{
						mensajes.alerta('Lote No Existente Ingresa Caducidad','error','top right','alert');
					}

				}).error(function (data){
					scope.mensajeError();
				});

			};
		}

		scope.verificaCantidadLote = function(){

			if (scope.item.TIT_forzoso == 1) {

				if (scope.cantidadLote > 0 && scope.cantidadLote < scope.datos.cantidad && scope.datos.tipomov == 3) {
					mensajes.alerta('El lote solo tiene ' + scope.cantidadLote + ' disponible(s)','error','top right','error');
					scope.datos.cantidad = 0;
				}else if (scope.cantidadLote == 0 && scope.datos.cantidad > 0 && scope.datos.idLote != '' && scope.datos.tipomov == 3) {
					mensajes.alerta('Este lote no tiene cantidad disponible','error','top right','error');
				};
			}else{
				if (scope.disponible > 0 && scope.disponible < scope.datos.cantidad && scope.datos.tipomov == 3) {
					mensajes.alerta('Solo se tiene ' + scope.disponible + ' disponible(s)','error','top right','error');
					scope.datos.cantidad = 0;
				}else if (scope.disponible == 0 && scope.datos.cantidad > 0 && scope.datos.idLote != '' && scope.datos.tipomov == 3) {
					mensajes.alerta('No hay cantidad disponible','error','top right','error');
				};
			}
		}


		//verificamos la existencia actual del item en el almacen
		scope.verificaExistencia = function(objAlmacen){

			var almacen = JSON.parse(objAlmacen);

			scope.datos.almacen = almacen;

			if (almacen) {

				scope.lotes = [];


				mensajes.alerta('Verificando Datos de Almacen','info','top right','search');
				//en caso de que el item sea forzoso buscamos los lotes existentes
				if (scope.item.TIT_forzoso == 1) {

					busqueda.lotesAlmacenXitem(almacen.ALM_clave,scope.item.ITE_clave).success(function (data){
						scope.lotes = data;
					});

				};

				busqueda.itemAlmacen(almacen.ALM_clave,scope.item.ITE_clave).success(function (data){
					// console.log(data);
					if (scope.datos.tipomov == 3 && data == '') {
						mensajes.alerta('No hay Cantdad Disponible En Este Almacen Para Salida','error','top right','error');
						scope.disponible = 0;
					}else{
						if (data == '') {
							scope.disponible = 0;
						}else{
							scope.disponible = data.EXI_cantidad;
						}
					}
				}).error(function (data){
					scope.mensajeError();
				});

			};
		}

		scope.guardar = function(){

			console.log(scope.movimientos);

			if (scope.movimientos) {

				// console.log(scope.datos);
				scope.guardando = true;
				operacion.altaMovimientos(scope.movimientos).success(function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					scope.guardando = false;
					scope.movimientoForm.$setPristine();
					scope.inicio();
				}).error(function (data){
					scope.mensajeError();
					scope.guardando = false;
				});

			};
			
		}

		scope.detalleItem = function(item){
			// console.log(item);
		}

		scope.verificaForm = function(){

			if (scope.datos.tipomov == 1 && scope.datos.tipoa == '') {
				return true;
			}else if(scope.datos.tipomov == 3 && scope.disponible < scope.datos.cantidad){
				return true;
			}else if(scope.datos.tipomov == 3 && scope.item.TIT_forzoso == 1 && scope.datos.idLote == ''){
				return true;
			}else if (scope.guardando) {
				return true;
			}else{
				return false;
			}
		}

	    function consultado(query) {

			var q = $q.defer(),
				response = query ? $filter( 'filter' )( scope.items, query ) : scope.items;
				q.resolve( response );

			return q.promise;
	    }

	    function consultaLote(query) {

			var q2 = $q.defer(),
				response2 = query ? $filter( 'filter' )( scope.lotes, query ) : scope.lotes;
				q2.resolve( response2 );

			return q2.promise;
	    }

	}

})();