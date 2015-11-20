"use strict"

app.controller('surtirCtrl',surtirCtrl)
app.controller('modificaCtrl',modificaCtrl)

surtirCtrl.$inject = ['$scope','$rootScope','operacion','mensajes','datos','pdf','$mdDialog','$stateParams'];
modificaCtrl.$inject = ['$scope','$mdDialog','info','operacion','mensajes'];

function surtirCtrl($scope,$rootScope,operacion,mensajes,datos,pdf,$mdDialog, $stateParams){

	$scope.paso1 = 'views/surtirPaso1.html';
	$scope.paso2 = 'views/surtirPaso2.html';
	$scope.paso3 = 'views/surtirPaso3.html';
	$scope.paso3 = 'views/surtirPaso4.html';

	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Surtir Orden';
	$scope.orden = $stateParams.ordenId;
	$scope.descripcion = datos.data.PRO_nombrecorto;
	$scope.costo = datos.data.OCM_importeEsperado;
	$scope.info = datos.data;

	$scope.seleccionItems = [];

	$scope.inicio = function(){
		
		$scope.step2block = true;
		$scope.step3block = true;
		$scope.step4block = true;
		$scope.todos = true;
		$scope.incompleta = false;
		$scope.completa = false;

		$scope.selectedIndex = 0;

		angular.forEach(datos.data.items, function(value, key) {
			$scope.seleccionItems.push(value);
		});

		$scope.total();

	}

	$scope.siguiente = function(index){

		console.log(index);

		if (index == 0) {
			$scope.step2block = false;
		}else if (index == 1) {
			$scope.step3block = false;
		};

		$scope.selectedIndex = index + 1;

	}

	$scope.total = function(){

		$scope.info.OCM_importeFinal = 0;

		angular.forEach($scope.info.items,function (value,key){

			console.log(value);
			var costoItem = value.OIT_precioFinal > 0 ? value.OIT_precioFinal : value.OIT_precioEsperado;
			var cantidadItem = value.OIT_precioFinal > 0 ? value.OIT_cantidadSurtida : value.OIT_cantidadPedida;
			var totalItem = costoItem * cantidadItem;

			$scope.info.OCM_importeFinal  += totalItem;
		});
	}

	$scope.modifica = function(ev,index){

		var item = $scope.info.items[index];

		$mdDialog.show({
			controller: modificaCtrl,
			templateUrl: 'views/modifica.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			locals: { info: item }
	    }).then(function(modificacion){

	    	if (modificacion.cantidad < item.OIT_cantidadPedida) {
	    		$scope.incompleta = true;
	    	};
	    	item.OIT_cantidadSurtida = modificacion.cantidad;
	    	item.OIT_precioFinal = modificacion.costo; 

			var idx = $scope.seleccionItems.indexOf(item);
	        if (idx == -1) $scope.seleccionItems.push(item);

	    	$scope.total();
	    }, function() {
           console.log('You cancelled the dialog.');
        });

	}

}

function modificaCtrl($scope, $mdDialog, info, operacion, mensajes){

	$scope.inicio = function(){
		$scope.datos = {
			cantidad : Number(info.OIT_cantidadPedida),
			costo : info.OIT_precioEsperado
		}
	}

	$scope.actualiza = function(){
		$mdDialog.hide($scope.datos);
	}

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
}


