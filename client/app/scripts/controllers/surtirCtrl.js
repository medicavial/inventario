(function(){

	'use strict';
	
	angular.module('app')
	.controller('surtirCtrl',surtirCtrl)
	.controller('modificaCtrl',modificaCtrl)
	.controller('lotesCtrl',lotesCtrl)

	surtirCtrl.$inject = ['$scope','$rootScope','operacion','mensajes','datos','pdf','$mdDialog','$stateParams', 'webStorage', '$filter'];
	modificaCtrl.$inject = ['$scope','$mdDialog','info','operacion','mensajes'];
	lotesCtrl.$inject = ['$scope','$mdDialog','info','operacion','mensajes'];

	function surtirCtrl($scope,$rootScope,operacion,mensajes,datos,pdf,$mdDialog, $stateParams, webStorage, $filter){

		$scope.paso1 = 'views/surtirPaso1.html';
		$scope.paso2 = 'views/surtirPaso2.html';
		$scope.paso3 = 'views/surtirPaso3.html';
		$scope.paso4 = 'views/surtirPaso4.html';

		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Surtir Orden';
		$rootScope.atras = true;

		$scope.descripcion = datos.data.PRO_nombrecorto;
		$scope.costo = datos.data.OCM_importeEsperado;
		$scope.info = datos.data;
		$scope.items = datos.data.items;

		$scope.seleccionItems = [];
		$scope.lotes = [];

		var unidad = datos.data.UNI_clave;
		var almacenes = datos.data.OCM_almacenes;
		var proveedor = datos.data.PRO_clave;
		var clave = 'orden:' + $stateParams.ordenId;

		$scope.inicio = function(){
			
			$scope.step1block = false;
			$scope.step2block = true;
			$scope.step3block = true;
			$scope.step4block = true;
			$scope.todos = true;
			$scope.guardando = false;
			$scope.inavilitado = false;

			$scope.muestra = false;

			$scope.selectedIndex = 0;

			angular.forEach($scope.items, function(value, key) {
				$scope.seleccionItems.push(value);
			});

			$scope.datos = {
				orden:$stateParams.ordenId,
				tipoEntrega : '',
				guia:'',
				cajas:0,
				bultos:0,
				bolsas:0,
				verificacion: '',
				observacionEntrega : '',
				tipoEntrega: '',
				observacionesVerificacion: '',
				surtidos: $scope.seleccionItems,
				incompleta : false,
				total:0,
				usuario:$rootScope.id,
				indice:0,
				items:$scope.items
			}

			$scope.total();

			$scope.verificaMovimiento();

		}

		$scope.verificaMovimiento = function(){

			if (webStorage.local.get(clave) == null) {

				webStorage.local.add(clave,JSON.stringify($scope.datos));

			}else{

				var datos = JSON.parse(webStorage.local.get(clave));

				$scope.datos.tipoEntrega = datos.tipoEntrega;
				$scope.datos.guia = datos.guia;
				$scope.datos.cajas = datos.cajas;
				$scope.datos.bultos = datos.bultos;
				$scope.datos.bolsas = datos.bolsas;
				$scope.datos.verificacion = datos.verificacion;
				$scope.datos.observacionEntrega = datos.observacionEntrega;
				$scope.datos.tipoEntrega = datos.tipoEntrega;
				$scope.datos.observacionesVerificacion = datos.observacionesVerificacion;
				$scope.datos.incompleta = datos.incompleta;
				$scope.datos.total = datos.total;
				$scope.datos.indice = datos.indice;

				$scope.selectedIndex = datos.indice;
				$scope.items = datos.items;
				$scope.seleccionItems = [];
				// console.log(datos)

				angular.forEach(datos.items, function(value, key) {

					var busqueda = $filter('filter')(datos.surtidos,value);

					if (busqueda.length > 0) {
						// console.log('existe item')
						$scope.seleccionItems.push(value);
					};

				});

				if (datos.indice == 1) {
					
					$scope.step2block = false;
				
				}else if (datos.indice == 2) {

					$scope.step2block = true;
					$scope.step3block = false;
					$scope.seleccionItems = datos.surtidos;

				}else if (datos.indice == 3) {

					$scope.step2block = true;
					$scope.step3block = true;
					$scope.step4block = false;
					$scope.datos.surtidos = datos.surtidos;
				};


			}
		}

		$scope.calculaTotal = function(){
			$scope.total();
		}


		$scope.siguiente = function(index){

			if (index == 0) {
				$scope.step2block = false;
			}else if (index == 1) {
				$scope.step3block = false;
			}else if (index == 2) {

				if ($scope.seleccionItems.length < $scope.items.length) $scope.datos.incompleta = true;
				$scope.step4block = false;
			};

			$scope.selectedIndex = index + 1;
			$scope.datos.indice = index + 1;

			$scope.datos.surtidos = $scope.seleccionItems;
	    	$scope.datos.items = $scope.items;

			webStorage.local.add(clave,JSON.stringify($scope.datos));

			console.log($scope.datos);

		}

		$scope.verificaItems = function(){

			if (  ($scope.seleccionItems.length > 0  && $scope.datos.verificacion == 1 ) || ($scope.datos.observacionentrega && $scope.datos.verificacion == 2 )  ) {
				return false;
			}else {
				return true;
			};
		}


		$scope.total = function(){

			$scope.info.OCM_importeFinal = 0;
			$scope.datos.total = 0;

			angular.forEach($scope.seleccionItems,function (value,key){

				// console.log(value);
				var costoItem = value.OIT_precioFinal > 0 ? value.OIT_precioFinal : value.OIT_precioEsperado;
				var cantidadItem = value.OIT_precioFinal > 0 ? value.OIT_cantidadSurtida : value.OIT_cantidadPedida;
				var totalItem = costoItem * cantidadItem;

				$scope.info.OCM_importeFinal  += totalItem;
				$scope.datos.total +=  totalItem;
				
			});


			return $scope.info.OCM_importeFinal;
		}

		$scope.agregaLote = function(index,ev){

			var itemSurtido = $scope.seleccionItems[index];

			// console.log(itemSurtido);

			$mdDialog.show({
				controller: lotesCtrl,
				templateUrl: 'views/lotes.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals: { info: itemSurtido }
		    }).then(function(lotes){

		    	itemSurtido.lotes = lotes;
		    	$scope.datos.surtidos = $scope.seleccionItems;
	        	$scope.datos.items = $scope.items;

	        	webStorage.local.add(clave,JSON.stringify($scope.datos));
		    	// console.log($scope.datos);

		    }, function() {

	        });

		}

		$scope.modifica = function(ev,index){

			var item = $scope.items[index];

			$mdDialog.show({

				controller: modificaCtrl,
				templateUrl: 'views/modifica.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				locals: { info: item }

		    }).then(function(modificacion){

		    	if (modificacion.cantidad < item.OIT_cantidadPedida) {
		    		$scope.datos.incompleta = true;
		    	};
		    	
		    	item.OIT_cantidadSurtida = modificacion.cantidad;

				var idx = $scope.seleccionItems.indexOf(item);
		        if (idx == -1) $scope.seleccionItems.push(item);

		        $scope.datos.surtidos = $scope.seleccionItems;
	        	$scope.datos.items = $scope.items;

		    	$scope.total();

		    }, function() {

	            var idx = $scope.seleccionItems.indexOf(item);
		        if (idx == -1) $scope.seleccionItems.push(item);

	        });

		}

		$scope.surtir = function(){
			
			console.log($scope.datos);
			$scope.guardando = true;

			operacion.surtirOrden($scope.datos)
			.success(function (data){

				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				

			})
			.error(function (data){

				$scope.guardando = false;
				mensajes.alerta('hubo un error intentalo nuevamente','error','top right','error');

			});

		}


		$scope.confirmaOrden = function(){

			operacion.generarOrden($scope.ordenNueva)
			.success(function (data){
				mensajes.alerta('Orden Generada Correctamente','success','top right','done_all');
			})
			.error(function (data){
				mensajes.alerta('hubo un error intentalo nuevamente','error','top right','error');
			});

		}


	}

	function modificaCtrl($scope, $mdDialog, info, operacion, mensajes){

		$scope.inicio = function(){

			$scope.maximo = info.OIT_cantidadPedida;

			$scope.datos = {
				cantidad : Number(info.OIT_cantidadPedida),
				costo : info.OIT_precioEsperado
			}
		};

		$scope.actualiza = function(){
			$mdDialog.hide($scope.datos);
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		
	}

	function lotesCtrl($scope, $mdDialog, info, operacion, mensajes){

		// console.log(info);
		$scope.lotes = info.lotes ? info.lotes : [];
		$scope.maximo = info.OIT_cantidadSurtida > 0 ? info.OIT_cantidadSurtida : info.OIT_cantidadPedida ;

		if ($scope.lotes.length > 0) {

			angular.forEach($scope.lotes, function (value,key){
				$scope.maximo -= value.cantidad;
			});

		}

		$scope.inicio = function(){

			$scope.datos = {
				cantidad :'',
				lote : '',
				caducidad : ''
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
				alert('No has ingresado todos los items a lotes');
			}
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
		
	}

})();