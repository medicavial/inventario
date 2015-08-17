"use strict"

app.controller('itemCtrl',itemCtrl)
app.controller('itemsCtrl',itemsCtrl)
app.controller('itemEditCtrl',itemEditCtrl)

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


function itemCtrl($scope,$mdDialog,busqueda,items,mensajes){

	busqueda.tiposItem().then(function (info){
		$scope.tipoitems = info.data;
	});

	busqueda.SubTiposItem().then(function (info){
		$scope.subtipoitems = info.data;
	});

	$scope.inicio = function(){
		$scope.datos = {
			nombre:'',
			precio:'',
			cantidad:'',
			tipo:'',
			subtipo:'',
			activo:true
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){

		if ($scope.itemForm.$valid) {

			$scope.guardando = true;
			items.save($scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.itemForm.$setPristine();
				$scope.inicio();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}

function itemEditCtrl($scope,$mdDialog,busqueda,items,mensajes,informacion){

	busqueda.tiposItem().then(function (info){
		$scope.tipoitems = info.data;
	});

	busqueda.SubTiposItem().then(function (info){
		$scope.subtipoitems = info.data;
	});

	$scope.inicio = function(){

		$scope.datos = {
			nombre:informacion.ITE_nombre,
			precio:informacion.ITE_precioventa,
			cantidad:informacion.ITE_cantidadtotal,
			tipo:informacion.TIT_clave,
			subtipo:informacion.STI_clave,
			activo:informacion.ITE_activo ? true:false
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){


		if ($scope.itemForm.$valid) {

			$scope.guardando = true;
			items.update({item:informacion.ITE_clave},$scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.itemForm.$setPristine();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}