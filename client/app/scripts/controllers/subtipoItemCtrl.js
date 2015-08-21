"use strict"

app.controller('subTipoItemCtrl',subTipoItemCtrl)
app.controller('subTiposItemCtrl',subTiposItemCtrl)
app.controller('subTipoItemEditCtrl',subTipoItemEditCtrl)

subTiposItemCtrl.$inject = ['$rootScope','$mdDialog','datos','subtipositem','mensajes'];
subTipoItemCtrl.$inject = ['$scope','$mdDialog','busqueda','subtipositem','mensajes'];
subTipoItemEditCtrl.$inject = ['$scope','$mdDialog','subtipositem','mensajes','informacion','busqueda'];

function subTiposItemCtrl($rootScope,$mdDialog,datos,subtipositem,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'SubTipos de Item Registrados';
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
	      controller: subTipoItemCtrl,
	      templateUrl: 'views/subtipoitem.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false
	    }).then(
	    function(){
	    	scope.info = subtipositem.query();
	    });
	};

	scope.editaTipo = function(ev,index) {

		var subtipoitem = scope.info[index];

	    $mdDialog.show({
	      controller: subTipoItemEditCtrl,
	      templateUrl: 'views/subtipoitem.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {informacion: subtipoitem }
	    }).then(
	    function(){
	    	scope.info = subtipositem.query();
	    });
	};

	scope.confirmacion = function(ev,index) {
	    // Abre ventana de confirmacion

	    // console.log(index);
	    var subtipoitem = scope.info[index];

	    var confirm = $mdDialog.confirm()
	          .title('¿Desactivar el Tipo de item?')
	          .content('Puedes activarlo cuando lo necesites nuevamente')
	          .ariaLabel('Desactivar permiso')
	          .ok('Si')
	          .cancel('No')
	          .targetEvent(ev);

	    $mdDialog.show(confirm).then(function() {

	    	//en caso de decir SI
	    	if (subtipoitem.STI_activo) {
	      		subtipoitem.STI_activo = 0;
	    	}else{
	    		subtipoitem.STI_activo = 1;
	    	}

	      	var datos = {
	      		nombre : subtipoitem.STI_nombre,
				activo : subtipoitem.STI_activo
			}

	      	subtipositem.update({subtipoitem:subtipoitem.STI_clave},datos,
	      		function (data){
	      			mensajes.alerta(data.respuesta,'success','top right','done_all');
	      		}
	      	);

	    });
	};

}

function subTipoItemCtrl($scope,$mdDialog,subtipositem,mensajes){

	$scope.subtipositem = subtipositem.query();

	$scope.inicio = function(){
		$scope.datos = {
			nombre:'',
			activo:true
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){

		if ($scope.subtipoForm.$valid) {

			$scope.guardando = true;
			subtipositem.save($scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.subtipoForm.$setPristine();
				$scope.inicio();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

function subTipoItemEditCtrl($scope,$mdDialog,subtipositem,mensajes,informacion,busqueda){

	console.log(informacion)
	$scope.inicio = function(){

		$scope.datos = {
			nombre : informacion.STI_nombre,
			activo : informacion.STI_activo ? true:false
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){


		if ($scope.subtipoForm.$valid) {

			$scope.guardando = true;
			subtipositem.update({subtipoitem:informacion.STI_clave},$scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.subtipoForm.$setPristine();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

