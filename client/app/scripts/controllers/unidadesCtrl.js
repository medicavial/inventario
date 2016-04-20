(function(){

	'use strict';
	
	angular.module('app')
	.controller('unidadCtrl',unidadCtrl)
	.controller('unidadesCtrl',unidadesCtrl)
	.controller('unidadEditCtrl',unidadEditCtrl)

	unidadesCtrl.$inject = ['$rootScope','$mdDialog','datos','unidades','mensajes'];
	unidadCtrl.$inject = ['$scope','$mdDialog','unidades','mensajes'];
	unidadEditCtrl.$inject = ['$scope','$mdDialog','unidades','mensajes','informacion'];

	function unidadesCtrl($rootScope,$mdDialog,datos,unidades,mensajes){

		var scope = this;
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Unidades Registradas';
		scope.info = datos;
		scope.total = 0;
		scope.limit = 10;
		scope.page = 1;
		scope.texto = {
	      text: 'Tipos por pagina:',
	      of: 'de'
	    };
		scope.paginacion = [10,20,30,40];

		scope.nuevo = function(ev) {
		    $mdDialog.show({
		      controller: unidadCtrl,
		      templateUrl: 'views/unidad.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false
		    }).then(
		    function(){
		    	scope.info = unidades.query();
		    });
		};

		scope.edita = function(ev,index) {

			var unidad = scope.info[index];

		    $mdDialog.show({
		      controller: unidadEditCtrl,
		      templateUrl: 'views/unidad.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      locals: {informacion: unidad },
		      closeTo:{bottom: 1500}
		    }).then(
		    function(){
		    	scope.info = unidades.query();
		    });
		};

		scope.confirmacion = function(ev,index) {
		    // Abre ventana de confirmacion

		    // console.log(index);
		    var unidad = scope.info[index];

		    var confirm = $mdDialog.confirm()
		          .title('¿Desactivar la Unidad?')
		          .content('Puedes activarlo cuando lo necesites nuevamente')
		          .ariaLabel('Desactivar unidad')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev)
		          .closeTo({
					bottom: 1500
				  }); 

		    $mdDialog.show(confirm).then(function() {

		    	//en caso de decir SI
		    	if (unidad.UNI_activo) {
		      		unidad.UNI_activo = 0;
		    	}else{
		    		unidad.UNI_activo = 1;
		    	}

		      	var datos = {
		      		nombre : unidad.UNI_nombre,
		      		nombrecorto:unidad.UNI_nombrecorto,
					correo:unidad.UNI_correo,
					activo : unidad.UNI_activo
				}

		      	unidades.update({unidad:unidad.UNI_clave},datos,
		      		function (data){
		      			mensajes.alerta(data.respuesta,'success','top right','done_all');
		      		}
		      	);

		    });
		};

	}

	function unidadCtrl($scope,$mdDialog,unidades,mensajes){

		$scope.unidades = unidades.query();

		$scope.inicio = function(){
			$scope.datos = {
				nombre:'',
				nombrecorto:'',
				responsable:'',
				horaentrega:'',
				direccion:'',
				correo:'',
				activo:true
			}

			$scope.guardando = false;
		}

		$scope.guardar = function(){

			if ($scope.unidadForm.$valid) {

				$scope.guardando = true;
				unidades.save($scope.datos,function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.unidadForm.$setPristine();
					$scope.inicio();
				});

			};
			
		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

	function unidadEditCtrl($scope,$mdDialog,unidades,mensajes,informacion){

		$scope.inicio = function(){

			$scope.datos = {
				nombre : informacion.UNI_nombre,
				nombrecorto:informacion.UNI_nombrecorto,
				correo:informacion.UNI_correo,
				responsable:informacion.UNI_responsable,
				horaentrega:informacion.UNI_horaentrega,
				direccion:informacion.UNI_direccion,
				activo : informacion.UNI_activo ? true:false
			}

			$scope.guardando = false;
		}

		$scope.guardar = function(){


			if ($scope.unidadForm.$valid) {

				$scope.guardando = true;
				unidades.update({unidad:informacion.UNI_clave},$scope.datos,function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.unidadForm.$setPristine();
				});

			};
			
		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

})();