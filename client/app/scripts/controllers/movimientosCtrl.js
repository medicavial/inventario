(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('movimientoCtrl',movimientoCtrl)
	.controller('movimientosCtrl',movimientosCtrl)

	movimientosCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','mensajes'];
	movimientoCtrl.$inject = ['$scope','$rootScope','$mdDialog','informacion','operacion','mensajes','$q','$filter','busqueda'];


	function movimientosCtrl($rootScope,$mdDialog,datos,busqueda,mensajes){

		var scope = this;
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Movimientos Registrados';
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
		    //return $nutrition.desserts.get(scope.query, success).$promise; 
		};

		scope.nuevo = function(ev) {

		    $mdDialog.show({
		      controller: movimientoCtrl,
		      templateUrl: 'views/movimiento.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      resolve:{
	            informacion:function(busqueda,$q){
	            	scope.loading = true;
	                var promesa 		= $q.defer(),
	            		items 			= busqueda.items(),
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
		    	busqueda.movimientos().success(function (data){
		    		scope.info = data;
		    	});
		    });
		};

	}


	function movimientoCtrl($scope,$rootScope,$mdDialog,informacion,operacion,mensajes,$q,$filter,busqueda){

		$scope.items = informacion[0].data;
		$scope.tiposmovimiento = informacion[1].data;
		$scope.almacenes = informacion[2].data;
		$scope.tiposajuste = informacion[3].data;
		$scope.nuevoLote = false;

		// console.log($scope.items);

		$scope.inicio = function(){

			$scope.busqueda = null;
		    $scope.consultado = consultado;
		    $scope.item = '';
		    $scope.disponible = '';

			$scope.datos = {
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

			$scope.guardando = false;
		}

		$scope.mensajeError = function(){
			mensajes.alerta('Ocurrio un error intentalo nuevamente','error','top right','error');
		}

		$scope.verificaLote = function(){
			var lote = $scope.datos.lote;
			
			if (lote != '') {
				
				busqueda.lote(lote).success(function (data){

					if (data) {
						mensajes.alerta('lote existente','','top right','done');
						$scope.datos.idLote = data.LOT_clave;
					}else{
						mensajes.alerta('lote no existente ingresa caducidad','','top right','alert');
						$scope.nuevoLote = true;
					}

				}).error(function (data){
					$scope.mensajeError();
				});

			};
		}

		$scope.verificaExistencia = function(almacen){

			mensajes.alerta('verificando existencias','','top right','search');

			busqueda.itemAlmacen(almacen,$scope.item.ITE_clave).success(function (data){
				// console.log(data);
				if ($scope.datos.tipomov == 3 && data == '') {
					mensajes.alerta('No hay cantdad disponible en este almacen para salida','error','top right','error');
					$scope.disponible = 0;
				}else{
					$scope.disponible = data.EXI_cantidad;
				}
			}).error(function (data){
				$scope.mensajeError();
			});
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




		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

})();