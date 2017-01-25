(function(){

	'use strict';

	angular.module('app')
	.controller('pruebaSECtrl',pruebaSECtrl)
	.controller('pruebaDialogoCtrl',pruebaSECtrl)

	pruebaSECtrl.$inject = ['$rootScope','$scope','$mdDialog','busqueda'];
	pruebaDialogoCtrl.$inject = ['$rootScope','$scope','$mdDialog','busqueda'];

	function pruebaSECtrl($rootScope,$scope,$mdDialog,busqueda){

		var pruebaSE = this;

		$rootScope.tema = 'theme4';
		$rootScope.titulo = 'Pruebas de maquetación';
		$rootScope.mostrarDatos=false;
		$scope.infoA=false;
		$scope.infoB=false;
		$scope.infoC=false;
		$scope.cliente={
			nombreCompleto: null,
			nombre: null,
			aPaterno: null,
			aMaterno: null,
			telefono: null,
			email: null,
			domicilio: null,
		};

		pruebaSE.total=0;
		pruebaSE.limit=10;
		pruebaSE.page=1;
		pruebaSE.texto={
			text:'Clientes por página:',
			of: 'de'
		};
		pruebaSE.paginacion=[10,20,30,40];

		pruebaSE.inicio = function () {
			console.log('Bienvenido a pruebaSE');
		};

		pruebaSE.abreModal = function (ev) {
			console.log('Dialogo abierto');

			$mdDialog.show({
				controller: pruebaDialogoCtrl,
				templateUrl: 'views/pruebaDialogo.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false
			})
		};
	}

	function pruebaDialogoCtrl($rootScope,$scope,$mdDialog,busqueda){
		var pruebaDialogo = this;

		$scope.datos={
			usuario: $rootScope.username,
			password: null,
		};

		$scope.psdConfirmacion='';

		$scope.cerrarDialogo = function(){
			$mdDialog.cancel();
			console.log('Dialogo cerrado');
		};

		$scope.mostrarDatos = function(){
			$rootScope.mostrarDatos=false;
			$scope.solicitaPsw=true;
			// $mdDialog.hide();
			console.log('Se solicita la contraseña para mostrar los datos');
			console.log($rootScope.username);
		};

		$scope.verificarPassword=function(){
			console.log($scope.datos);
		};
	};

})();