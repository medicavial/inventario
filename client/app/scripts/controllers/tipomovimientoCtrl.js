"use strict"

app.controller('tipoMovimientoCtrl',tipoMovimientoCtrl)
app.controller('tiposMovimientoCtrl',tiposMovimientoCtrl)
app.controller('tipoMovimientoEditCtrl',tipoMovimientoEditCtrl)

tiposMovimientoCtrl.$inject = ['$rootScope','$mdDialog','datos','tiposmovimiento','mensajes'];
tipoMovimientoCtrl.$inject = ['$scope','$mdDialog','tiposmovimiento','mensajes'];
tipoMovimientoEditCtrl.$inject = ['$scope','$mdDialog','tiposmovimiento','mensajes','informacion'];


function tiposMovimientoCtrl($rootScope,$mdDialog,datos,tiposmovimiento,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Tipos de Movmiento';
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
	      controller: tipoMovimientoCtrl,
	      templateUrl: 'views/tipomovimiento.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false
	    }).then(function(){
	    	scope.info = tiposmovimiento.query();
	    });
	};

	scope.edita = function(ev,index) {

		var usuario = scope.info[index];

	    $mdDialog.show({
	      controller: tipoMovimientoEditCtrl,
	      templateUrl: 'views/tipomovimiento.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {informacion: usuario }
	    }).then(function(){
	    	scope.info = tiposmovimiento.query();
	    });
	};

	scope.confirmacion = function(ev,index) {
	    // Abre ventana de confirmacion

	    // console.log(index);
	    var tipomovimiento = scope.info[index];

	    var confirm = $mdDialog.confirm()
	          .title('¿Desactivar el tipo de movimiento?')
	          .content('Puedes activarlo cuando lo necesites nuevamente')
	          .ariaLabel('Desactivar Tipo Movimiento')
	          .ok('Si')
	          .cancel('No')
	          .targetEvent(ev);

	    $mdDialog.show(confirm).then(function() {

	    	//en caso de decir SI
	    	if (tipomovimiento.TIM_activo) {
	      		tipomovimiento.TIM_activo = 0;
	    	}else{
	    		tipomovimiento.TIM_activo = 1;
	    	}

	      	var datos = {
				nombre:tipomovimiento.TIM_nombre,
				activo:tipomovimiento.TIM_activo
			}

	      	tiposmovimiento.update({tipo:tipomovimiento.TIM_clave},datos,
	      		function (data){
	      			mensajes.alerta(data.respuesta,'success','top right','done_all');
	      		}
	      	);

	    });
	};

}


function tipoMovimientoCtrl($scope,$mdDialog,tiposmovimiento,mensajes){


	$scope.inicio = function(){
		$scope.datos = {
			nombre:'',
			activo:true
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){

		if ($scope.tipoMovForm.$valid) {

			$scope.guardando = true;
			tiposmovimiento.save($scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.tipoMovForm.$setPristine();
				$scope.inicio();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

function tipoMovimientoEditCtrl($scope,$mdDialog,tiposmovimiento,mensajes,informacion){

	$scope.inicio = function(){

		$scope.datos = {
			nombre:informacion.TIM_nombre,
			activo:informacion.TIM_activo ? true:false
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){


		if ($scope.tipoMovForm.$valid) {

			$scope.guardando = true;
			tiposmovimiento.update({tipo:informacion.TIM_clave},$scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.tipoMovForm.$setPristine();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}