(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('recetaCtrl',recetaCtrl)
	.controller('loteRecetaCtrl',loteRecetaCtrl)
	.controller('itemRecetaCtrl',itemRecetaCtrl)

	recetaCtrl.$inject = ['$scope','$rootScope', 'busqueda', 'datos', 'operacion', '$mdDialog', 'mensajes', '$q'];
	loteRecetaCtrl.$inject = ['$scope', '$mdDialog', 'info', 'mensajes','busqueda','informacion']
	itemRecetaCtrl.$inject = ['$scope','$rootScope','$mdDialog','informacion','operacion','mensajes','$q','$filter','busqueda','info'];

	function recetaCtrl($scope, $rootScope, busqueda, datos, operacion, $mdDialog, mensajes, $q){

		var scope = this;
		$rootScope.cargando = false;
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Surtir receta';
		scope.items = datos[1].data;
		scope.tipoItems = datos[0].data;
		scope.surtiendo = false;
		scope.datosReceta = false;
		scope.loading = false;
		scope.itemssurtidos = [];

		console.log(datos);

		scope.inicio = function(){
			scope.receta = '';
			scope.datos = [];
		}

		scope.surtirItem = function(valor){


			console.log(valor);
			if (valor.lotes == undefined && valor.forzoso == 1) {
				mensajes.alerta('Debes ingresar un lote para surtir item','error','top right','error');
			}else{
				scope.surtiendo = true;
				operacion.surtirItem(valor).success(function (data){

					scope.surtiendo = false;
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					valor.surtido = true;

				}).error(function (data){
					scope.surtiendo = false;
					mensajes.alerta('Ocurrio un error de conexion verifica que el item se haya surtido por favor','error','top right','error');
				});
			}
		}

		scope.verificaExistencia = function(item,ev){

			// var item = scope.datos[index];

			console.log(item);

			if (scope.valorAnterior != item.item) {

				item.surtido = true;

				var confirm = $mdDialog.confirm()
		            .title('Cambio de Item')
		            .content('¿Seguro que quieres cambiar de item puede que la existencia cambie?')
		            .ariaLabel('Confirmación')
		            .targetEvent(ev)
		            .ok('SI')
		            .cancel('NO');
		        $mdDialog.show(confirm).then(function() {
		            
		            mensajes.alerta('Verificando Existencia','','top right','search');
		            operacion.cambiaItem(item).then(
	            	function (data){
	            		mensajes.alerta('Existencia disponible','success','top right','done_all');
	            		item.existencia = data.EXI_clave;
	            		item.surtido = false;
	            	},function (error){
	            		mensajes.alerta(error,'error','top right','error');
	            		item.item = scope.valorAnterior;
	            		item.surtido = false;
	            	})
		        	

		        }, function() {
		            item.item = scope.valorAnterior;
		        });

			};
		}


		scope.ingresaLote = function(item,ev) {
			console.log(item);
		    $mdDialog.show({
		      	controller: loteRecetaCtrl,
		      	templateUrl: 'views/loteReceta.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	locals: { info: item },
		      	resolve:{
					informacion:function(busqueda){
						return busqueda.lotesAlmacenXitem(item.almacen,item.item);
					}
				},
		      	clickOutsideToClose:false
		    }).then(function(lotes){
		    	item.lotes = lotes;
		    });
		};

		scope.ingresaItem = function(ev) {

			var item = scope.datos.items[0];

		    $mdDialog.show({
				controller: itemRecetaCtrl,
				templateUrl: 'views/itemReceta.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				locals: { info: item },
				resolve:{
					informacion:function(busqueda,$q){
						scope.loading = true;
					    var promesa 		= $q.defer(),
							items 			= busqueda.itemsReceta(),
							tiposMovimiento = busqueda.tiposMovimiento(),
		            		almacenes 		= busqueda.almacenes(),
		            		tiposajuste 	= busqueda.tiposAjuste();

						$q.all([items,tiposMovimiento,almacenes,tiposajuste]).then(function (data){
							// console.log(data);
							promesa.resolve(data);
							scope.loading = false;
						});

					    return promesa.promise;
					}
				},
		      clickOutsideToClose:false
		    }).then(function(){
		    	scope.surtidos();
		    });
		};

		scope.surtidos = function(){
			busqueda.itemsRecetaSurtidas(scope.receta).success(function (data){
	    		scope.itemsSurtidos = data;
	    	});
		}

		scope.buscaReceta = function(){

			scope.cargando = true;
			scope.datosReceta = false;
			scope.datos = [];

			busqueda.receta(scope.receta).success(function (data){
				scope.datos = data;
				scope.cargando = false;
				scope.datosReceta = true;
				scope.surtidos();
			}).error(function (data){
				scope.cargando = false;
			});
		}

	}

	function loteRecetaCtrl($scope, $mdDialog, info, mensajes,busqueda,informacion){

		console.log(informacion);

		$scope.lotesUnidad = informacion.data;
		$scope.lotes = info.lotes ? info.lotes : [];
		$scope.maximo = info.caja > 0 ? Number(info.caja) * Number(info.cantidad) : info.cantidad ;

		if ($scope.lotes.length > 0) {

			angular.forEach($scope.lotes, function (value,key){
				$scope.maximo -= value.cantidad;
			});

		}

		$scope.inicio = function(){

			$scope.cantidadLote = 0;

			$scope.datos = {
				cantidad :'',
				idLote : '',
				lote : '',
				caducidad : ''
			}
		};

		$scope.datosLote = function(lote){
			if (lote) {
				
				var dato = JSON.parse(lote);

				$scope.datos.idLote = dato.LOT_clave;
				$scope.datos.lote = dato.LOT_numero;
				$scope.datos.caducidad = moment(dato.LOT_caducidad).toDate();
				$scope.cantidadLote = dato.LOT_cantidad;
				
			};
		}

		$scope.verificaCantidadLote = function(){
			if ($scope.cantidadLote > 0 && $scope.cantidadLote < $scope.datos.cantidad) {
				mensajes.alerta('El lote solo tiene ' + $scope.cantidadLote + ' disponible(s)','error','top right','error');
				$scope.datos.cantidad = 0;
			}else if ($scope.cantidadLote == 0 && $scope.datos.cantidad > 0 && $scope.datos.idLote != '') {
				mensajes.alerta('Este lote no tiene cantidad disponible','error','top right','error');
			};
		}

		$scope.verificaLote = function(){
			var lote = $scope.datos.lote;
			
			if (lote != '') {
				
				mensajes.alerta('Verificando Lote','info','top right','search');
				busqueda.lote(lote).success(function (data){

					if (data) {
						mensajes.alerta('Lote Existente','success','top right','done');
						$scope.datos.idLote = data.LOT_clave;
						$scope.datos.caducidad = moment(data.LOT_caducidad).toDate();
					}else{
						$scope.datos.caducidad = '';
						mensajes.alerta('Lote No Existente Verificalo nuevamente','error','top right','alert');
					}

				}).error(function (data){
					$scope.mensajeError();
				});

			};
		}

		$scope.agrega = function(){

			if ($scope.modificaForm.$valid) {
				$scope.maximo -= $scope.datos.cantidad;

				$scope.lotes.push($scope.datos);
				$scope.inicio();
			};
		}

		$scope.ingresa = function(){

			if ($scope.maximo == 0) {
				$mdDialog.hide($scope.lotes);
			}else{
				mensajes.alerta('No has ingresado todos los items a lotes','error','top right','error');
			}
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		
	}

	function itemRecetaCtrl($scope,$rootScope,$mdDialog,informacion,operacion,mensajes,$q,$filter,busqueda,info){

		$scope.items = informacion[0].data;
		$scope.tiposmovimiento = informacion[1].data;
		$scope.almacenes = informacion[2].data;
		$scope.tiposajuste = informacion[3].data;
		$scope.existeLote = false;

		$scope.inicio = function(){

			$scope.busqueda = null;
		    $scope.consultado = consultado;
		    $scope.item = '';
		    $scope.disponible = '';
		    $scope.lotes = [];

			$scope.datos = {
				almacen:info.almacen,
				item:'',
				cantidad:'',
				tipomov:3,
				tipoa:'',
				orden:'',
				lote:'',
				idLote:'',
				caducidad:'',
				receta:info.receta,
				usuario:$rootScope.id,
				observaciones:''
			}

			$scope.guardando = false;
		}

		$scope.selectedItemChange= function(){

			if ($scope.datos.almacen != '' && $scope.item) {
				console.log('entro');
				$scope.datos.lote = '';
				$scope.datos.idLote = '';
				$scope.datos.caducidad = '';
				$scope.verificaExistencia($scope.datos.almacen);
			};

        };

		$scope.mensajeError = function(){
			mensajes.alerta('Ocurrio un error intentalo nuevamente','error','top right','error');
		}

		$scope.datosLote = function(lote){
			if (lote) {
				var dato = JSON.parse(lote);

				console.log(dato);
				$scope.datos.idLote = dato.LOT_clave;
				$scope.datos.lote = dato.LOT_numero;
				$scope.datos.caducidad = moment(dato.LOT_caducidad).toDate();
				$scope.cantidadLote = dato.LOT_cantidad;
				$scope.existeLote = true;

				$scope.verificaCantidadLote();
			};
		}

		$scope.verificaLote = function(){
			

			var lote = $scope.datos.lote;
			
			if (lote != '') {
				
				mensajes.alerta('Verificando Lote','info','top right','search');
				busqueda.lote(lote).success(function (data){

					if (data) {
						mensajes.alerta('Lote Existente','success','top right','done');
						$scope.datos.idLote = data.LOT_clave;
						$scope.datos.caducidad = moment(data.LOT_caducidad).toDate();
						$scope.existeLote = true;
					}else{
						mensajes.alerta('Lote No Existente Ingresa Caducidad','error','top right','alert');
					}

				}).error(function (data){
					$scope.mensajeError();
				});

			};
		}

		$scope.verificaCantidadLote = function(){

			if ($scope.cantidadLote > 0 && $scope.cantidadLote < $scope.datos.cantidad && $scope.datos.tipomov == 3) {
				mensajes.alerta('El lote solo tiene ' + $scope.cantidadLote + ' disponible(s)','error','top right','error');
				$scope.datos.cantidad = 0;
			}else if ($scope.cantidadLote == 0 && $scope.datos.cantidad > 0 && $scope.datos.idLote != '' && $scope.datos.tipomov == 3) {
				mensajes.alerta('Este lote no tiene cantidad disponible','error','top right','error');
			};
		}


		//verificamos la existencia actual del item en el almacen
		$scope.verificaExistencia = function(almacen){

			if (almacen) {

				mensajes.alerta('Verificando Datos de Almacen','info','top right','search');
				//en caso de que el item sea forzoso buscamos los lotes existentes
				if ($scope.item.TIT_forzoso == 1) {

					busqueda.lotesAlmacenXitem(almacen,$scope.item.ITE_clave).success(function (data){
						$scope.lotes = data;
					});

				};

				busqueda.itemAlmacen(almacen,$scope.item.ITE_clave).success(function (data){
					// console.log(data);
					if ($scope.datos.tipomov == 3 && data == '') {
						mensajes.alerta('No hay Cantdad Disponible En Este Almacen Para Salida','error','top right','error');
						$scope.disponible = 0;
					}else{
						if (data == '') {
							$scope.disponible = 0;
						}else{
							$scope.disponible = data.EXI_cantidad;
						}
					}
				}).error(function (data){
					$scope.mensajeError();
				});

			};
		}

		$scope.guardar = function(){

			if ($scope.movimientoForm.$valid && $scope.item) {
			
				$scope.datos.item = $scope.item.ITE_clave;

				// console.log($scope.datos);
				$scope.guardando = true;
				operacion.altaMovimiento($scope.datos).success(function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.movimientoForm.$setPristine();
					$scope.inicio();
				}).error(function (data){
					$scope.mensajeError();
					$scope.guardando = false;
				})

			};
			
		}

		$scope.detalleItem = function(item){
			// console.log(item);
		}

		$scope.verificaForm = function(){

			if ($scope.datos.tipomov == 1 && $scope.datos.tipoa == '') {
				return true;
			}else if($scope.datos.tipomov == 3 && $scope.disponible < $scope.datos.cantidad){
				return true;
			}else if($scope.datos.tipomov == 3 && $scope.item.TIT_forzoso == 1 && $scope.datos.idLote == ''){
				return true;
			}else if ($scope.guardando) {
				return true;
			}else{
				return false;
			}
		}

	    function consultado(query) {

			var q = $q.defer(),
				response = query ? $filter( 'filter' )( $scope.items, query ) : $scope.items;
				q.resolve( response );

			return q.promise;
	    }

	    function consultaLote(query) {

			var q2 = $q.defer(),
				response2 = query ? $filter( 'filter' )( $scope.lotes, query ) : $scope.lotes;
				q2.resolve( response2 );

			return q2.promise;
	    }

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

})();