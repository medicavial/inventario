app.controller('recetaCtrl',recetaCtrl)

recetaCtrl.$inject = ['$scope','$rootScope'];

function recetaCtrl($scope, $rootScope){

	var scope = this;
	$rootScope.cargando = false;
	$rootScope.tema = 'theme1';

	scope.inicio = function(){
		scope.datos = {
			usuario:'',
			psw:'',
			guardar:false
		}
	}

}