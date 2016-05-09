(function() {
'use strict';

    angular
    .module('app')
    .controller('completarCtrl', completarCtrl)
    .controller('lotesItemCtrl',lotesItemCtrl);

	lotesItemCtrl.$inject = ['$scope', '$mdDialog', 'info', 'mensajes','busqueda'];
    completarCtrl.$inject = ['$rootScope','datos','$mdDialog'];
    
    function completarCtrl($rootScope, datos,$mdDialog) {
        var vm = this;
        $rootScope.tema = 'theme1';
		$rootScope.titulo = 'Completar Orden';
		$rootScope.atras = true;
        console.log(datos);
        vm.items = datos.data;
        vm.inicio = function(){
			
			vm.guardando = false;

			vm.datos = {
				orden:informacion.orden.OCM_clave,
				unidad:informacion.orden.UNI_clave,
				items:informacion.items,
				usuario:$rootScope.id,
                lotes:''
			}
		}

		vm.guardar = function(){

			vm.guardando = true;
			operacion.completaOrden(vm.datos).success( function (data){
				vm.guardando = false;
				mensajes.alerta(data.respuesta,'success','top right','done_all');
			});

		}    
        
        vm.ingresaLote = function(item,ev) {

		    $mdDialog.show({
		      controller: lotesItemCtrl,
		      templateUrl: 'views/loteReceta.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      locals: { info: item },
		      clickOutsideToClose:false
		    }).then(function(lotes){
		    	item.lotes = lotes;
		    });
		}; 
            
            
    }
	
	function lotesItemCtrl($scope, $mdDialog, info, mensajes,busqueda){

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
						$scope.datos.caducidad = new Date(data.LOT_caducidad);
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