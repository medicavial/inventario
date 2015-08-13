"use strict"

app.controller('usuarioCtrl',usuarioCtrl)
app.controller('usuariosCtrl',usuariosCtrl)
app.controller('usuarioEditCtrl',usuarioEditCtrl)

function usuariosCtrl($rootScope,$mdDialog,datos,usuarios,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Usuarios Registrados';
	scope.info = datos;

	scope.nuevoUsuario = function(ev) {
	    $mdDialog.show({
	      controller: usuarioCtrl,
	      templateUrl: 'views/usuario.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true
	    }).then(
	    function(){
	    	scope.info = usuarios.query();
	    });
	};

	scope.editaUsuario = function(ev,index) {

		var usuario = scope.info[index];

	    $mdDialog.show({
	      controller: usuarioEditCtrl,
	      templateUrl: 'views/usuarioEdicion.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {informacion: usuario }
	    }).then(
	    function(){
	    	scope.info = usuarios.query();
	    });
	};

	scope.confirmacion = function(ev,index) {
	    // Abre ventana de confirmacion

	    // console.log(index);
	    var usuario = scope.info[index];

	    var confirm = $mdDialog.confirm()
	          .title('¿Desactivar el usuario?')
	          .content('Puedes activarlo cuando lo necesites nuevamente')
	          .ariaLabel('Desactivar usuario')
	          .ok('Si')
	          .cancel('No')
	          .targetEvent(ev);

	    $mdDialog.show(confirm).then(function() {

	    	//en caso de decir SI
	    	if (usuario.USU_activo) {
	      		usuario.USU_activo = 0;
	    	}else{
	    		usuario.USU_activo = 1;
	    	}

	      	var datos = {
				nombre:usuario.USU_nombrecompleto,
				usuario:usuario.USU_login,
				perfil:usuario.PER_clave,
				activo:usuario.USU_activo
			}

	      	usuarios.update({usuario:usuario.USU_clave},datos,
	      		function (data){
	      			mensajes.alerta(data.respuesta,'success','top right','done_all');
	      		}
	      	);

	    });
	};

}


function usuarioCtrl($scope,$mdDialog,permisos,usuarios,mensajes){

	$scope.permisos = permisos.query();

	$scope.inicio = function(){
		$scope.datos = {
			nombre:'',
			usuario:'',
			psw:'',
			psw2:'',
			perfil:'',
			activo:true
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){

		if ($scope.usuarioForm.$valid) {

			$scope.guardando = true;
			usuarios.save($scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.usuarioForm.$setPristine();
				$scope.inicio();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

function usuarioEditCtrl($scope,$mdDialog,permisos,usuarios,mensajes,informacion){

	$scope.permisos = permisos.query();

	$scope.inicio = function(){

		$scope.datos = {
			nombre:informacion.USU_nombrecompleto,
			usuario:informacion.USU_login,
			psw:'',
			psw2:'',
			perfil:informacion.PER_clave,
			activo:informacion.USU_activo ? true:false
		}

		$scope.nuevopsw = false;
		$scope.guardando = false;
	}

	$scope.guardar = function(){


		if ($scope.usuarioForm.$valid) {

			$scope.guardando = true;
			usuarios.update({usuario:informacion.USU_clave},$scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.usuarioForm.$setPristine();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}