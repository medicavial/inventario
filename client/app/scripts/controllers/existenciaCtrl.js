"use strict"


app.controller('existenciasCtrl',existenciasCtrl)
app.controller('traspasoCtrl',traspasoCtrl)

existenciasCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','mensajes'];
traspasoCtrl.$inject = ['$scope','$rootScope','$mdDialog','busqueda','operacion','mensajes','datos','$filter','$q'];



function existenciasCtrl($rootScope,$mdDialog,datos,busqueda,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Existencias';
	scope.info = datos.data;
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

	scope.traspasar = function(ev,almacen,item) {

		var datos = {almacen:almacen,item:item};

	    $mdDialog.show({
	      controller: traspasoCtrl,
	      templateUrl: 'views/traspaso.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false,
	      locals: {informacion: datos }
	    }).then(function(){
	    	busqueda.existencias($rootScope.id).success(function (data){
	    		scope.info = data;
	    	});
	    });
	};

}

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

		$scope.seleccionado = null;
	    $scope.busqueda = null;
	    $scope.disponible = '';

		busqueda.itemsAlmacen(clave).success(function (data){
			$scope.itemsAlmacen = data;
		});

	}

	$scope.seleccionaItem = function(item){
		// $scope.disponible = '';
		console.log(item);
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
      console.log('Text changed to ' + text);
    }

    function consultado(query) {

		var q = $q.defer(),
			response = query ? $filter( 'filter' )( $scope.itemsAlmacen, query ) : $scope.itemsAlmacen;
			q.resolve( response );

		return q.promise;
    }



}
