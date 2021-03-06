"use strict"

app.controller('itemCtrl',itemCtrl)
app.controller('itemsCtrl',itemsCtrl)
app.controller('itemEditCtrl',itemEditCtrl)

itemsCtrl.$inject = ['$rootScope','$mdDialog','datos','items','mensajes'];
itemCtrl.$inject = ['$scope','$mdDialog','busqueda','items','mensajes', '$rootScope','datos','archivos'];
itemEditCtrl.$inject = ['$scope','$mdDialog','busqueda','items','mensajes', '$rootScope','datos','archivos'];


function itemsCtrl($rootScope,$mdDialog,datos,items,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Items Registrados';
	scope.info = datos;
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

	scope.nuevo = function(ev) {
	    $mdDialog.show({
	      controller: itemCtrl,
	      templateUrl: 'views/item.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false
	    }).then(function(){
	    	scope.info = items.query();
	    });
	};

	scope.edita = function(ev,index) {

		var usuario = scope.info[index];

	    $mdDialog.show({
	      controller: itemEditCtrl,
	      templateUrl: 'views/item.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {informacion: usuario }
	    }).then(function(){
	    	scope.info = items.query();
	    });
	};

	scope.confirmacion = function(ev,index) {
	    // Abre ventana de confirmacion

	    // console.log(index);
	    var item = scope.info[index];

	    var confirm = $mdDialog.confirm()
	          .title('¿Desactivar el item?')
	          .content('Puedes activarlo cuando lo necesites nuevamente')
	          .ariaLabel('Desactivar item')
	          .ok('Si')
	          .cancel('No')
	          .targetEvent(ev);

	    $mdDialog.show(confirm).then(function() {

	    	//en caso de decir SI
	    	if (item.ITE_activo) {
	      		item.ITE_activo = 0;
	    	}else{
	    		item.ITE_activo = 1;
	    	}

	      	var datos = {
				nombre:item.ITE_nombre,
				precio:item.ITE_precioventa,
				cantidad:item.ITE_cantidadtotal,
				tipo:item.TIT_clave,
				subtipo:item.STI_clave,
				activo:item.ITE_activo
			}

	      	items.update({item:item.ITE_clave},datos,
	      		function (data){
	      			mensajes.alerta(data.respuesta,'success','top right','done_all');
	      		}
	      	);

	    });
	};

}

function itemCtrl($scope,$mdDialog,busqueda,items,mensajes, $rootScope,datos,archivos){

	$rootScope.titulo = 'Nuevo Item';
	$scope.tipoitems = datos[0].data;
	$scope.subtipoitems = datos[1].data;
	$scope.presentaciones = datos[2].data;

	$scope.inicio = function(){
		
		$scope.sustancias = [];
		$scope.imagenes = [];
		$scope.guardando = false;

		$scope.datos = {
			nombre:'',
			precio:'',
			cantidad:'',
			codigo:'',
			codigoean:'',
			tipo:'',
			subtipo:'',
			presentacion:'',
			clasificacion:'',
			sustancia:$scope.sustancias,
			posologia:'',
			activo:true
		}

	}

	$scope.guardar = function(){

		$scope.guardando = true;

		items.save($scope.datos,function (data){
			var respuesta = data.respuesta;

			archivos.items($scope.imagenes,data.clave).then(
				function(data){
					console.log('Imagenes: ' + data)
					mensajes.alerta(respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.itemForm.$setPristine();
					$scope.inicio();
				},
				function(data){
					mensajes.alerta('Ocurrio un error vuelva a intentarlo','error','top right','done_all');
				},
				function(data){
					console.log('Estatus: ' + data);
				}
			);
		});
		// console.log($scope.datos);
		// console.log($scope.imagenes);
	}


	$scope.verificador = function(){

		if ($scope.itemForm.$valid && $scope.datos.tipo != 1) {
			return false;
		}else if($scope.itemForm.$valid && $scope.datos.tipo == 1){
			if ($scope.sustancias && $scope.datos.posologia) {
				return false;
			}else{
				return true;
			}
		}else{
			return true;
		}
	}

	$scope.upload = function(files,file,event){
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
	        	$scope.imagenes.push(files[i]);
	        }
	    }
	}

	$scope.eliminaImagen = function(index){
		$scope.imagenes.splice(index,1);
	}


	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

function itemEditCtrl($scope,$mdDialog,busqueda,items,mensajes, $rootScope,datos,archivos){

	$rootScope.titulo = 'Detalle de Item';

	$scope.tipoitems = datos[0].data;
	$scope.subtipoitems = datos[1].data;
	$scope.presentaciones = datos[2].data;

	$scope.sustancias = datos[3].datos.ITE_sustancia ? datos[3].datos.ITE_sustancia.split(","):'';
	$scope.clave = datos[3].datos.ITE_clave;
	$scope.datos = {
		nombre:datos[3].datos.ITE_nombre,
		codigo:datos[3].datos.ITE_codigo,
		precio:datos[3].datos.ITE_precioventa,
		cantidad:datos[3].datos.ITE_cantidadtotal,
		tipo:datos[3].datos.TIT_clave,
		subtipo:datos[3].datos.STI_clave,
		sustancia: $scope.sustancias,
		posologia:datos[3].datos.ITE_posologia,
		presentacion:datos[3].datos.PRE_clave,
		activo:datos[3].datos.ITE_activo ? true:false
	}

	$scope.inicio = function(){

		$scope.imagenesguardadas = datos[3].archivos;
		$scope.imagenes = [];
		$scope.guardando = false;
	}


	$scope.verificador = function(){

		if ($scope.itemForm.$valid && $scope.datos.tipo != 1) {
			return false;
		}else if($scope.itemForm.$valid && $scope.datos.tipo == 1){
			if ($scope.sustancias && $scope.datos.posologia) {
				return false;
			}else{
				return true;
			}
		}else{
			return true;
		}
	}

	$scope.upload = function(files,file,event){
		if (files && files.length) {
			for (var i = 0; i < files.length; i++) {
	        	$scope.imagenes.push(files[i]);
	        }
	    }
	}

	$scope.eliminaImagen = function(index){
		$scope.imagenes.splice(index,1);
	}

	$scope.eliminaImagenGuardad = function(index){

		mensajes.alerta('Eliminando imagen','','top right','');

		var imagen = $scope.imagenesguardadas[index];
		archivos.eliminaItem(imagen,$scope.clave).success(function (data){
			$scope.imagenesguardadas.splice(index,1);
		});
	}

	$scope.guardar = function(){


		if ($scope.itemForm.$valid) {

			$scope.guardando = true;
			items.update({item:$scope.clave},$scope.datos,function (data){
				var respuesta = data.respuesta;

				archivos.items($scope.imagenes,$scope.clave).then(
					function(data){
						console.log('Imagenes: ' + data)
						mensajes.alerta(respuesta,'success','top right','done_all');
						$scope.guardando = false;
						$scope.itemForm.$setPristine();
						$scope.inicio();
					},
					function(data){
						mensajes.alerta('Ocurrio un error vuelva a intentarlo','error','top right','done_all');
					},
					function(data){
						console.log('Estatus: ' + data);
					}
				);
			});

		};
		
	}

}