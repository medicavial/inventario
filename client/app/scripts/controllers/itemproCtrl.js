app.controller('itemproCtrl',itemproCtrl)

function itemproCtrl($rootScope,datos,$mdDialog,busqueda,operacion){

	var scope = this;

	$rootScope.titulo = 'Conexiones';
	$rootScope.cargando = false;
	$rootScope.tema = 'theme1';
	scope.items = datos.data;

	scope.inicio = function(){

		scope.total = 0;
		scope.limit = 10;
		scope.page = 1;

	}

	
	scope.nuevo = function(ev) {

	    $mdDialog.show({
	      controller: nuevoItemproCtrl,
	      templateUrl: 'views/altaitempro.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false
	    }).then(function(){
	    	busqueda.itemsProveedor().success(function (data){
	    		scope.items = data;
	    	});
	    });

	};

	scope.confirma = function(ev,index,almacen) {
	    // Abre ventana de confirmacion

	    var usuario = scope.usuarios[index];

	    var confirm = $mdDialog.confirm()
	          .title('¿Seguro que deseas asignar este almacen?')
	          .content('')
	          .ariaLabel('Asignar Almacen')
	          .ok('Si')
	          .cancel('No')
	          .targetEvent(ev);

	    $mdDialog.show(confirm).then(
		    function() {
		    	// console.log(usuario.clave);
		    	// console.log(almacen.ALM_clave);
		    	operacion.bajaAlmacen(almacen.ALM_clave,usuario.clave);
		    },
		    function() {
		    	busqueda.usuariosAlmacen().success(function(data){
		    		scope.items = data;
		    	});
		    }
	    );
	};

}

function nuevoItemproCtrl($scope,$mdDialog,busqueda,mensajes,$q,$filter,operacion,$rootScope){

	busqueda.proveedores().then(function (info){
		$scope.proveedores = info.data;
	});

	busqueda.items().then(function (info){
		$scope.items = info.data;
	});

	$scope.inicio = function(){
		$scope.seleccionado = null;
	    $scope.busqueda = null;
	    $scope.consultado = consultado;
	    $scope.datos = {
	    	usuarioasigno:$rootScope.id,
	    	item:'',
	    	proveedor:'',
	    	cantidad:''
	    }

		$scope.guardando = false;
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

	$scope.guardar = function(){
			console.log($scope.datos);
			$scope.guardando = true;

			operacion.altaItempro($scope.datos).success(function (data){

				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.inicio();

			}).error(function (error){

			});

	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}