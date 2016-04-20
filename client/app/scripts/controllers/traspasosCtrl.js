(function(){


	'use strict';

	angular.module('app')
	.controller('traspasoCtrl',traspasoCtrl)

	traspasoCtrl.$inject = ['$scope','$rootScope','$mdDialog','busqueda','operacion','mensajes','datos','$filter','$q'];

	function traspasoCtrl($scope,$rootScope,$mdDialog,busqueda,operacion,mensajes,datos,$filter,$q){

		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Nuevo traspaso';

		$scope.almacenes = datos[0].data;

		$scope.inicio = function(){

			$scope.seleccionado = null;
		    $scope.busqueda = null;
		    $scope.consultado = consultado;
		    $scope.item = '';
		    $scope.disponible = '';
		    $scope.itemsAlmacen = [];

			$scope.datos = {
				almacenOrigen:'',
				almacenDestino:'',
				item:'',
				cantidad:'',
				usuario:$rootScope.id
			}

			$scope.guardando = false;

		}

		$scope.guardar = function(){

			// console.log($scope.datos);
			if ($scope.traspasoForm.$valid) {

				// console.log($scope.datos);
				$scope.guardando = true;
				operacion.altaTraspaso($scope.datos).success(function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.traspasoForm.$setPristine();
					$scope.inicio();
				});

			};
			
		}

		$scope.itemsxalmacen = function(clave){

			// console.log(clave);
			
			$scope.seleccionado = null;
		    $scope.busqueda = null;
		    $scope.disponible = '';

			busqueda.itemsAlmacen(clave).success(function (data){
				$scope.itemsAlmacen = data;
			});

		}

		$scope.seleccionaItem = function(item){
			// $scope.disponible = '';
			// console.log(item);
			if (item) {
				$scope.datos.item = item.ITE_clave;
				$scope.disponible = Number(item.EXI_cantidad);
			};
		}

		$scope.verificaAlmacen = function(ev){
			if ($scope.datos.almacenDestino == $scope.datos.almacenOrigen) {
				alert('No puedes seleccionar el mismo almacen');
				$scope.datos.almacenDestino = '';
			};
		}

		function cambioTexto(text) {
	      // console.log('Text changed to ' + text);
	    }

	    function consultado(query) {

			var q = $q.defer(),
				response = query ? $filter( 'filter' )( $scope.itemsAlmacen, query ) : $scope.itemsAlmacen;
				q.resolve( response );

			return q.promise;
	    }

	}

})();