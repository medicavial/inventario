(function(){

	'use strict';
	
	angular.module('app')
	.controller('usualmCtrl',usualmCtrl)
	.controller('nuevoUsualmCtrl',nuevoUsualmCtrl)

	usualmCtrl.$inject = ['$rootScope','datos','$mdDialog','busqueda','operacion'];
	nuevoUsualmCtrl.$inject = ['$stateParams','busqueda','mensajes','$q','$filter','datos','operacion','$rootScope','$mdDialog'];

	function usualmCtrl($rootScope,datos,$mdDialog,busqueda,operacion){

		var scope = this;

		$rootScope.titulo = 'Registro de Usuario en almacen';
		$rootScope.cargando = false;
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';
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

	function nuevoUsualmCtrl($stateParams,busqueda, mensajes, $q, $filter,datos, operacion,$rootScope, $mdDialog){

		var vm = this;

		console.log(datos);
		vm.usuarios = datos[0].data;

		$rootScope.titulo = 'Registro de Usuario en almacen';
		$rootScope.cargando = false;
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		vm.inicio = function(){
			vm.seleccionado = null;
		    vm.busqueda = null;
		    vm.almacenesSeleccionados = [];
		    vm.almacenesActivos = [];

		    vm.datos = {
		    	usuario:$stateParams.usuario,
		    	usuarioasigno:$rootScope.id,
		    	almacenes:vm.almacenesSeleccionados
		    }

		    vm.consultaAlmacen = false;
		    vm.selectedAll = false;
			vm.guardando = false;

			vm.almacenesUsuario($stateParams.usuario);
		}

		vm.agregaAlmacen = function(almacen){

			almacen.seleccionado = !almacen.seleccionado;

			// console.log(almacen);
			if (almacen.seleccionado) {
				vm.almacenesSeleccionados.push(almacen);
			}else{
				var index = vm.almacenesSeleccionados.indexOf(almacen);
				vm.almacenesSeleccionados.splice(1,index);
			}

		}

		vm.almacenesUsuario = function(usuario){

			if (usuario) {
				vm.consultaAlmacen = true;	
				vm.almacenesActivos = [];

				busqueda.almacenesUsuario(usuario).then(function (datos){
					vm.almacenesActivos = datos.data;
				});	

				busqueda.almacenUsuario(usuario).then(function (info){
					vm.almacenes = info.data;
					vm.consultaAlmacen = false;
				});	
			};
		}

		vm.seleccionaTodo = function(){

			console.log(vm.selectedAll);
			if (vm.selectedAll) {
				vm.datos.almacenes = [];
			}else{
				vm.datos.almacenes = vm.almacenes;
			}
			angular.forEach(vm.almacenes, function (almacen) {
	            almacen.seleccionado = !vm.selectedAll;
	        });
		}


		vm.guardar = function(){
				// console.log(vm.datos);
				vm.guardando = true;

				operacion.altaAlmacenes(vm.datos).success(function (data){

					mensajes.alerta(data.respuesta,'success','top right','done_all');
					vm.guardando = false;
					vm.inicio();

				}).error(function (error){
					mensajes.alerta('Ocurrio un error de conexión intentalo nuevamente','error','top right','error');
				});

		}

		vm.confirma = function(ev,almacen) {
		    // Abre ventana de confirmacion
		    
		    var confirm = $mdDialog.confirm()
		          .title('¿Seguro que deseas asignar este almacen?')
		          .textContent('')
		          .ariaLabel('Quitar Almacen')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev)
		          .closeTo({
					bottom: 1500
				   });

		    $mdDialog.show(confirm).then(
			    function() {

			    	operacion.bajaAlmacen(almacen.ALM_clave,vm.datos.usuario).success(function (data){
			    		mensajes.alerta(data.respuesta,'success','top right','done_all');
						vm.inicio();
			    	}).error(function (error){

			    	})
			    },
			    function() {
			    	
			    }
		    );
		};




	}

})();