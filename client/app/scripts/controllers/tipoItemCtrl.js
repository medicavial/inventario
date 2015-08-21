"use strict"

app.controller('tipoItemCtrl',tipoItemCtrl)
app.controller('tiposItemCtrl',tiposItemCtrl)
app.controller('tipoItemEditCtrl',tipoItemEditCtrl)

tiposItemCtrl.$inject = ['$rootScope','$mdDialog','datos','tipositem','mensajes'];
tipoItemCtrl.$inject = ['$scope','$mdDialog','tipositem','mensajes'];
tipoItemEditCtrl.$inject = ['$scope','$mdDialog','tipositem','mensajes','informacion'];

function tiposItemCtrl($rootScope,$mdDialog,datos,tipositem,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Tipos de Item Registrados';
	scope.info = datos;
	scope.total = 0;
	scope.limit = 10;
	scope.page = 1;
	scope.texto = {
      text: 'Tipos por pagina:',
      of: 'de'
    };
	scope.paginacion = [10,20,30,40];

	scope.nuevoTipo = function(ev) {
	    $mdDialog.show({
	      controller: tipoItemCtrl,
	      templateUrl: 'views/tipoitem.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true
	    }).then(
	    function(){
	    	scope.info = tipositem.query();
	    });
	};

	scope.editaTipo = function(ev,index) {

		var tipoitem = scope.info[index];

	    $mdDialog.show({
	      controller: tipoItemEditCtrl,
	      templateUrl: 'views/tipoitem.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {informacion: tipoitem }
	    }).then(
	    function(){
	    	scope.info = tipositem.query();
	    });
	};

	scope.confirmacion = function(ev,index) {
	    // Abre ventana de confirmacion

	    // console.log(index);
	    var tipoitem = scope.info[index];

	    var confirm = $mdDialog.confirm()
	          .title('¿Desactivar el Tipo de item?')
	          .content('Puedes activarlo cuando lo necesites nuevamente')
	          .ariaLabel('Desactivar permiso')
	          .ok('Si')
	          .cancel('No')
	          .targetEvent(ev);

	    $mdDialog.show(confirm).then(function() {

	    	//en caso de decir SI
	    	if (tipoitem.TIT_activo) {
	      		tipoitem.TIT_activo = 0;
	    	}else{
	    		tipoitem.TIT_activo = 1;
	    	}

	      	var datos = {
	      		nombre : tipoitem.TIT_nombre,
				activo : tipoitem.TIT_activo
			}

	      	tipositem.update({tipoitem:tipoitem.TIT_clave},datos,
	      		function (data){
	      			mensajes.alerta(data.respuesta,'success','top right','done_all');
	      		}
	      	);

	    });
	};

}

function tipoItemCtrl($scope,$mdDialog,tipositem,mensajes){

	$scope.tipositem = tipositem.query();

	$scope.inicio = function(){
		$scope.datos = {
			nombre:'',
			activo:true
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){

		if ($scope.perfilForm.$valid) {

			$scope.guardando = true;
			tipositem.save($scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.perfilForm.$setPristine();
				$scope.inicio();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

function tipoItemEditCtrl($scope,$mdDialog,tipositem,mensajes,informacion){

	$scope.inicio = function(){

		$scope.datos = {
			nombre : informacion.TIT_nombre,
			activo : informacion.TIT_activo ? true:false
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){


		if ($scope.perfilForm.$valid) {

			$scope.guardando = true;
			tipositem.update({tipoitem:informacion.TIT_clave},$scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.perfilForm.$setPristine();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

