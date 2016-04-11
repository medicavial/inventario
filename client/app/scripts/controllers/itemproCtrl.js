(function(){

	"use strict"

	angular.module('app')
	.controller('itemproCtrl',itemproCtrl)
	.controller('nuevoItemproCtrl',nuevoItemproCtrl)

	itemproCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','operacion'];
	nuevoItemproCtrl.$inject = ['$scope','$mdDialog','informacion','mensajes','$q','$filter','operacion','$rootScope'];

	function itemproCtrl($rootScope,$mdDialog,datos,busqueda,operacion){

		var scope = this;

		$rootScope.titulo = 'Registro de Costos por item';
		$rootScope.cargando = false;
		$rootScope.atras = true;
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

		scope.confirma = function(ev,index,almacen) {
		    // Abre ventana de confirmacion

		    var usuario = scope.usuarios[index];

		    var confirm = $mdDialog.confirm()
		          .title('¿Seguro que deseas asignar este almacen?')
		          .content('')
		          .ariaLabel('Asignar Almacen')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev);

		    $mdDialog.show(confirm).then(
			    function() {
			    	// console.log(usuario.clave);
			    	// console.log(almacen.ALM_clave);
			    	operacion.bajaAlmacen(almacen.ALM_clave,usuario.clave);
			    },
			    function() {
			    	busqueda.usuariosAlmacen().success(function(data){
			    		scope.items = data;
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

				});

		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

})();