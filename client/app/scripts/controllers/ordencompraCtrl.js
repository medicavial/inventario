"use strict"

app.controller('ordenCompraCtrl',ordenCompraCtrl)
app.controller('ordenesCompraCtrl',ordenesCompraCtrl)
app.controller('correoCtrl',correoCtrl)
app.controller('completaCtrl',completaCtrl)

ordenesCompraCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','mensajes','pdf','$window','api','operacion'];
ordenCompraCtrl.$inject = ['$scope','$rootScope','operacion','mensajes','datos','pdf','$mdDialog'];
correoCtrl.$inject = ['$scope','$mdDialog','info','operacion','mensajes'];
completaCtrl.$inject = ['$scope','$mdDialog','informacion','operacion','mensajes','$rootScope'];


function ordenesCompraCtrl($rootScope,$mdDialog,datos,busqueda,mensajes,pdf,$window,api,operacion){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Ordenes Registrados';
	scope.info = datos.data;
	scope.total = 0;
	scope.limit = 10;
	scope.page = 1;
	scope.texto = {
      text: 'Movimientos por pagina:',
      of: 'de'
    };


	scope.paginacion = [10,20,30,40];

	scope.onPaginationChange = function (page, limit) {
	    console.log(page);
	    console.log(limit);
	};

	scope.onOrderChange = function (order) {
		console.log(scope.query);
	};

	scope.nuevo = function(ev) {

	    $mdDialog.show({
	      controller: ordenCompraCtrl,
	      templateUrl: 'views/ordencompra.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false
	    }).then(function(){
	    	busqueda.ordenescompra().success(function (data){
	    		scope.info = data;
	    	});
	    });
	    
	};

	scope.completar = function(ev,index) {

		var orden = scope.info[index];

		console.log(orden);

	    $mdDialog.show({
	      controller: completaCtrl,
	      templateUrl: 'views/movimientoorden.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      resolve:{
            informacion:function(operacion,$q){
            	
                var promesa = $q.defer(),
            		items 	= operacion.verificaFaltantes(orden.OCM_clave);

            	$q.when(items).then(function (data){
            		// console.log(data);
            		var datos = {
            			items:data.data,
            			orden:orden
            		}

            		promesa.resolve(datos);
            		// scope.loading = false;
            	});

                return promesa.promise;
            }
          },
	      clickOutsideToClose:true
	    }).then(function(){
	    	busqueda.ordenescompra().success(function (data){
	    		scope.info = data;
	    	});
	    });
	    
	};

	scope.cerrar = function(ev,index) {
	    // Abre ventana de confirmacion

	    var orden = scope.info[index];

	    var confirm = $mdDialog.confirm()
	          .title('¿Desactivar cerrar la orden?')
	          .content('')
	          .ariaLabel('Cerrar orden')
	          .ok('Si')
	          .cancel('No')
	          .targetEvent(ev)
	          .closeTo({
				bottom: 1500
			   });

	    $mdDialog.show(confirm).then(function() {
	    	console.log(orden);
	    	operacion.cerrarOrden(orden.OCM_clave).success( function (data){
	    		mensajes.alerta(data.respuesta,'success','top right','done_all');
	    		orden.OCM_incompleta = 0;
	    	})
	    });
	};

}


function ordenCompraCtrl($scope,$rootScope,operacion,mensajes,datos,pdf,$mdDialog){

	$scope.paso1 = 'views/ordenPaso1.html';
	$scope.paso2 = 'views/ordenPaso2.html';
	$scope.paso3 = 'views/ordenPaso3.html';
	$scope.paso4 = 'views/ordenPaso4.html';

	$rootScope.atras = true;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Nueva Orden';
	$scope.unidades = datos.data;

	$scope.inicio = function(){
		
		$scope.step1block = false;
		$scope.step2block = true;
		$scope.step3block = true;
		$scope.step4block = true;
		$scope.todos = true;

		$scope.selectedIndex = 0;
		$scope.unidad = '';

		$scope.seleccionItems = [];
		$scope.seleccionOrden = [];
		$scope.ordenItems = [];
		$scope.totalItems = [];
		$scope.proveedores = [];
		$scope.selected = [];
		$scope.items = [];
		$scope.ordenesListas = [];
		$scope.ordenes = [];
	}


	$scope.info = function(unidad){

		console.log(unidad);
		$scope.selected = [];
		$scope.items = [];
		$scope.almacenes = '';
		$scope.unidad = unidad.UNI_clave;
		$scope.nombreUnidad = unidad.UNI_nombre;

		operacion.infoUnidad(unidad.UNI_clave).then(
			function (data){

				if (data[1].data.length > 0) {

					$scope.almacenes = data[0].data;
					$scope.items = data[1].data;

					angular.forEach(data[0].data, function(value, key) {
						$scope.selected.push(value);
					});

				}else{
					mensajes.alerta('No hay items en este almacen','info','top right','info');
				}
			},
			function (error){
				alert(error);
			}
		);
	};


	$scope.muestraItems = function(datos){
		operacion.itemsAlmacenes($scope.unidad,datos).success(function (data){
			$scope.items = data;
		});
	};

	$scope.toggle = function (item, list) {
		var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
        $scope.muestraItems(list);
	};

	$scope.exists = function (item, list) {
		return list.indexOf(item) > -1;
	};


	$scope.ir2 = function(selecciones){

		operacion.preparaOrden(selecciones).then(function (data){

			if (data.proveedores.length > 0) {
				$scope.ordenItems = data.datos;
				$scope.totalItems = data.info;
				$scope.proveedores = data.proveedores;
				$scope.selectedIndex = 1;
				$scope.step2block = false;
			}else{
				mensajes.alerta('No hay proveedores disponibles para surtir este item agregalos desde conexión','error','top right','error');
			}
		});
	}


	$scope.cambio = function (item, list) {
		var id2x = list.indexOf(item);
        if (id2x > -1){
        	list.splice(id2x, 1);
        } else{
        	list.push(item);
        }
	};

	$scope.existeEnOrden = function (item, list) {
		return list.indexOf(item) > -1;
	};


	$scope.cantidad = function(item){

		for(var i = 0; i < $scope.ordenItems.length; i++){

			var itx = $scope.ordenItems[i];

            if (itx.ITE_nombre == item) {
                return itx.porsurtir;
            };

        }
        
	}

	$scope.compra = function(item){

		for(var i = 0; i < $scope.ordenItems.length; i++){

			var itx = $scope.ordenItems[i];

            if (itx.ITE_nombre == item) {
                return itx.nivelcompra;
            };

        }
        
	}

	$scope.existencia = function(item){

		for(var i = 0; i < $scope.ordenItems.length; i++){

			var itx = $scope.ordenItems[i];

            if (itx.ITE_nombre == item) {
                return itx.existencia;
            };

        }
        
	}


	$scope.itemProporcional = function(item){
		operacion.proporcionalXitem(item,$scope.ordenItems);
	}


	$scope.itemEconomico = function(item){
		operacion.economicoXitem(item,$scope.ordenItems);
	}

	$scope.verificaCantidad = function(item,proveedor){
		operacion.cambioXproveedor(proveedor,item,$scope.ordenItems);
	}


	$scope.generaOrden = function(){
		$scope.selectedIndex = 2;
		$scope.todos = true;
		$scope.step3block = false;
		operacion.verificaItems($scope.ordenItems).then(function (data){
			$scope.seleccionOrden = data;
		});

	}

	$scope.generaCantidades = function(){

		// console.log($scope.ordenItems);
		// console.log($scope.totalItems);

		operacion.generaCantidades($scope.totalItems).then(function (data){
			$scope.ordenItems = data;
		});
	}

	$scope.generaMasBarato = function(){
		
		operacion.generaMasBarato($scope.totalItems).then(function (data){
			$scope.ordenItems = data;
		});
	}

	$scope.muestraTotal = function(proveedor){
		// console.log(proveedor);
		var total = 0;

		for(var i = 0; i < $scope.seleccionOrden.length; i++){

			var item = $scope.seleccionOrden[i];

            var cantidad = item.cantidad * item.IPR_ultimoCosto;

            if (item.PRO_nombrecorto == proveedor) {
                total += cantidad;
            };

        }

        return total;

	}

	$scope.total = function(){

		var TotalGeneral = 0;

		for(var i = 0; i < $scope.seleccionOrden.length; i++){

			var item = $scope.seleccionOrden[i];
            var cantidad = item.cantidad * item.IPR_ultimoCosto;
            TotalGeneral += cantidad;

        }

        return TotalGeneral;

	}

	//se generan todas las ordenes aqui 
	$scope.confirmaOrden = function(){


		operacion.generaOrdenes($scope.seleccionOrden,$scope.proveedores,$scope.unidad,$scope.almacenes).then(
			function (data){

				angular.forEach(data.ordenes,function (value,key){
					pdf.enviaOrden(value);
				});


				$scope.ordenes = data.ordenes;
				$scope.selectedIndex = 3;
				$scope.step1block = true;
				$scope.step2block = true;
				$scope.step3block = true;
				$scope.step4block = false;

			},function (error){
				alert(error);
			}
		);

	}

	//se generan las ordenes en cada proveedor 
	$scope.confirmaOrdenProveedor = function(proveedor){
		
		$scope.todos = false;

		operacion.ordenXproveedor(proveedor,$scope.unidad,$scope.almacenes,$scope.seleccionOrden).then(
			function (data){
				console.log(data);
				mensajes.alerta('Orden generada satisfactoriamente','success','top right','done_all');

				var idOrden = data.ordenes[0];
				$scope.ordenes.push(idOrden);
				
				pdf.enviaOrden(idOrden);

				$scope.step2block = true;
				$scope.step4block = false;

				if ($scope.seleccionOrden.length == 0) {
					$scope.step1block = true;
					$scope.step3block = true;
					$scope.selectedIndex = 3;
				}

			},function (error){
				// mensajes.alerta('Orden generada satisfactoriamente','success','top right','done_all');
				$scope.todos = true;
				alert(error);
			}
		);
	}

	$scope.eliminaOrden = function(proveedor){

		operacion.eliminaOrden(proveedor, $scope.seleccionOrden);
		$scope.todos = false;
	}

	$scope.confirmaIncompleto = function(ev){

		if ($scope.selectedIndex == 2 && $scope.step4block == false) {

		};
	}


	$scope.muestraOrdenes = function(){
		
		operacion.generaDetalleOrdenes($scope.ordenes).then(
			function(data){
				$scope.ordenesListas = data;
			},
			function(error){
				alert(error);
			}
		);
	}

	$scope.generaPDF = function(index){

		var orden = $scope.ordenesListas[index];
		pdf.ordenCompra(orden.data);
	}

	$scope.generaCorreo = function(ev,index) {

		var orden = $scope.ordenesListas[index];

	    $mdDialog.show({
	      controller: correoCtrl,
	      templateUrl: 'views/correo.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      locals: { info: orden }
	    }).then(function(){
	    	
	    });
	};

}

function correoCtrl($scope, $mdDialog, info, operacion, mensajes){

	$scope.inicio = function(){
		$scope.datos = {
			orden:info.data.OCM_clave,
			correo:'',
			copias:[],
			asunto:'',
			comentarios:''
		}
	}

	$scope.enviaCorreo = function(){
		
		operacion.correo($scope.datos).success(function (data){
			$scope.inicio();
			mensajes.alerta(data.respuesta,'success','top right','done_all');
		}).error(function (data){
			mensajes.alerta('No se logro enviar el correo favor de intentarlo nuevamente','error','top right','done_all');
		});

	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};
	
}


function completaCtrl($scope, $mdDialog, informacion, operacion, mensajes,$rootScope){

	console.log(informacion);

	$scope.inicio = function(){
		
		$scope.guardando = false;

		$scope.datos = {
			orden:informacion.orden.OCM_clave,
			unidad:informacion.orden.UNI_clave,
			items:informacion.items,
			usuario:$rootScope.id
		}
	}

	$scope.guardar = function(){

		$scope.guardando = true;
		operacion.completaOrden($scope.datos).success( function (data){
			$scope.guardando = false;
			mensajes.alerta(data.respuesta,'success','top right','done_all');
			$mdDialog.hide();
		});

	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};
	
}

