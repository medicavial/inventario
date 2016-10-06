(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('ordenCompraCtrl',ordenCompraCtrl)
	.controller('ordenesCompraCtrl',ordenesCompraCtrl)
	.controller('correoCtrl',correoCtrl)
	.controller('completaCtrl',completaCtrl)

	ordenesCompraCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','mensajes','$window','api','operacion'];
	ordenCompraCtrl.$inject = ['$scope','$rootScope','operacion','mensajes','datos','pdf','$mdDialog'];
	correoCtrl.$inject = ['$scope','$mdDialog','info','operacion','mensajes'];
	completaCtrl.$inject = ['$scope','$mdDialog','informacion','operacion','mensajes','$rootScope'];


	function ordenesCompraCtrl($rootScope,$mdDialog,datos,busqueda,mensajes,$window,api,operacion){

		var scope = this;
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Ordenes Registrados';
		scope.info = datos.data;
		scope.total = 0;
		scope.limit = 10;
		scope.page = 1;
		scope.texto = {
	      text: 'Movimientos por pagina:',
	      of: 'de'
	    };


		scope.paginacion = [10,20,30,40];

		scope.onPaginationChange = function (page, limit) {
		    // console.log(page);
		    // console.log(limit);
		};

		scope.onOrderChange = function (order) {
			// console.log(scope.query);
		};

		scope.nuevo = function(ev) {

		    $mdDialog.show({
		      controller: ordenCompraCtrl,
		      templateUrl: 'views/ordencompra.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false
		    }).then(function(){
		    	busqueda.ordenescompra().success(function (data){
		    		scope.info = data;
		    	});
		    });
		    
		};

		scope.completar = function(ev,orden) {

			// var orden = scope.info[index];

			// console.log(orden);

		    $mdDialog.show({
				controller: completaCtrl,
				templateUrl: 'views/movimientoorden.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				resolve:{
		            informacion:function(operacion,$q){
		            	
		                var promesa = $q.defer(),
		            		items 	= operacion.verificaFaltantes(orden.OCM_clave);

		            	$q.when(items).then(function (data){
		            		// console.log(data);
		            		var datos = {
		            			items:data.data,
		            			orden:orden
		            		}

		            		promesa.resolve(datos);
		            		// scope.loading = false;
		            	});

		                return promesa.promise;
		            }
				},
				clickOutsideToClose:true
		    }).then(function(){
		    	busqueda.ordenescompra().success(function (data){
		    		scope.info = data;
		    	});
		    });
		    
		};

		scope.cerrar = function(ev,orden) {
		    // Abre ventana de confirmacion

		    // var orden = scope.info[index];

		    var confirm = $mdDialog.confirm()
		          .title('¿Desactivar cerrar la orden?')
		          .content('')
		          .ariaLabel('Cerrar orden')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev)
		          .closeTo({
					bottom: 1500
				   });

		    $mdDialog.show(confirm).then(function() {
		    	// console.log(orden);
		    	var info = {
		    		usuario:$rootScope.id,
		    		orden:orden.OCM_clave
		    	}
		    	
		    	operacion.cerrarOrden(info).success( function (data){
		    		mensajes.alerta(data.respuesta,'success','top right','done_all');
		    		orden.OCM_incompleta = 0;
		    		orden.OCM_cerrada = 1;
		    	})
		    });
		};

		scope.cancelar = function(ev,orden) {
		    // Abre ventana de confirmacion

		    // var orden = scope.info[index];

		    var confirm = $mdDialog.prompt()
		          .title('¿Deseas Cancelar la orden?')
		          .content('')
		          .placeholder('Motivo de cancelación')
      			  .ariaLabel('Motivo de cancelación')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev)
		          .closeTo({
					bottom: 1500
				   });

		    $mdDialog.show(confirm).then(function(motivo) {
		    	// console.log(motivo);
		    	var info = {
		    		usuario:$rootScope.id,
		    		orden:orden.OCM_clave,
		    		motivo:motivo
		    	}
		    	
		    	operacion.cancelarOrden(info).success( function (data){
		    		mensajes.alerta(data.respuesta,'success','top right','done_all');
		    		orden.OCM_cancelada = 1;
		    	})
		    });
		};

		scope.correo = function(orden,ev) {

			var datos = {data:orden};

		    $mdDialog.show({
		      controller: correoCtrl,
		      templateUrl: 'views/correo.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      locals: { info: datos }
		    }).then(function(){
		    	
		    });
		};

	}


	function ordenCompraCtrl($scope,$rootScope,operacion,mensajes,datos,pdf,$mdDialog){

		$scope.paso1 = 'views/ordenPaso1.html';
		$scope.paso2 = 'views/ordenPaso2.html';
		$scope.paso3 = 'views/ordenPaso3.html';
		$scope.paso4 = 'views/ordenPaso4.html';

		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Nueva Orden';
		$scope.unidades = datos.data;
		$scope.consultaUnidad = false;
		$scope.prepara2 = false;
		$scope.generandoTodas = false;

		$scope.inicio = function(){
			
			$scope.step1block = false;
			$scope.step2block = true;
			$scope.step3block = true;
			$scope.step4block = true;
			$scope.todos = true;

			$scope.selectedIndex = 0;
			$scope.unidad = '';

			$scope.respuestasCorreos = [];
			$scope.seleccionItems = [];
			$scope.seleccionOrden = [];
			$scope.ordenItems = [];
			$scope.totalItems = [];
			$scope.proveedores = [];
			$scope.selected = [];
			$scope.items = [];
			$scope.ordenesListas = [];
			$scope.ordenes = [];
		}


		$scope.info = function(unidad){

			if (unidad) {

				// console.log(unidad);
				$scope.selected = [];
				$scope.items = [];
				$scope.almacenes = '';
				$scope.unidad = unidad.UNI_clave;
				$scope.nombreUnidad = unidad.UNI_nombre;
				$scope.consultaUnidad = true;

				operacion.infoUnidad(unidad.UNI_clave).then(
					function (data){

						if (data[1].data.length > 0) {

							$scope.almacenes = data[0].data;
							$scope.items = data[1].data;

							angular.forEach(data[0].data, function(value, key) {
								$scope.selected.push(value);
							});

						}else{
							mensajes.alerta('No hay items en este almacen','info','top right','info');
						}

						$scope.consultaUnidad = false;
					},
					function (error){

						mensajes.alerta(error,'error','top right','error');
						$scope.consultaUnidad = false;
						
					}
				);
				
			};
		};


		$scope.muestraItems = function(datos){

			$scope.consultaUnidad = true;

			operacion.itemsAlmacenes($scope.unidad,datos).success(function (data){
				$scope.items = data;
				$scope.consultaUnidad = false;
			});
		};

		$scope.toggle = function (item, list) {
			var idx = list.indexOf(item);
	        if (idx > -1) list.splice(idx, 1);
	        else list.push(item);
	        $scope.muestraItems(list);
		};

		$scope.exists = function (item, list) {
			return list.indexOf(item) > -1;
		};


		$scope.ir2 = function(selecciones){
			// console.log(selecciones);
			$scope.prepara2 = true;
			operacion.preparaOrden(selecciones).then(function (data){
				// console.log(data);
				if (data.proveedores.length > 0) {
					$scope.ordenItems = data.datos;
					$scope.totalItems = data.info;
					$scope.proveedores = data.proveedores;
					$scope.selectedIndex = 1;
					$scope.step2block = false;
				}else{
					mensajes.alerta('No hay proveedores disponibles para surtir este item agregalos desde conexión','error','top right','error');
				}

				$scope.prepara2 = false;
			});
		}


		$scope.cambio = function (item, list) {
			var id2x = list.indexOf(item);
	        if (id2x > -1){
	        	list.splice(id2x, 1);
	        } else{
	        	list.push(item);
	        }
		};

		$scope.existeEnOrden = function (item, list) {
			return list.indexOf(item) > -1;
		};

		$scope.segmentable = function(item){

			// console.log(item);
			var item = Number(item[0].ITE_segmentable);

			if (item == 1) {
				return true;
			}else{
				return false;
			}
		}

		$scope.caja = function(item){

			return item[0].ITE_cantidadCaja;
		}

		//define la cantidad que se requiere comprar
		$scope.cantidad = function(item){

			for(var i = 0; i < $scope.ordenItems.length; i++){

				var itx = $scope.ordenItems[i];

	            if (itx.ITE_nombre == item) {

	                if (itx.ITE_segmentable == 1) {
	            		var cantidad = Number(itx.porsurtir)/Number(itx.ITE_cantidadCaja);
	            		return cantidad.toFixed();
	            	}else{
	                	return Number(itx.porsurtir);	            		
	            	}            		
	            };

	        }
	        
		}

		$scope.compra = function(item){

			for(var i = 0; i < $scope.ordenItems.length; i++){

				var itx = $scope.ordenItems[i];

	            if (itx.ITE_nombre == item) {
	                return itx.nivelcompra;
	            };

	        }
	        
		}

		$scope.existencia = function(item){

			for(var i = 0; i < $scope.ordenItems.length; i++){

				var itx = $scope.ordenItems[i];

	            if (itx.ITE_nombre == item) {
	                return itx.existencia;
	            };

	        }
	        
		}

		$scope.costoTotal = function(item){
			// console.log(item);
			if (item.ITE_segmentable == 1) {
				return (item.cantidad * item.ITE_cantidadCaja) * item.IPR_ultimoCosto;
			}else{
				return item.cantidad * item.IPR_ultimoCosto;
			}
		}


		$scope.itemProporcional = function(item){
			operacion.proporcionalXitem(item,$scope.ordenItems);
		}


		$scope.itemEconomico = function(item){
			operacion.economicoXitem(item,$scope.ordenItems);
		}

		$scope.verificaCantidad = function(item,proveedor){
			operacion.cambioXproveedor(proveedor,item,$scope.ordenItems);
		}


		$scope.generaOrden = function(){
			$scope.selectedIndex = 2;
			$scope.todos = true;
			$scope.step3block = false;
			operacion.verificaItems($scope.ordenItems).then(function (data){
				$scope.seleccionOrden = data;
			});

		}

		$scope.generaCantidades = function(){

			// console.log($scope.ordenItems);
			// console.log($scope.totalItems);

			operacion.generaCantidades($scope.totalItems).then(function (data){
				$scope.ordenItems = data;
			});
		}

		$scope.generaMasBarato = function(){
			
			operacion.generaMasBarato($scope.totalItems).then(function (data){
				$scope.ordenItems = data;
			});
		}

		$scope.muestraTotal = function(proveedor){
			// console.log(proveedor);
			var total = 0;

			for(var i = 0; i < $scope.seleccionOrden.length; i++){

				var item = $scope.seleccionOrden[i];

	            var cantidad = item.cantidad * item.IPR_ultimoCosto;

	            if (item.PRO_nombrecorto == proveedor) {
	                total += cantidad;
	            };

	        }

	        return total;

		}

		$scope.total = function(){

			var TotalGeneral = 0;

			for(var i = 0; i < $scope.seleccionOrden.length; i++){

				var item = $scope.seleccionOrden[i];
	            var cantidad = item.cantidad * item.IPR_ultimoCosto;
	            TotalGeneral += cantidad;

	        }

	        return TotalGeneral;

		}

		//se generan todas las ordenes aqui 
		$scope.confirmaOrden = function(){

			$scope.generandoTodas = true;
			operacion.generaOrdenes($scope.seleccionOrden,$scope.proveedores,$scope.unidad,$scope.almacenes).then(
				function (data){

					// ya que guardo los datos en base de datos
					// mandamos un correo al proveedor registrado
					angular.forEach(data.ordenes,function (value,key){
						// console.log(value);
						// console.log(key);
						pdf.enviaOrden(value).success(function (data){
							$scope.respuestasCorreos.push(data.respuesta);
						}).error(function (error){
							$scope.respuestasCorreos.push(error.respuesta);
						});

					});

					$scope.ordenes = data.ordenes;
					$scope.selectedIndex = 3;
					$scope.step1block = true;
					$scope.step2block = true;
					$scope.step3block = true;
					$scope.step4block = false;

					$scope.generandoTodas = false;

				},function (error){
					alert(error);
					$scope.generandoTodas = false;
				}
			);

		}

		//se generan las orden de compra por proveedor 
		$scope.confirmaOrdenProveedor = function(proveedor){
			
			$scope.todos = false;

			operacion.ordenXproveedor(proveedor,$scope.unidad,$scope.almacenes,$scope.seleccionOrden).then(
				function (data){
					// console.log(data);
					mensajes.alerta('Orden generada satisfactoriamente','success','top right','done_all');

					var idOrden = data.ordenes[0];
					$scope.ordenes.push(idOrden);
					
					pdf.enviaOrden(idOrden).success(function (data){
						$scope.respuestasCorreos.push(data.respuesta);
					}).error(function (error){
						$scope.respuestasCorreos.push(error.respuesta);
					});

					$scope.step2block = true;
					$scope.step4block = false;

					if ($scope.seleccionOrden.length == 0) {
						$scope.step1block = true;
						$scope.step3block = true;
						$scope.selectedIndex = 3;
					}

				},function (error){
					// mensajes.alerta('Orden generada satisfactoriamente','success','top right','done_all');
					$scope.todos = true;
					alert(error);
				}
			);
		}

		$scope.eliminaOrden = function(proveedor){

			operacion.eliminaOrden(proveedor, $scope.seleccionOrden);
			$scope.todos = false;
		}

		$scope.confirmaIncompleto = function(ev){

			if ($scope.selectedIndex == 2 && $scope.step4block == false) {

			};
		}


		$scope.muestraOrdenes = function(){
			
			operacion.generaDetalleOrdenes($scope.ordenes).then(
				function(data){
					$scope.ordenesListas = data;
				},
				function(error){
					alert(error);
				}
			);
		}

		$scope.generaCorreo = function(ev,index) {

			var orden = $scope.ordenesListas[index];

		    $mdDialog.show({
		      controller: correoCtrl,
		      templateUrl: 'views/correo.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      locals: { info: orden }
		    }).then(function(){
		    	
		    });
		};

	}

	function correoCtrl($scope, $mdDialog, info, operacion, mensajes){

		// console.log(info);
		$scope.inicio = function(){
			$scope.datos = {
				orden:info.data.OCM_clave,
				correo:'',
				copias:[],
				asunto:'',
				comentarios:''
			}
		}

		$scope.enviaCorreo = function(){
			
			operacion.correo($scope.datos).success(function (data){
				$scope.inicio();
				mensajes.alerta(data.respuesta,'success','top right','done_all');
			}).error(function (data){
				mensajes.alerta('No se logro enviar el correo favor de intentarlo nuevamente','error','top right','done_all');
			});

		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};
		
	}


	function completaCtrl($scope, $mdDialog, informacion, operacion, mensajes,$rootScope){

		// console.log(informacion);

		$scope.inicio = function(){
			
			$scope.guardando = false;

			$scope.datos = {
				orden:informacion.orden.OCM_clave,
				unidad:informacion.orden.UNI_clave,
				items:informacion.items,
				usuario:$rootScope.id
			}
		}

		$scope.guardar = function(){

			$scope.guardando = true;
			operacion.completaOrden($scope.datos).success( function (data){
				$scope.guardando = false;
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$mdDialog.hide();
			});

		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};
		
	}

})();