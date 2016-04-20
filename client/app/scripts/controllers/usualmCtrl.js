(function(){

	'use strict';
	
	angular.module('app')
	.controller('usualmCtrl',usualmCtrl)
	.controller('nuevoUsualmCtrl',nuevoUsualmCtrl)

	usualmCtrl.$inject = ['$rootScope','datos','$mdDialog','busqueda','operacion'];
	nuevoUsualmCtrl.$inject = ['$scope','$mdDialog','busqueda','mensajes','$q','$filter','informacion','operacion','$rootScope'];

	function usualmCtrl($rootScope,datos,$mdDialog,busqueda,operacion){

		var scope = this;

		$rootScope.titulo = 'Registro de Usuario en almacen';
		$rootScope.cargando = false;
		$rootScope.atras = true;
		$rootScope.tema = 'theme1';

		scope.inicio = function(){

			scope.total = 0;
			scope.limit = 10;
			scope.page = 1;
			scope.usuarios = datos[0].data;

		}

		
		scope.nuevo = function(ev,index) {

			var usuario = scope.usuarios[index];

		    $mdDialog.show({
		      controller: nuevoUsualmCtrl,
		      templateUrl: 'views/almacenusuario.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false,
		      locals: {informacion: usuario }
		    }).then(function(){
		    	busqueda.usuariosAlmacen().success(function (data){
		    		scope.usuarios = data;
		    	});
		    });
		};

		scope.confirma = function(ev,usuario,almacen) {
		    // Abre ventana de confirmacion
		    
		    var confirm = $mdDialog.confirm()
		          .title('¿Seguro que deseas asignar este almacen?')
		          .textContent('')
		          .ariaLabel('Asignar Almacen')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev)
		          .closeTo({
					bottom: 1500
				   });

		    $mdDialog.show(confirm).then(
			    function() {
			    	// console.log(almacen.ALM_clave);
			    	operacion.bajaAlmacen(almacen.ALM_clave,usuario.clave);
			    },
			    function() {
			    	busqueda.usuariosAlmacen().success(function(data){
			    		scope.usuarios = data;
			    	});
			    }
		    );
		};

	}

	function nuevoUsualmCtrl($scope,$mdDialog,busqueda,mensajes,$q,$filter,informacion,operacion,$rootScope){


		console.log(informacion);
		busqueda.almacenUsuario(informacion.clave).then(function (info){
			$scope.almacenes = info.data;
		});

		$scope.inicio = function(){
			$scope.seleccionado = null;
		    $scope.busqueda = null;
		    $scope.consultado = consultado;
		    $scope.almacenesseleccionados = [];
		    $scope.datos = {
		    	usuario:informacion.clave,
		    	usuarioasigno:$rootScope.id,
		    	almacenes:$scope.almacenesseleccionados
		    }

			$scope.guardando = false;
		}

	    function consultado(query) {

			var q = $q.defer(),
				response = query ? $filter( 'filter' )( $scope.almacenes, query ) : $scope.almacenes;
				q.resolve( response );

			return q.promise;

	    }


		$scope.guardar = function(){
				console.log($scope.datos);
				$scope.guardando = true;

				operacion.altaAlmacenes($scope.datos).success(function (data){

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