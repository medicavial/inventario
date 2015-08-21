"use strict"


app.controller('existenciasCtrl',existenciasCtrl)
app.controller('traspasoCtrl',traspasoCtrl)

existenciasCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','mensajes'];
traspasoCtrl.$inject = ['$scope','$rootScope','$mdDialog','busqueda','operacion','mensajes','informacion'];



function existenciasCtrl($rootScope,$mdDialog,datos,busqueda,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Existencias en almacen(es)';
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

function traspasoCtrl($scope,$rootScope,$mdDialog,busqueda,operacion,mensajes,informacion){

	busqueda.items().then(function (info){
		$scope.items = info.data;
	});


	busqueda.almacenesUsuario($rootScope.id).then(function (info){
		$scope.almacenes = info.data;
	});

	console.log(informacion);

	$scope.inicio = function(){

		$scope.disponible = informacion.item.EXI_cantidad;

		$scope.datos = {
			almacenOrigen:informacion.almacen,
			almacenDestino:'',
			item:informacion.item.ITE_clave,
			cantidad:'',
			usuario:$rootScope.id
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){

		if ($scope.traspasoForm.$valid) {

			console.log($scope.datos);
			$scope.guardando = true;
			operacion.altaTraspaso($scope.datos).success(function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.traspasoForm.$setPristine();
				$scope.inicio();
			});

		};
		
	}

	$scope.verificaAlmacen = function(ev){
		if ($scope.datos.almacenDestino == $scope.datos.almacenOrigen) {
			alert('No puedes seleccionar el mismo almacen');
			$scope.datos.almacenDestino = '';
		};
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}
