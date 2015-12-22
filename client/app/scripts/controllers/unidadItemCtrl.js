"use strict"

app.controller('unidadItemCtrl',unidadItemCtrl)
app.controller('unidadesItemCtrl',unidadesItemCtrl)
app.controller('unidadItemEditCtrl',unidadItemEditCtrl)

unidadesItemCtrl.$inject = ['$rootScope','$mdDialog','datos','unidadesItem','mensajes'];
unidadItemCtrl.$inject = ['$scope','$mdDialog','unidadesItem','mensajes'];
unidadItemEditCtrl.$inject = ['$scope','$mdDialog','unidadesItem','mensajes','informacion'];

function unidadesItemCtrl($rootScope,$mdDialog,datos,unidadesItem,mensajes){

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

	scope.nuevaUnidad = function(ev) {
	    $mdDialog.show({
	      controller: unidadItemCtrl,
	      templateUrl: 'views/unidaditem.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true
	    }).then(
	    function(){
	    	scope.info = unidadesItem.query();
	    });
	};

	scope.editaTipo = function(ev,index) {

		var unidaditem = scope.info[index];

	    $mdDialog.show({
	      controller: unidadItemEditCtrl,
	      templateUrl: 'views/unidaditem.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {informacion: unidaditem },
	      closeTo:{bottom: 1500}
	    }).then(
	    function(){
	    	scope.info = unidadesItem.query();
	    });
	};

	scope.confirmacion = function(ev,index) {
	    // Abre ventana de confirmacion

	    // console.log(index);
	    var unidaditem = scope.info[index];

	    var confirm = $mdDialog.confirm()
	          .title('¿Desactivar el Tipo de item?')
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
	    	if (unidaditem.UTI_activo) {
	      		unidaditem.UTI_activo = 0;
	    	}else{
	    		unidaditem.UTI_activo = 1;
	    	}

	      	var datos = {
	      		nombre : unidaditem.UTI_nombre,
				activo : unidaditem.UTI_activo
			}

	      	unidadesItem.update({id:unidaditem.UTI_clave},datos,
	      		function (data){
	      			mensajes.alerta(data.respuesta,'success','top right','done_all');
	      		}
	      	);

	    });
	};

}

function unidadItemCtrl($scope,$mdDialog,unidadesItem,mensajes){

	$scope.unidadesItem = unidadesItem.query();

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
			unidadesItem.save($scope.datos,function (data){
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

function unidadItemEditCtrl($scope,$mdDialog,unidadesItem,mensajes,informacion){

	$scope.inicio = function(){

		$scope.datos = {
			nombre : informacion.UTI_nombre,
			activo : informacion.UTI_activo ? true:false
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){


		if ($scope.perfilForm.$valid) {

			$scope.guardando = true;
			unidadesItem.update({id:informacion.UTI_clave},$scope.datos,function (data){
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

