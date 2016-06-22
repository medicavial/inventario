(function(){


	'use strict';

	angular
	.module('app')
	.controller('almacenCtrl',almacenCtrl)
	.controller('almacenesCtrl',almacenesCtrl)
	.controller('almacenEditCtrl',almacenEditCtrl)

	almacenesCtrl.$inject = ['$rootScope','$mdDialog','datos','almacenes','mensajes'];
	almacenCtrl.$inject = ['$scope','$mdDialog','busqueda','almacenes','mensajes'];
	almacenEditCtrl.$inject = ['$scope','$mdDialog','almacenes','mensajes','informacion','busqueda'];

	function almacenesCtrl($rootScope,$mdDialog,datos,almacenes,mensajes){

		var scope = this;
		$rootScope.tema = 'theme3';
		$rootScope.titulo = 'Almacenes Registrados';
		scope.info = datos;
		scope.total = 0;
		scope.limit = 10;
		scope.page = 1;
		scope.texto = {
	      text: 'Almacenes por pagina:',
	      of: 'de'
	    };
		scope.paginacion = [10,20,30,40];

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
		      controller: almacenCtrl,
		      templateUrl: 'views/almacen.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false
		    }).then(function(){
		    	scope.info = almacenes.query();
		    });
		};

		scope.edita = function(ev,almacen) {

			// var usuario = scope.info[index];

		    $mdDialog.show({
		      controller: almacenEditCtrl,
		      templateUrl: 'views/almacen.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      locals: {informacion: almacen },
		      closeTo:{bottom: 1500}
		    }).then(function(){
		    	scope.info = almacenes.query();
		    });
		};

		scope.confirmacion = function(ev,almacen) {
		    // Abre ventana de confirmacion

		    // console.log(index);
		    // var almacen = scope.info[index];

		    var confirm = $mdDialog.confirm()
		          .title('¿Desactivar el almacen?')
		          .content('Puedes activarlo cuando lo necesites nuevamente')
		          .ariaLabel('Desactivar almacen')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev)
		          .closeTo({
					bottom: 1500
				   });

		    $mdDialog.show(confirm).then(function() {

		    	//en caso de decir SI
		    	if (almacen.ALM_activo) {
		      		almacen.ALM_activo = 0;
		    	}else{
		    		almacen.ALM_activo = 1;
		    	}

		      	var datos = {
					nombre:almacen.ALM_nombre,
					observaciones:almacen.ALM_observaciones,
					ubicacion:almacen.ALM_ubicacion,
					tipo:almacen.TAL_clave,
					unidad:almacen.UNI_clave,
					activo:almacen.ALM_activo
				}

		      	almacenes.update({almacen:almacen.ALM_clave},datos,
		      		function (data){
		      			mensajes.alerta(data.respuesta,'success','top right','done_all');
		      		}
		      	);

		    });
		};

	}

	function almacenCtrl($scope,$mdDialog,busqueda,almacenes,mensajes){

		busqueda.unidades().then(function (info){
			$scope.unidades = info.data;
		});

		busqueda.tiposAlmacen().then(function (info){
			$scope.tiposalmacen = info.data;
		});

		$scope.inicio = function(){
			$scope.datos = {
				nombre:'',
				observaciones:'',
				ubicacion:'',
				tipo:'',
				unidad:'',
				activo:true
			}

			$scope.guardando = false;
		}

		$scope.guardar = function(){

			if ($scope.almacenForm.$valid) {

				$scope.guardando = true;
				almacenes.save($scope.datos,function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.almacenForm.$setPristine();
					$scope.inicio();
				});

			};
			
		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

	function almacenEditCtrl($scope,$mdDialog,almacenes,mensajes,informacion,busqueda){

		busqueda.unidades().then(function (info){
			$scope.unidades = info.data;
		});

		busqueda.tiposAlmacen().then(function (info){
			$scope.tiposalmacen = info.data;
		});

		$scope.inicio = function(){

			$scope.datos = {
				nombre:informacion.ALM_nombre,
				observaciones:informacion.ALM_observaciones,
				ubicacion:informacion.ALM_ubicacion,
				tipo:informacion.TAL_clave,
				unidad:informacion.UNI_clave,
				activo:informacion.ALM_activo ? true:false
			}

			$scope.guardando = false;
		}

		$scope.guardar = function(){


			if ($scope.almacenForm.$valid) {

				$scope.guardando = true;
				almacenes.update({almacen:informacion.ALM_clave},$scope.datos,function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.almacenForm.$setPristine();
				});

			};
			
		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

})();