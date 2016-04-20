(function(){

	'use strict';
	
	angular.module('app')
	.controller('tipoAjusteCtrl',tipoAjusteCtrl)
	.controller('tiposAjusteCtrl',tiposAjusteCtrl)
	.controller('tipoAjusteEditCtrl',tipoAjusteEditCtrl)

	tiposAjusteCtrl.$inject = ['$rootScope','$mdDialog','datos','tiposajuste','mensajes'];
	tipoAjusteCtrl.$inject = ['$scope','$mdDialog','busqueda','tiposajuste','mensajes'];
	tipoAjusteEditCtrl.$inject = ['$scope','$mdDialog','tiposajuste','mensajes','informacion'];



	function tiposAjusteCtrl($rootScope,$mdDialog,datos,tiposajuste,mensajes){

		var scope = this;
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Tipos de Ajuste';
		scope.info = datos;
		scope.total = 0;
		scope.limit = 10;
		scope.page = 1;

		scope.onPaginationChange = function (page, limit) {
		    console.log(page);
		    console.log(limit);
		};

		scope.onOrderChange = function (order) {
			console.log(scope.query);
		    //return $nutrition.desserts.get(scope.query, success).$promise; 
		};

		scope.nuevo = function(ev) {
		    $mdDialog.show({
		      controller: tipoAjusteCtrl,
		      templateUrl: 'views/tipoajuste.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false
		    }).then(function(){
		    	scope.info = tiposajuste.query();
		    });
		};

		scope.edita = function(ev,index) {

			var tipo = scope.info[index];

		    $mdDialog.show({
		      controller: tipoAjusteEditCtrl,
		      templateUrl: 'views/tipoajuste.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      locals: {informacion: tipo }
		    }).then(function(){
		    	scope.info = tiposajuste.query();
		    });
		};

		scope.confirmacion = function(ev,index) {
		    // Abre ventana de confirmacion

		    // console.log(index);
		    var tipoajuste = scope.info[index];

		    var confirm = $mdDialog.confirm()
		          .title('¿Desactivar el tipo de ajuste?')
		          .content('Puedes activarlo cuando lo necesites nuevamente')
		          .ariaLabel('Desactivar Tipo Ajuste')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev);

		    $mdDialog.show(confirm).then(function() {

		    	//en caso de decir SI
		    	if (tipoajuste.TIA_activo) {
		      		tipoajuste.TIA_activo = 0;
		    	}else{
		    		tipoajuste.TIA_activo = 1;
		    	}

		      	var datos = {
					nombre:tipoajuste.TIA_nombre,
					activo:tipoajuste.TIA_activo
				}

		      	tipoajustes.update({tipo:tipoajuste.TIA_clave},datos,
		      		function (data){
		      			mensajes.alerta(data.respuesta,'success','top right','done_all');
		      		}
		      	);

		    });
		};

	}


	function tipoAjusteCtrl($scope,$mdDialog,busqueda,tiposajuste,mensajes){


		$scope.inicio = function(){
			$scope.datos = {
				nombre:'',
				activo:true
			}

			$scope.guardando = false;
		}

		$scope.guardar = function(){

			if ($scope.tipoAForm.$valid) {

				$scope.guardando = true;
				tiposajuste.save($scope.datos,function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.tipoAForm.$setPristine();
					$scope.inicio();
				});

			};
			
		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

	function tipoAjusteEditCtrl($scope,$mdDialog,tiposajuste,mensajes,informacion){

		$scope.inicio = function(){

			$scope.datos = {
				nombre:informacion.TIA_nombre,
				activo:informacion.TIA_activo ? true:false
			}

			$scope.guardando = false;
		}

		$scope.guardar = function(){


			if ($scope.tipoAForm.$valid) {

				$scope.guardando = true;
				tiposajuste.update({tipo:informacion.TIA_clave},$scope.datos,function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.tipoAForm.$setPristine();
				});

			};
			
		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

})();