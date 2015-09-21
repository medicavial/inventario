"use strict"

app.controller('proveedorCtrl',proveedorCtrl)
app.controller('proveedoresCtrl',proveedoresCtrl)
app.controller('proveedorEditCtrl',proveedorEditCtrl)

proveedoresCtrl.$inject = ['$rootScope','$mdDialog','datos','proveedores','mensajes'];
proveedorCtrl.$inject = ['$scope','$mdDialog','permisos','proveedores','mensajes', 'datos', 'Upload', '$rootScope'];
proveedorEditCtrl.$inject = ['$scope','$mdDialog','permisos','proveedores','mensajes','informacion'];

function proveedoresCtrl($rootScope,$mdDialog,datos,proveedores,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Proveedores Registrados';
	scope.info = datos;
	scope.total = 0;
	scope.limit = 10;
	scope.page = 1;
	scope.texto = {
      text: 'Proveedores por pagina:',
      of: 'de'
    };
	scope.paginacion = [10,20,30,40];

	scope.nuevo = function(ev) {
	    $mdDialog.show({
	      controller: proveedorCtrl,
	      templateUrl: 'views/proveedor.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true
	    }).then(function(){
	    	scope.info = proveedores.query();
	    });
	};

	scope.edita = function(ev,index) {

		var usuario = scope.info[index];

	    $mdDialog.show({
	      controller: proveedorEditCtrl,
	      templateUrl: 'views/proveedor.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {informacion: usuario }
	    }).then(function(){
	    	scope.info = proveedores.query();
	    });
	};

	scope.confirmacion = function(ev,index) {
	    // Abre ventana de confirmacion

	    // console.log(index);
	    var proveedor = scope.info[index];

	    var confirm = $mdDialog.confirm()
	          .title('¿Desactivar el proveedor?')
	          .content('Puedes activarlo cuando lo necesites nuevamente')
	          .ariaLabel('Desactivar proveedor')
	          .ok('Si')
	          .cancel('No')
	          .targetEvent(ev);

	    $mdDialog.show(confirm).then(function() {

	    	//en caso de decir SI
	    	if (proveedor.PRO_activo) {
	      		proveedor.PRO_activo = 0;
	    	}else{
	    		proveedor.PRO_activo = 1;
	    	}

	      	var datos = {
				nombre:proveedor.PRO_nombre,
				nombrecorto:proveedor.PRO_nombrecorto,
				razon:proveedor.PRO_razonSocial,
				rfc:proveedor.PRO_rfc,
				activo:proveedor.PRO_activo
			}

	      	proveedores.update({proveedor:proveedor.PRO_clave},datos,
	      		function (data){
	      			mensajes.alerta(data.respuesta,'success','top right','done_all');
	      		}
	      	);

	    });
	};

}


function proveedorCtrl($scope,$mdDialog,permisos,proveedores,mensajes, datos, Upload, $rootScope){

	$rootScope.titulo = 'Nuevo Proveedor';

	$scope.permisos = datos;

	$scope.inicio = function(){
		$scope.datos = {
			nombre:'',
			nombrecorto:'',
			rfc:'',
			razon:'',
			activo:true
		}
		$scope.imagenes = [];
		$scope.guardando = false;
	}

	$scope.guardar = function(){

		if ($scope.proveedorForm.$valid) {

			$scope.guardando = true;
			proveedores.save($scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.proveedorForm.$setPristine();
				$scope.inicio();
			});

		};
		
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

function proveedorEditCtrl($scope,$mdDialog,permisos,proveedores,mensajes,informacion){

	$scope.permisos = permisos.query();

	$scope.inicio = function(){

		$scope.datos = {
			nombre:informacion.PRO_nombre,
			nombrecorto:informacion.PRO_nombrecorto,
			razon:informacion.PRO_razon,
			rfc:informacion.PRO_rfc,
			activo:informacion.PRO_activo ? true:false
		}

		$scope.guardando = false;
	}

	$scope.guardar = function(){


		if ($scope.proveedorForm.$valid) {

			$scope.guardando = true;
			proveedores.update({proveedor:informacion.PRO_clave},$scope.datos,function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.proveedorForm.$setPristine();
			});

		};
		
	}

	$scope.cancel = function() {
		$mdDialog.hide();
	};

}
