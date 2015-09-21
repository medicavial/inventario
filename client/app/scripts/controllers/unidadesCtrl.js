"use strict"

app.controller('unidadCtrl',unidadCtrl)
app.controller('unidadesCtrl',unidadesCtrl)
app.controller('unidadEditCtrl',unidadEditCtrl)

unidadesCtrl.$inject = ['$rootScope','$mdDialog','datos','unidades','mensajes'];
unidadCtrl.$inject = ['$scope','$mdDialog','unidades','mensajes'];
unidadEditCtrl.$inject = ['$scope','$mdDialog','unidades','mensajes','informacion'];

function unidadesCtrl($rootScope,$mdDialog,datos,unidades,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Unidades Registradas';
	scope.info = datos;
	scope.total = 0;
	scope.limit = 10;
	scope.page = 1;
	scope.texto = {
      text: 'Tipos por pagina:',
      of: 'de'
    };
	scope.paginacion = [10,20,30,40];

	scope.nuevo = function(ev) {
	    $mdDialog.show({
	      controller: unidadCtrl,
	      templateUrl: 'views/unidad.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false
	    }).then(
	    function(){
	    	scope.info = unidades.query();
	    });
	};

	scope.edita = function(ev,index) {

		var tipoalmacen = scope.info[index];

	    $mdDialog.show({
	      controller: unidadEditCtrl,
	      templateUrl: 'views/tipoalmacen.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {informacion: tipoalmacen }
	    }).then(
	    function(){
	    	scope.info = unidades.query();
	    });
	};

	scope.confirmacion = function(ev,index) {
	    // Abre ventana de confirmacion

	    // console.log(index);
	    var tipoalmacen = scope.info[index];

	    var confirm = $mdDialog.confirm()
	          .title('¿Desactivar el Tipo de almacen?')
	          .content('Puedes activarlo cuando lo necesites nuevamente')
	          .ariaLabel('Desactivar permiso')
	          .ok('Si')
	          .cancel('No')
	          .targetEvent(ev);

	    $mdDialog.show(confirm).then(function() {

	    	//en caso de decir SI
	    	if (tipoalmacen.TAL_activo) {
	      		tipoalmacen.TAL_activo = 0;
	    	}else{
	    		tipoalmacen.TAL_activo = 1;
	    	}

	      	var datos = {
	      		nombre : tipoalmacen.TAL_nombre,
				activo : tipoalmacen.TAL_activo
			}

	      	unidades.update({tipoalmacen:tipoalmacen.TAL_clave},datos,
	      		function (data){
	      			mensajes.alerta(data.respuesta,'success','top right','done_all');
	      		}
	      	);

	    });
	};

}

function unidadCtrl($scope,$mdDialog,unidades,mensajes){

	$scope.unidades = unidades.query();

	$scope.inicio = function(){
		$scope.datos = {
			nombre:'',
			activo:true
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){

		if ($scope.tipoAlmacenForm.$valid) {

			$scope.guardando = true;
			unidades.save($scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.tipoAlmacenForm.$setPristine();
				$scope.inicio();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

function unidadEditCtrl($scope,$mdDialog,unidades,mensajes,informacion){

	$scope.inicio = function(){

		$scope.datos = {
			nombre : informacion.TAL_nombre,
			activo : informacion.TAL_activo ? true:false
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){


		if ($scope.tipoAlmacenForm.$valid) {

			// $scope.guardando = true;
			// unidades.update({tipoalmacen:informacion.TAL_clave},$scope.datos,function (data){
			// 	mensajes.alerta(data.respuesta,'success','top right','done_all');
			// 	$scope.guardando = false;
			// 	$scope.tipoAlmacenForm.$setPristine();
			// });

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

