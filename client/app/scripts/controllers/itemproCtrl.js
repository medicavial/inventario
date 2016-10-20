(function(){

	'use strict';

	angular.module('app')
	.controller('itemproCtrl',itemproCtrl)
	.controller('nuevoItemproCtrl',nuevoItemproCtrl)
	.controller('editaItemproCtrl',editaItemproCtrl)

	itemproCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','operacion'];
	nuevoItemproCtrl.$inject = ['$scope','$mdDialog','informacion','mensajes','$q','$filter','operacion','$rootScope'];
	editaItemproCtrl.$inject = ['$scope','$mdDialog','informacion','mensajes','$q','$filter','operacion','$rootScope','datos'];

	function itemproCtrl($rootScope,$mdDialog,datos,busqueda,operacion){

		var scope = this;

		$rootScope.titulo = 'Registro de Costos por item';
		$rootScope.cargando = false;
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';
		$rootScope.tema = 'theme1';
		scope.items = datos.data;

		scope.inicio = function(){

			scope.loading = false;
			scope.total = 0;
			scope.limit = 10;
			scope.page = 1;

		}

		
		scope.nuevo = function(ev) {

		    $mdDialog.show({
		      controller: nuevoItemproCtrl,
		      templateUrl: 'views/altaitempro.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      resolve:{
	            informacion:function(busqueda,$q){
	            	scope.loading = true;
	                 var promesa = $q.defer(),
	            		items = busqueda.items(),
	            		proveedores = busqueda.proveedores();

	            	$q.all([items,proveedores]).then(function (data){
	            		console.log(data);
	            		promesa.resolve(data);
	            		scope.loading = false;
	            	});

	                return promesa.promise;
	            }
	          },
		      clickOutsideToClose:false
		    }).then(function(){
		    	busqueda.itemsProveedor().success(function (data){
		    		scope.items = data;
		    	});
		    });

		};

		scope.edita = function(ev,item) {

		    $mdDialog.show({
		      controller: editaItemproCtrl,
		      templateUrl: 'views/altaitempro.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      locals:{datos:item},
		      resolve:{
	            informacion:function(busqueda,$q){
	            	scope.loading = true;
	                 var promesa = $q.defer(),
	            		items = busqueda.items(),
	            		proveedores = busqueda.proveedores();

	            	$q.all([items,proveedores]).then(function (data){
	            		console.log(data);
	            		promesa.resolve(data);
	            		scope.loading = false;
	            	});

	                return promesa.promise;
	            }
	          },
		      clickOutsideToClose:false
		    }).then(function(){
		    	busqueda.itemsProveedor().success(function (data){
		    		scope.items = data;
		    	});
		    });

		};

		scope.elimina = function(ev,item) {
		    // Abre ventana de confirmacion

		   	console.log(item);

		    var confirm = $mdDialog.confirm()
		          .title('¿Seguro que deseas eliminar esta conexión?')
		          .content('')
		          .ariaLabel('Quitar Conexión')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev);

		    $mdDialog.show(confirm).then(
			    function() {

			    	operacion.eliminaItempro(item).success(function (data){

						mensajes.alerta(data.respuesta,'success','top right','done_all');

					}).error(function (error){
						mensajes.alerta('Ocurrio un error intentalo nuevamente','error','top right','error');
					});
			    }
		    );
		};

	}

	function nuevoItemproCtrl($scope,$mdDialog,informacion,mensajes,$q,$filter,operacion,$rootScope){

		$scope.items = informacion[0].data;
		$scope.proveedores = informacion[1].data;

		$scope.inicio = function(){
			$scope.seleccionado = null;
		    $scope.busqueda = null;
		    $scope.consultado = consultado;
		    $scope.datos = {
		    	usuarioasigno:$rootScope.id,
		    	item:'',
		    	proveedor:'',
		    	cantidad:''
		    }

		    $scope.edicion = false;
			$scope.guardando = false;
		}

		function consultado(query) {

			var q = $q.defer(),
				response = query ? $filter( 'filter' )( $scope.items, query ) : $scope.items;
				q.resolve( response );

			return q.promise;

	    }

		$scope.guardar = function(){
				console.log($scope.datos);
				$scope.guardando = true;

				operacion.altaItempro($scope.datos).success(function (data){

					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.inicio();

				}).error(function (error){
					mensajes.alerta('Ocurrio un error intentalo nuevamente','error','top right','error');
				});

		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

	function editaItemproCtrl($scope,$mdDialog,informacion,mensajes,$q,$filter,operacion,$rootScope,datos){


		console.log(datos);
		$scope.items = informacion[0].data;
		$scope.proveedores = informacion[1].data;

		$scope.inicio = function(){
			$scope.seleccionado = null;
		    $scope.busqueda = null;
		    $scope.consultado = consultado;
		    $scope.datos = {
		    	usuarioasigno:$rootScope.id,
		    	item:datos.ITE_nombre,
		    	itemId:datos.ITE_clave,
		    	proveedor:datos.PRO_clave,
		    	cantidad:datos.IPR_ultimoCosto,
		    	fecha:datos.IPR_ultimaFecha
		    }

		    $scope.edicion = true;
			$scope.guardando = false;
		}

		function consultado(query) {

			var q = $q.defer(),
				response = query ? $filter( 'filter' )( $scope.items, query ) : $scope.items;
				q.resolve( response );

			return q.promise;

	    }

		$scope.guardar = function(){
				// console.log($scope.datos);
				$scope.guardando = true;

				operacion.actualizaItempro($scope.datos).success(function (data){

					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					// $scope.inicio();

				}).error(function (error){
					mensajes.alerta('Ocurrio un error intentalo nuevamente','error','top right','error');
				});

		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

})();