"use strict"

app.controller('tipoAlmacenCtrl',tipoAlmacenCtrl)
app.controller('tiposAlmacenCtrl',tiposAlmacenCtrl)
app.controller('tipoAlmacenEditCtrl',tipoAlmacenEditCtrl)

tiposAlmacenCtrl.$inject = ['$rootScope','$mdDialog','datos','tiposalmacen','mensajes'];
tipoAlmacenCtrl.$inject = ['$scope','$mdDialog','tiposalmacen','mensajes'];
tipoAlmacenEditCtrl.$inject = ['$scope','$mdDialog','tiposalmacen','mensajes','informacion'];

function tiposAlmacenCtrl($rootScope,$mdDialog,datos,tiposalmacen,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Tipos de Almacen Registrados';
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
	      controller: tipoAlmacenCtrl,
	      templateUrl: 'views/tipoalmacen.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false
	    }).then(
	    function(){
	    	scope.info = tiposalmacen.query();
	    });
	};

	scope.edita = function(ev,index) {

		var tipoalmacen = scope.info[index];

	    $mdDialog.show({
	      controller: tipoAlmacenEditCtrl,
	      templateUrl: 'views/tipoalmacen.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {informacion: tipoalmacen },
	      closeTo:{bottom: 1500}
	    }).then(
	    function(){
	    	scope.info = tiposalmacen.query();
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
	          .targetEvent(ev)
	          .closeTo({
				bottom: 1500
			   });

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

	      	tiposalmacen.update({tipoalmacen:tipoalmacen.TAL_clave},datos,
	      		function (data){
	      			mensajes.alerta(data.respuesta,'success','top right','done_all');
	      		}
	      	);

	    });
	};

}

function tipoAlmacenCtrl($scope,$mdDialog,tiposalmacen,mensajes){

	$scope.tiposalmacen = tiposalmacen.query();

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
			tiposalmacen.save($scope.datos,function (data){
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

function tipoAlmacenEditCtrl($scope,$mdDialog,tiposalmacen,mensajes,informacion){

	$scope.inicio = function(){

		$scope.datos = {
			nombre : informacion.TAL_nombre,
			activo : informacion.TAL_activo ? true:false
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){


		if ($scope.tipoAlmacenForm.$valid) {

			$scope.guardando = true;
			tiposalmacen.update({tipoalmacen:informacion.TAL_clave},$scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.tipoAlmacenForm.$setPristine();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

