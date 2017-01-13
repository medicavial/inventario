(function(){

	'use strict';

	angular.module('app')
	.controller('pruebaCtrl',pruebaCtrl)

	pruebaCtrl.$inject = ['$rootScope','$scope','busqueda','datos','proveedores','segundaprueba','mensajes'];

	function pruebaCtrl($rootScope,$scope,busqueda,datos,proveedores, segundaprueba, mensajes){

		var prueba = this;

		$rootScope.tema = 'theme3';
		$rootScope.titulo = 'Sección de prueba';
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

		prueba.info=datos;
		prueba.total=0;
		prueba.limit=10;
		prueba.page=1;
		prueba.texto={
			text:'Clientes por página:',
			of: 'de'
		};
		prueba.paginacion=[10,20,30,40];

		prueba.inicio = function () {
			console.log('Bienvenido');
		};
		
		prueba.consulta = function () {
			busqueda.consultaPrueba().then(function (info){
				$scope.infoPrueba=info.data;
				//console.log(info.data);
				$scope.infoA=true;
				$scope.infoB=false;
				$scope.infoC=false;
			});
		};

		prueba.consultaB = function () {
			segundaprueba.query(function (info){
				$scope.info2=info;
				console.log($scope.info2);
				$scope.infoA=false;
				$scope.infoB=true;
				$scope.infoC=false;
			});
		};

		prueba.consultaC = function () {
			busqueda.prueba2().then(function (info){
				$scope.info2=info.data;
				//console.log($scope.info2);
			});
				$scope.infoA=false;
				$scope.infoB=false;
				$scope.infoC=true;
		};

		prueba.guardaCliente = function () {
			$scope.cliente.nombreCompleto=$scope.cliente.nombre+' '+$scope.cliente.aPaterno+' '+$scope.cliente.aMaterno;
			// console.log($scope.cliente);
			segundaprueba.save($scope.cliente, 
				function (data){
				$scope.cliente={
					nombreCompleto: null,
					nombre: null,
					aPaterno: null,
					aMaterno: null,
					telefono: null,
					email: null,
					domicilio: null,
				};
				mensajes.alerta('Cliente guardado satisfactoriamente','success','top right','wb_cloudy');
				prueba.consultaB();
				},
				function (error){
				mensajes.alerta('Ha ocurrido un error, intentalo nuevamente','error','top right','wb_cloudy');
				}
			)
		};
	}

})();