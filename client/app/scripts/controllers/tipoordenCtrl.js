(function(){

	"use strict"
	
	angular.module('app')
	.controller('tipoOrdenCtrl',tipoOrdenCtrl)
	.controller('tiposOrdenCtrl',tiposOrdenCtrl)
	.controller('tipoOrdenEditCtrl',tipoOrdenEditCtrl)

	tiposOrdenCtrl.$inject = ['$rootScope','$mdDialog','datos','tiposorden','mensajes'];
	tipoOrdenCtrl.$inject = ['$scope','$mdDialog','tiposorden','mensajes'];
	tipoOrdenEditCtrl.$inject = ['$scope','$mdDialog','tiposorden','mensajes','informacion'];

	function tiposOrdenCtrl($rootScope,$mdDialog,datos,tiposorden,mensajes){

		var scope = this;
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Tipos de Orden Registrados';
		scope.info = datos;
		scope.total = 0;
		scope.order = 'TOR_clave';
		scope.limit = 10;
		scope.page = 1;
		scope.texto = {
	      text: 'Tipos por pagina:',
	      of: 'de'
	    };
		scope.paginacion = [10,20,30,40];

		scope.onOrderChange = function (order) {
			
		};

		scope.nuevo = function(ev) {
		    $mdDialog.show({
		      controller: tipoOrdenCtrl,
		      templateUrl: 'views/tipoorden.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true
		    }).then(
		    function(){
		    	scope.info = tiposorden.query();
		    });
		};

		scope.edita = function(ev,index) {

			var tipoorden = scope.info[index];

		    $mdDialog.show({
		      controller: tipoOrdenEditCtrl,
		      templateUrl: 'views/tipoorden.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      locals: {informacion: tipoorden }
		    }).then(
		    function(){
		    	scope.info = tiposorden.query();
		    });
		};

		scope.confirmacion = function(ev,index) {
		    // Abre ventana de confirmacion

		    // console.log(index);
		    var tipoorden = scope.info[index];

		    var confirm = $mdDialog.confirm()
		          .title('¿Desactivar el Tipo de item?')
		          .content('Puedes activarlo cuando lo necesites nuevamente')
		          .ariaLabel('Desactivar permiso')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev);

		    $mdDialog.show(confirm).then(function() {

		    	//en caso de decir SI
		    	if (tipoorden.TOR_activo) {
		      		tipoorden.TOR_activo = 0;
		    	}else{
		    		tipoorden.TOR_activo = 1;
		    	}

		      	var datos = {
		      		nombre : tipoorden.TOR_nombre,
					activo : tipoorden.TOR_activo
				}

		      	tiposorden.update({tipoorden:tipoorden.TOR_clave},datos,
		      		function (data){
		      			mensajes.alerta(data.respuesta,'success','top right','done_all');
		      		}
		      	);

		    });
		};

	}

	function tipoOrdenCtrl($scope,$mdDialog,tiposorden,mensajes){

		$scope.tiposorden = tiposorden.query();

		$scope.inicio = function(){
			$scope.datos = {
				nombre:'',
				activo:true
			}

			$scope.guardando = false;
		}

		$scope.guardar = function(){

			if ($scope.tipoOrdenForm.$valid) {

				$scope.guardando = true;
				tiposorden.save($scope.datos,function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.tipoOrdenForm.$setPristine();
					$scope.inicio();
				});

			};
			
		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

	function tipoOrdenEditCtrl($scope,$mdDialog,tiposorden,mensajes,informacion){

		$scope.inicio = function(){

			$scope.datos = {
				nombre : informacion.TOR_nombre,
				activo : informacion.TOR_activo ? true:false
			}

			$scope.guardando = false;
		}

		$scope.guardar = function(){


			if ($scope.tipoOrdenForm.$valid) {

				$scope.guardando = true;
				tiposorden.update({tipoorden:informacion.TOR_clave},$scope.datos,function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.tipoOrdenForm.$setPristine();
				});

			};
			
		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

})();