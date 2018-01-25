(function(){

	'use strict';

	angular.module('app')
	.controller('surtirCtrl',surtirCtrl)
	.controller('modificaCtrl',modificaCtrl)
	.controller('lotesCtrl',lotesCtrl)

	surtirCtrl.$inject = ['$scope','$rootScope','operacion','mensajes','datos','$mdDialog','$stateParams', 'webStorage', '$filter'];
	modificaCtrl.$inject = ['$scope','$mdDialog','info','operacion','mensajes'];
	lotesCtrl.$inject = ['$scope','$rootScope','$mdDialog','info','operacion','mensajes','informacion','webStorage'];

	function surtirCtrl($scope,$rootScope,operacion,mensajes,datos,$mdDialog, $stateParams, webStorage, $filter){

		if (datos.data.OCM_surtida == 1 ) {
			$rootScope.ir('index.ordenescompra');
			mensajes.alerta('Esta orden ya fue surtida','error','top right','error');
		};
		$scope.paso1 = 'views/surtirPaso1.html';
		$scope.paso2 = 'views/surtirPaso2.html';
		$scope.paso3 = 'views/surtirPaso3.html';
		$scope.paso4 = 'views/surtirPaso4.html';

		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Surtir Orden';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';
		$scope.lotesCompletos = false;

		$scope.descripcion = datos.data.PRO_nombrecorto;
		$scope.costo = datos.data.OCM_importeEsperado;
		$scope.info = datos.data;
		$scope.items = datos.data.items;

		for (var i = 0; i < $scope.items.length; i++) {
			$scope.items[i].habilitado = true;
		}

		$scope.seleccionItems = [];
		$scope.lotes = [];
		// $scope.ingresado=0;

		// if (webStorage.local.get('ingresado')) {
		// 	$scope.ingresado=webStorage.local.get('ingresado');
		// } else{
		// 	webStorage.local.add('ingresado',$scope.ingresado);
		// };

		// console.log($scope.ingresado);

		// console.log(datos.data);

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
			$scope.numero=1;

			angular.forEach($scope.items, function(value, key) {
				$scope.seleccionItems.push(value);
				$scope.seleccionItems[$scope.numero-1].numerador=$scope.numero;
				$scope.numero++;
			});

			console.log( $scope.seleccionItems );

			$scope.datos = {
				orden:$stateParams.ordenId,
				guia:'',
				cajas:0,
				bultos:0,
				bolsas:0,
				verificacion: '',
				observacionEntrega: 'Sin novedad',
				tipoEntrega: '',
				observacionesVerificacion: '',
				surtidos: $scope.seleccionItems,
				incompleta : false,
				total:0,
				usuario:$rootScope.id,
				indice:0,
				items:$scope.items
			}



			$scope.aSurtir=1;

			$scope.total();

			$scope.verificaMovimiento();

			$scope.prueba = function( num, status ){
				console.log( num, status );
				!$scope.items[num - 1].habilitado;
				// $scope.items[num - 1].habilitado = !$scope.items[num - 1].habilitado;
				// $scope.seleccionItems[num - 1].habilitado = !$scope.seleccionItems[num - 1].habilitado;

				//si el status es true procedemos a eliminar el item de la seleccionItems
				if (status == true) {
					//recorremos el arreglo para buscar el item
					for (var i = 0; i < $scope.seleccionItems.length; i++) {
						if ( $scope.items[num -1].numerador == $scope.seleccionItems[i].numerador ) {
								// console.log('eliminar');
								// console.log($scope.seleccionItems[i].numerador);
								// console.log($scope.items[num -1 ].numerador);
								$scope.seleccionItems.splice( i, 1 );
								break;
							}
					}
				}

        // si el status el false agregamos el item a la seleccionItems
				if (status == false) {
					$scope.seleccionItems.push( $scope.items[num - 1] );
				}

				console.log( $scope.seleccionItems );
			}// termina la funcion prueba
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

				$scope.numero=1;

				angular.forEach(datos.items, function(value, key) {

					var busqueda = $filter('filter')(datos.surtidos,value);

					if (busqueda.length > 0) {
						// console.log('existe item')
						$scope.seleccionItems.push(value);
						$scope.seleccionItems[$scope.numero-1].numerador=$scope.numero;
						$scope.numero++;
					};

				});

				if (datos.indice == 1) {

					$scope.step2block = false;

				}else if (datos.indice == 2) {

					$scope.step2block = true;
					$scope.step3block = false;
					$scope.seleccionItems = datos.surtidos;
					$scope.verificaLotes();

				}else if (datos.indice == 3) {

					$scope.step2block = true;
					$scope.step3block = true;
					$scope.step4block = false;
					$scope.datos.surtidos = datos.surtidos;
				};


			}
		}

		$scope.calculaTotal = function(){
			console.log( $scope.seleccionItems );
			$scope.total();
		}

		$scope.miTotal = function(){

		}

		// funcion que bloquea el boton de siguiente segun sea el caso
		$scope.verificaLotes = function(){
			// console.log('verifica');
			// console.log($scope.seleccionItems);
			$scope.numero=1;

			angular.forEach($scope.seleccionItems, function (value,key){
				$scope.seleccionItems[$scope.numero-1].numerador=$scope.numero;

				if ( $scope.seleccionItems[$scope.numero-1].TIT_forzoso == 0 ) {
					$scope.seleccionItems[$scope.numero-1].lotes = [{
						lote: 'N/A'
					}];
				}

				$scope.numero++;
			});
			// console.log($scope.seleccionItems);

			var items = $scope.seleccionItems.length;
			var actual = 1;

			// recorremos los items para verificar si ya están los lotes completos
			$scope.lotesCompletos = true;
			for (var i = 0; i < $scope.seleccionItems.length; i++) {
				if ( $scope.seleccionItems[i].lotes == undefined ) {
					$scope.lotesCompletos = false;
					break;
				}
			}

			// // Esto funciona mas o menos
			// angular.forEach($scope.seleccionItems, function (value,key){
			// 	console.log(value);
			// 	console.log('actual='+actual+'| |'+'items='+items);
			// 	console.log($scope.seleccionItems);
			// 	// if (value.lotes != undefined) {
			// 	if (value.lotes) {
			// 		console.log(actual+' con lote');
			// 		if (value.lotes.length > 0 || value.TIT_forzoso == 0) {
			// 			if (actual === items) {
			// 				$scope.lotesCompletos = true;
			// 			};
			// 		};
			// 	}else{
			// 		console.log(actual+' sin lote');
			// 		if (value.TIT_forzoso == 0) {
			// 			if (actual == items) {
			// 				$scope.lotesCompletos = true;
			// 			};
			// 		}else{
			// 			$scope.lotesCompletos = false;
			// 		}
			// 	}
			// 	actual++;
			// });

		}

		$rootScope.reVerificaLote = function(){

			$scope.verificaLotes();
		}


		$scope.siguiente = function(index){


			if (index == 0) {
				$scope.step2block = false;
			}else if (index == 1) {
				$scope.step3block = false;
				$scope.verificaLotes();
			}else if (index == 2) {

				if ($scope.seleccionItems.length < $scope.items.length) $scope.datos.incompleta = true;
				$scope.step4block = false;
			};

			$scope.selectedIndex = index + 1;
			$scope.datos.indice = index + 1;

			$scope.datos.surtidos = $scope.seleccionItems;
	    	$scope.datos.items = $scope.items;

			webStorage.local.add(clave,JSON.stringify($scope.datos));

			// console.log($scope.datos);

		}

		$scope.verificaItems = function(){

			if (  ($scope.seleccionItems.length > 0  && $scope.datos.verificacion == 1 ) || ($scope.datos.observacionentrega && $scope.datos.verificacion == 2 )  ) {
				return false;
			}else {
				return true;
			};
		}

		$scope.total = function(){
			// console.log( $scope.seleccionItems );
			$scope.info.OCM_importeFinal = 0;
			$scope.datos.total = 0;

			// console.log($scope.items);

			angular.forEach($scope.seleccionItems,function (value,key){

				// console.log(value);
				var costoItem = parseFloat(value.OIT_precioFinal) > 0 ? parseFloat(value.OIT_precioFinal) : parseFloat(value.OIT_precioEsperado);
				var cantidadItem = parseFloat(value.OIT_cantidadSurtida) > 0 ? Number(value.OIT_cantidadSurtida) : Number(value.OIT_cantidadPedida);
				var totalItem = costoItem * cantidadItem;

				$scope.info.OCM_importeFinal  += totalItem;
				$scope.datos.total +=  totalItem;
			});


			return $scope.info.OCM_importeFinal;
		}

		$scope.agregaLote = function(index,ev){

			var d = new Date;
			var anioInicio = d.getFullYear();
			var anioFinal = anioInicio + 10;

			var meses = new Array();
			meses[0] = "Enero";
			meses[1] = "Febrero";
			meses[2] = "Marzo";
			meses[3] = "Abril";
			meses[4] = "Mayo";
			meses[5] = "Junio";
			meses[6] = "Julio";
			meses[7] = "Agosto";
			meses[8] = "Septiembre";
			meses[9] = "Octubre";
			meses[10] = "Noviembre";
			meses[11] = "Diciembre";

			// console.log( anioInicio, anioFinal, meses );

			var itemSurtido = $scope.seleccionItems[index];

			$mdDialog.show({
				controller: lotesCtrl,
				templateUrl: 'views/lotes.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				resolve:{
					informacion:function(busqueda){
						return busqueda.lotesUnidadXitem(unidad,itemSurtido.ITE_clave);
					}
				},
				locals: { info: itemSurtido }
		    }).then(function(lotes){
		    	itemSurtido.lotes = lotes;

		    	$scope.datos.surtidos = $scope.seleccionItems;
	        $scope.datos.items = $scope.items;

	        webStorage.local.add(clave,JSON.stringify($scope.datos));
		    	console.log($scope.datos);

		    	$scope.verificaLotes();

		    }, function() {
		    	$scope.verificaLotes();
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

		    	console.log(modificacion);
		    	//aqui es cuando le dieron actualizar al boton

		    	//aqui verificamos si cambio la cantidad que se pidio por una inferior
		    	if (modificacion.cantidad < item.OIT_cantidadPedida) {

		    		//se activa el bit de orden incompleta
		    		$scope.datos.incompleta = true;
		    	};

		    	//se asignan las nuevas cantidades
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


			$scope.guardando = true;
			console.log($scope.datos);

			operacion.surtirOrden($scope.datos)
			.success(function (data){

				mensajes.alerta(data.respuesta,'success','top right','done_all');
				webStorage.local.remove(clave);
				$scope.guardando = false;
				$scope.surtido = true;
				$rootScope.ir('index.ordenescompra');

			})
			.error(function (data){

				$scope.guardando = false;
				mensajes.alerta('hubo un error reportalo al area de sistemas','error','top right','error');
				$scope.surtido = true;

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
		console.log('function modificaCtrl($scope, $mdDialog, info, operacion, mensajes)');

		$scope.inicio = function(){

			$scope.maximo = Number(info.OIT_cantidadPedida);

			$scope.datos = {
				cantidad : Number(info.OIT_cantidadPedida),
				costo : parseFloat(info.OIT_precioEsperado)
			}
		};

		$scope.actualiza = function(){


			$mdDialog.hide($scope.datos);
		};

		$scope.cancel = function() {


			$mdDialog.cancel();
		};

	}

	function lotesCtrl($scope, $rootScope, $mdDialog, info, operacion, mensajes,informacion, webStorage, surtirCtrl){
		console.log('function lotesCtrl($scope, $rootScope, $mdDialog, info, operacion, mensajes,informacion, webStorage, surtirCtrl)');

		$scope.lotes = info.lotes ? info.lotes : [];
		$scope.maximo = info.OIT_cantidadSurtida > 0 ? info.OIT_cantidadSurtida : info.OIT_cantidadPedida ;

		if ($scope.lotes.length > 0) {

			angular.forEach($scope.lotes, function (value,key){
				$scope.maximo -= value.cantidad;
			});

		}

		$scope.datosLote = function(lote){
			// console.log(lote);

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

		$scope.cambio = function(){
			var d = new Date($scope.datos.caducidad),
			        month = '' + (d.getMonth() + 1),
			        day = '' + d.getDate(),
			        year = d.getFullYear();

			    if (month.length < 2) month = '0' + month;
			    if (day.length < 2) day = '0' + day;

			    $scope.datos.caducidad= year+'-'+month+'-'+day+' 00:00:00';

			    console.log($scope.datos.caducidad);
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

				$scope.lotes.push($scope.datos);
				$scope.inicio();
			} else{
				mensajes.alerta('Verifica que los datos sean correctos','error','top right','error');
			};
		}

		$scope.ingresa = function(){


			if ($scope.maximo == 0) {
				// $scope.ingresado=webStorage.local.get('ingresado');
				// console.log($scope.ingresado);

				// $scope.ingresado=$scope.ingresado+1;
				// webStorage.local.add('ingresado',$scope.ingresado);
				// console.log($scope.ingresado);

				$mdDialog.hide($scope.lotes);
				// setTimeout(function() {
				// 	$rootScope.reVerificaLote();
				// }, 100);


			}else{
				mensajes.alerta('No has ingresado todos los items a lotes','error','top right','error');
			}
		};

		$scope.cancel = function() {


			$mdDialog.cancel();
		};

	}

})();
