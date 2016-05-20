(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('loteRecetaCtrl',loteRecetaCtrl)

	loteRecetaCtrl.$inject = ['$scope', '$mdDialog', 'info', 'mensajes','busqueda']
	
	function loteRecetaCtrl($scope, $mdDialog, info, mensajes,busqueda){

		console.log(info);
		$scope.lotes = info.lotes ? info.lotes : [];
		$scope.maximo = info.caja > 0 ? Number(info.caja) * Number(info.cantidad) : info.cantidad ;

		if ($scope.lotes.length > 0) {

			angular.forEach($scope.lotes, function (value,key){
				$scope.maximo -= value.cantidad;
			});

		}

		$scope.inicio = function(){

			$scope.datos = {
				cantidad :'',
				idLote : '',
				lote : '',
				caducidad : ''
			}
		};

		$scope.verificaLote = function(){
			var lote = $scope.datos.lote;
			
			if (lote != '') {
				
				mensajes.alerta('Verificando Lote','info','top right','search');
				busqueda.lote(lote).success(function (data){

					if (data) {
						mensajes.alerta('Lote Existente','success','top right','done');
						$scope.datos.idLote = data.LOT_clave;
						$scope.datos.caducidad = moment(data.LOT_caducidad).toDate();
					}else{
						$scope.datos.caducidad = '';
						mensajes.alerta('Lote No Existente Verificalo nuevamente','error','top right','alert');
					}

				}).error(function (data){
					$scope.mensajeError();
				});

			};
		}

		$scope.agrega = function(){

			if ($scope.modificaForm.$valid) {
				$scope.maximo -= $scope.datos.cantidad;

				$scope.lotes.push($scope.datos);
				$scope.inicio();
			};
		}

		$scope.ingresa = function(){

			if ($scope.maximo == 0) {
				$mdDialog.hide($scope.lotes);
			}else{
				mensajes.alerta('No has ingresado todos los items a lotes','error','top right','error');
			}
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		
	}

})();