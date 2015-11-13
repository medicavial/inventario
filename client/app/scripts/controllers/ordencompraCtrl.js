"use strict"

app.controller('ordenCompraCtrl',ordenCompraCtrl)
app.controller('ordenesCompraCtrl',ordenesCompraCtrl)
app.controller('correoCtrl',correoCtrl)

ordenesCompraCtrl.$inject = ['$rootScope','$mdDialog','datos','busqueda','mensajes','pdf'];
ordenCompraCtrl.$inject = ['$scope','$rootScope','operacion','mensajes','datos','pdf','$mdDialog'];
correoCtrl.$inject = ['$scope','$mdDialog','operacion'];


function ordenesCompraCtrl($rootScope,$mdDialog,datos,busqueda,mensajes,pdf){

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

	scope.pdf = function(index){
		pdf.imprimeOrden(index);
	}

}


function ordenCompraCtrl($scope,$rootScope,operacion,mensajes,datos,pdf,$mdDialog){

	$scope.paso1 = 'views/ordenPaso1.html';
	$scope.paso2 = 'views/ordenPaso2.html';
	$scope.paso3 = 'views/ordenPaso3.html';
	$scope.paso4 = 'views/ordenPaso4.html';

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

				$scope.almacenes = data[0].data;
				$scope.items = data[1].data;

				angular.forEach(data[0].data, function(value, key) {
					$scope.selected.push(value);
				});
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


	$scope.muestraSemaforo = function(existencia,nivelMinimo,nimvelCompra){
		if (existencia == nivelMinimo || existencia < nivelMinimo) {
			return 'bgm-red';
		}else if(existencia > nivelMinimo && existencia < nimvelCompra || existencia == nimvelCompra){
			return 'bgm-yellow';
		}else if(existencia > nimvelCompra){
			return 'bgm-green';
		}
	}	

	$scope.ir2 = function(selecciones){

		operacion.preparaOrden(selecciones).then(function (data){
			$scope.ordenItems = data.datos;
			$scope.totalItems = data.info;
			$scope.proveedores = data.proveedores;

			$scope.selectedIndex = 1;

			$scope.step2block = false;
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
				// console.log(data);
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
				// console.log(data);
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
	    $mdDialog.show({
	      controller: correoCtrl,
	      templateUrl: 'views/correo.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true
	    }).then(function(){
	    	
	    });
	};

}

function correoCtrl($scope,$mdDialog,operacion){

	$scope.datos = {
		correo:'',
		copias:[],
		observaciones:''
	}
	
}

