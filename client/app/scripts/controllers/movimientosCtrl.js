"use strict"

app.controller('movimientoCtrl',movimientoCtrl)
app.controller('movimientosCtrl',movimientosCtrl)

movimientosCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','mensajes'];
movimientoCtrl.$inject = ['$scope','$rootScope','$mdDialog','busqueda','operacion','mensajes','$q','$filter'];


function movimientosCtrl($rootScope,$mdDialog,datos,busqueda,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Movimientos Registrados';
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
	      controller: movimientoCtrl,
	      templateUrl: 'views/movimiento.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false
	    }).then(function(){
	    	busqueda.movimientos().success(function (data){
	    		scope.info = data;
	    	});
	    });
	};

}


function movimientoCtrl($scope,$rootScope,$mdDialog,busqueda,operacion,mensajes,$q,$filter){

	busqueda.items().then(function (info){
		$scope.items = info.data;
	});

	busqueda.almacenes().then(function (info){
		$scope.almacenes = info.data;
	});

	busqueda.tiposMovimiento().then(function (info){
		$scope.tiposmovimiento = info.data;
	});

	busqueda.tiposAjuste().then(function (info){
		$scope.tiposajuste = info.data;
	});

	$scope.inicio = function(){

		$scope.busqueda = null;
	    $scope.consultado = consultado;
	    $scope.item = '';

		$scope.datos = {
			item:'',
			cantidad:'',
			tipomov:'',
			tipoa:'',
			orden:'',
			usuario:$rootScope.id,
			observaciones:''
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){

		if ($scope.movimientoForm.$valid && $scope.item) {
		
			$scope.datos.item = $scope.item.ITE_clave;

			console.log($scope.datos);
			$scope.guardando = true;
			operacion.altaMovimiento($scope.datos).success(function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.movimientoForm.$setPristine();
				$scope.inicio();
			});

		};
		
	}

	$scope.verificaForm = function(){

		if ($scope.datos.tipomov == 1 && $scope.datos.tipoa == '') {
			return true;
		}else if($scope.movimientoForm.$invalid){
			return true;
		}else if ($scope.guardando) {
			return true;
		}else{
			return false;
		}
	}

	function consultado(query) {

		var q = $q.defer();

		findValues( query, $scope.items ).then( function ( res ) {
			q.resolve( res );
		} );
		return q.promise;
    }

    function findValues ( query, obj ) {

		var deferred = $q.defer();
		deferred.resolve( $filter( 'filter' )( obj, query ) );
		return deferred.promise;

	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

