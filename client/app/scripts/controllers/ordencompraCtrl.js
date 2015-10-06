"use strict"

app.controller('ordenCompraCtrl',ordenCompraCtrl)
app.controller('ordenesCompraCtrl',ordenesCompraCtrl)

ordenesCompraCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','mensajes'];
ordenCompraCtrl.$inject = ['$scope','$rootScope','operacion','mensajes','datos'];


function ordenesCompraCtrl($rootScope,$mdDialog,datos,busqueda,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Ordenes Registrados';
	scope.info = datos.data;
	scope.total = 0;
	scope.limit = 10;
	scope.page = 1;
	scope.texto = {
      text: 'Movimientos por pagina:',
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
	      controller: ordenCompraCtrl,
	      templateUrl: 'views/ordencompra.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false
	    }).then(function(){
	    	busqueda.ordenescompra().success(function (data){
	    		scope.info = data;
	    	});
	    });
	};

}


function ordenCompraCtrl($scope,$rootScope,operacion,mensajes,datos){

	$scope.paso1 = 'views/ordenPaso1.html';
	$scope.paso2 = 'views/ordenPaso2.html';

	$scope.step2block = true;
	$scope.step3block = true;

	$scope.selectedIndex = 0;
	$scope.unidades = datos.data;
	$scope.unidad = '';
	// $scope.selected = [];

	$scope.seleccionItems = [];
	// $scope.seleccionOrden = [];

	$scope.info = function(unidad){

		$scope.selected = [];
		$scope.items = [];
		$scope.almacenes = '';
		$scope.unidad = unidad;

		operacion.infoUnidad(unidad).then(
			function (data){

				$scope.almacenes = data[0].data;
				$scope.items = data[1].data;

				angular.forEach(data[0].data, function(value, key) {
					$scope.selected.push(value);
				});
			},
			function (error){
				alert(error);
			}
		);
	};


	$scope.muestraItems = function(datos){
		operacion.itemsAlmacenes($scope.unidad,datos).success(function (data){
			$scope.items = data;
		});
	};

	$scope.toggle = function (item, list) {
		var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
        $scope.muestraItems(list);
	};

	$scope.exists = function (item, list) {
		return list.indexOf(item) > -1;
	};


	$scope.muestraSemaforo = function(existencia,nivelMinimo,nimvelCompra){
		if (existencia == nivelMinimo || existencia < nivelMinimo) {
			return 'bgm-red';
		}else if(existencia > nivelMinimo && existencia < nimvelCompra || existencia == nimvelCompra){
			return 'bgm-yellow';
		}else if(existencia > nimvelCompra){
			return 'bgm-green';
		}
	}	

	$scope.ir2 = function(selecciones){
		
		$scope.seleccionOrden = [];

		operacion.proveedoresItems(selecciones).success(function (data){
			$scope.ordenItems = data;
			$scope.selectedIndex = 1;
			$scope.step2block = false;
			angular.forEach(data, function(value, key) {
				angular.forEach(value.proveedores, function(value, key) {
					if (key == 0) {
						$scope.seleccionOrden.push(value);
					};
				});
			});
		});
	}


	$scope.cambio = function (item, list) {
		var id2x = list.indexOf(item);
        if (id2x > -1){
        	list.splice(id2x, 1);
        } else{
        	list.push(item);
        }
	};

	$scope.existeEnOrden = function (item, list) {
		return list.indexOf(item) > -1;
	};

}

