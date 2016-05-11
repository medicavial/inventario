(function() {
'use strict';

    angular
    .module('app')
    .controller('completarCtrl', completarCtrl)
    .controller('lotesItemCtrl',lotesItemCtrl);

    completarCtrl.$inject = ['$rootScope','info','$mdDialog','$stateParams','operacion','mensajes'];
	lotesItemCtrl.$inject = ['$scope', '$mdDialog', 'info', 'mensajes','busqueda','informacion'];
    
    function completarCtrl($rootScope,info,$mdDialog,$stateParams,operacion,mensajes) {
        var vm = this;
        $rootScope.tema = 'theme1';
		$rootScope.titulo = 'Completar Orden';
		$rootScope.atras = true;
        vm.items = info.data;

        vm.inicio = function(){
			
			vm.lotesCompletos = false;
			vm.guardando = false;

			vm.datos = {
				orden:$stateParams.ordenId,
				unidad:info.data[0].UNI_clave,
				items:vm.items,
				usuario:$rootScope.id
			}
		}   
        
        vm.ingresaLote = function(item,ev) {

		    $mdDialog.show({
		      	controller: lotesItemCtrl,
		      	templateUrl: 'views/lotes.html',
		      	parent: angular.element(document.body),
		      	targetEvent: ev,
		      	locals: { info: item },
		      	resolve:{
					informacion:function(busqueda){
						return busqueda.lotesUnidadXitem(item.UNI_clave,item.ITE_clave);
					}
				},
		      	clickOutsideToClose:false
		    }).then(function(lotes){
		    	item.lotes = lotes;
		    	vm.verificaLotes();
		    });
		}; 

		vm.verificaLotes = function(){

			var items = vm.items.length;
			var actual = 1;

			angular.forEach(vm.items, function (value,key){

				if (value.lotes != undefined) {

					if (value.lotes.length > 0 || value.TIT_forzoso == 0) {

						if (actual == items) {
							vm.lotesCompletos = true;
						};

					};

				}else{

					if (value.TIT_forzoso == 0) {

						if (actual == items) {
							vm.lotesCompletos = true;
						};
						
					}else{
						vm.lotesCompletos = false;
					}
				}

				actual++;

			});

		}

		vm.guardar = function(){

			vm.guardando = true;
			operacion.completaOrden(vm.datos).success( function (data){
				vm.guardando = false;
				vm.lotesCompletos = false;
				mensajes.alerta(data.respuesta,'success','top right','done_all');
			}).error(function (data){
				vm.guardando = false;
				mensajes.alerta('Ocurrio un error de conexión intenta nuevamnete','error','top right','error');
			});

		} 
            
            
    }
	
	function lotesItemCtrl($scope, $mdDialog, info, operacion, mensajes,informacion){
		
		
		$scope.lotes = info.lotes ? info.lotes : [];
		$scope.maximo = info.OIT_cantidadSurtida > 0 ? info.OIT_cantidadSurtida : info.OIT_cantidadPedida ;

		if ($scope.lotes.length > 0) {

			angular.forEach($scope.lotes, function (value,key){
				$scope.maximo -= value.cantidad;
			});

		}
		
		$scope.datosLote = function(lote){
			if (lote) {
				
				if(lote == 0){
					$scope.existeLote = false;
					$scope.datos.lote = '';
				}else{
					var dato = JSON.parse(lote);

					console.log(dato);
					$scope.datos.idLote = dato.LOT_clave;
					$scope.datos.lote = dato.LOT_numero;
					$scope.datos.caducidad = new Date(dato.LOT_caducidad);
					$scope.cantidadLote = dato.LOT_cantidad;
					$scope.existeLote = true;
				}
				
			};
		}

		$scope.inicio = function(){

			$scope.datos = {
				idLote:'',
				cantidad :'',
				lote : '',
				caducidad : ''
			}
			
			if(informacion.data.length > 0){
				$scope.lotesUnidad = informacion.data;
				$scope.existeLote = true;
			}else{
				$scope.lotesUnidad = [];
				$scope.existeLote = false;
			}
			
		};

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