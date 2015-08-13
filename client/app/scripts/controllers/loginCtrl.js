app.controller('loginCtrl',loginCtrl)

function loginCtrl(auth, $rootScope){

	var sesion = this;
	$rootScope.cargando = false;
	$rootScope.tema = 'theme1';

	sesion.inicio = function(){
		sesion.datos = {
			usuario:'',
			psw:'',
			guardar:false
		}
	}

	sesion.login = function(){
		$rootScope.cargando = true;
		auth.login(sesion.datos);
	}

}