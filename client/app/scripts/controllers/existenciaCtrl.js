(function(){


	'use strict';

	angular.module('app')
	.controller('existenciasCtrl',existenciasCtrl)

	existenciasCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','mensajes'];

	function existenciasCtrl($rootScope,$mdDialog,datos,busqueda,mensajes){

		var scope = this;
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Existencias';
		scope.info = datos.data;
		scope.total = 0;

		scope.limit = 10;
		scope.page = 1;

		scope.onPaginationChange = function (page, limit) {
		    console.log(page);
		    console.log(limit);
		};

		scope.onOrderChange = function (order) {
			console.log(scope.query);
		    //return $nutrition.desserts.get(scope.query, success).$promise; 
		};

		scope.traspasar = function(ev,almacen,item) {
			
			var datos = {almacen:almacen,item:item};

		    $mdDialog.show({
		      controller: traspasoCtrl,
		      templateUrl: 'views/traspaso.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false,
		      locals: {informacion: datos }
		    }).then(function(){
		    	busqueda.existencias($rootScope.id).success(function (data){
		    		scope.info = data;
		    	});
		    });
		};

	}

})();