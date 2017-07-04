(function() {
'use strict';

    angular
    .module('app')
    .controller('completarCtrl', completarCtrl)
    .controller('lotesItemCtrl',lotesItemCtrl);

    completarCtrl.$inject = ['$rootScope','info','$mdDialog','$stateParams','operacion','mensajes'];
	lotesItemCtrl.$inject = ['$scope', '$mdDialog', 'info', 'busqueda', 'mensajes', 'informacion'];
    
    function completarCtrl($rootScope,info,$mdDialog,$stateParams,operacion,mensajes) {
        var vm = this;
        $rootScope.tema = 'theme1';
		$rootScope.titulo = 'Completar Orden';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';
		$rootScope.numero=0;
        vm.items = info.data;

        angular.forEach(vm.items, function(value, key){
        	vm.items[$rootScope.numero].numerador=$rootScope.numero;
        	$rootScope.numero++;
        });

        console.log(vm.items);

        vm.inicio = function(){
			
			vm.lotesCompletos = false;
			vm.guardando = false;

			vm.datos = {
				orden:$stateParams.ordenId,
				unidad:info.data[0].UNI_clave,
				items:vm.items,
				usuario:$rootScope.id,
				precioFinal:info.data[0].OCM_importeEsperado
			}

			vm.verificaLotes();
		}   
        
        vm.ingresaLote = function(item,ev) {

        	var cantidadSurtida = item.OIT_cantidadSurtida;

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
		    }).then(function(datos){
		    	console.log(datos);
		    	item.cantidadSurtida = datos.cantidad;
		    	item.lotes = datos.lotes;
		    	console.log(item.lotes);
		    	vm.verificaLotes();
		    });
		}; 

		vm.verificaLotes = function(){
			console.log('verifica');

			var items = vm.items.length;
			var actual = 1;

			angular.forEach(vm.items, function (value,key){
				console.log(value);
				console.log('actual='+actual+'| |'+'items='+items);

				// console.log(items);
				if (value.lotes != undefined) {
					console.log(actual+' con lote');
					if (value.lotes.length > 0 || value.TIT_forzoso == 0) {
						if (actual == items) {
							vm.lotesCompletos = true;
						};
					};

				}else{
					console.log(actual+' sin lote');
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
				$rootScope.ir('index.ordenescompra');
			}).error(function (data){
				vm.guardando = false;
				mensajes.alerta('Ocurrio un error de conexión intenta nuevamente','error','top right','error');
			});

		} 
            
            
    }
	
	function lotesItemCtrl($scope, $mdDialog, info, operacion, mensajes,informacion){
		// console.log(info);
		$scope.cantidad = 0;
		$scope.lotes = info.lotes ? info.lotes : [];
		$scope.maximo = Number(info.OIT_cantidadPedida) - Number(info.OIT_cantidadSurtida);

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

					// console.log(dato);
					$scope.datos.idLote = dato.LOT_clave;
					$scope.datos.lote = dato.LOT_numero;
					$scope.datos.caducidad = moment(dato.LOT_caducidad).toDate();
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
			// console.log($scope.modificaForm);
			if ($scope.modificaForm.$valid) {
				$scope.maximo -= $scope.datos.cantidad;

				$scope.cantidad += $scope.datos.cantidad;

				$scope.lotes.push($scope.datos);
				console.log($scope.lotes);
				$scope.inicio();
			} else {
				mensajes.alerta('Verifica que los datos sean correctos','error','top right','error');
			};
		}

		$scope.ingresa = function(){
			if ($scope.maximo == 0) {
				var datos = {
					lotes:$scope.lotes,
					cantidad:$scope.cantidad
				}
				$mdDialog.hide(datos);
			} else{
				mensajes.alerta('No has ingresado todos los items a lotes','error','top right','error');
			};
			
		};


		// $scope.ingresa = function(){

		// 	var datos = {
		// 		lotes:$scope.lotes,
		// 		cantidad:$scope.cantidad
		// 	}
		// 	$mdDialog.hide(datos);
			
		// };


		// $scope.ingresa = function(){
		// 	if ($scope.maximo == 0) {
		// 		// $scope.ingresado=webStorage.local.get('ingresado');
		// 		// console.log($scope.ingresado);

		// 		// $scope.ingresado=$scope.ingresado+1;
		// 		// webStorage.local.add('ingresado',$scope.ingresado);
		// 		// console.log($scope.ingresado);

		// 		$mdDialog.hide($scope.lotes);
		// 		// setTimeout(function() {
		// 		// 	$rootScope.reVerificaLote();
		// 		// }, 100);
				

		// 	}else{
		// 		mensajes.alerta('No has ingresado todos los items a lotes','error','top right','error');
		// 	}
		// };

		$scope.cancel = function() {
			$mdDialog.cancel();
		};


		$scope.cambio = function(){

			console.log($scope.datos.caducidad);

			var d = new Date($scope.datos.caducidad),
			        month = '' + (d.getMonth() + 1),
			        day = '' + d.getDate(),
			        year = d.getFullYear();

			    if (month.length < 2) month = '0' + month;
			    if (day.length < 2) day = '0' + day;

			    $scope.datos.caducidad= year+'-'+month+'-'+day+' 00:00:00';

			    console.log($scope.datos.caducidad);
		}
		
	}

    
})();