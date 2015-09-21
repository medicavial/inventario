app.controller('configuracionCtrl',configuracionCtrl)


configuracionCtrl.$inject = ['$scope','$rootScope','$mdDialog','busqueda','operacion'];


function configuracionCtrl($scope,$rootScope,$mdDialog,busqueda,operacion){

	var scope = this;

	$rootScope.titulo = 'Configuración';
	$rootScope.cargando = false;
	$rootScope.tema = 'theme1';

	scope.correos = [];
	scope.critico = 10;
	scope.compra = 40;
	scope.maxima = 90;

}
