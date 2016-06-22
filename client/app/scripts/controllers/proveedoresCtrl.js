(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('proveedorCtrl',proveedorCtrl)
	.controller('proveedoresCtrl',proveedoresCtrl)
	.controller('proveedorEditCtrl',proveedorEditCtrl)

	proveedoresCtrl.$inject = ['$rootScope','$mdDialog','datos','proveedores','mensajes'];
	proveedorCtrl.$inject = ['$scope','$mdDialog','proveedores','mensajes', 'archivos' , 'Upload', '$rootScope'];
	proveedorEditCtrl.$inject = ['$scope','$mdDialog','proveedores','mensajes','datos', 'archivos' ,'Upload', '$rootScope'];

	function proveedoresCtrl($rootScope,$mdDialog,datos,proveedores,mensajes){

		var scope = this;
		$rootScope.tema = 'theme3';
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

		scope.confirmacion = function(ev,proveedor) {
		    // Abre ventana de confirmacion

		    // console.log(index);
		    // var proveedor = scope.info[index];

		    var confirm = $mdDialog.confirm()
		          .title('¿Desactivar el proveedor?')
		          .content('Puedes activarlo cuando lo necesites nuevamente')
		          .ariaLabel('Desactivar proveedor')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev)
		          .closeTo({
					bottom: 1500
				  });

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


	function proveedorCtrl($scope,$mdDialog,proveedores,mensajes,archivos, Upload, $rootScope){

		$rootScope.titulo = 'Nuevo Proveedor';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';
		
		$scope.inicio = function(){
			
			$scope.datos = {
				nombre:'',
				nombrecorto:'',
				rfc:'',
				razon:'',
				correo1:'',
				correo2:'',
				activo: true
			}

			$scope.imagenes = [];
			$scope.guardando = false;

		}

		$scope.guardar = function(){

			if ($scope.proveedorForm.$valid) {

				$scope.guardando = true;

				proveedores.save($scope.datos,function (data){
					// mensajes.alerta(data.respuesta,'success','top right','done_all');
					var respuesta = data.respuesta;

					archivos.proveedores($scope.imagenes,data.clave).then(

						function(data){
							console.log('Imagenes: ' + data);
							mensajes.alerta(respuesta,'success','top right','done_all');
							$scope.guardando = false;
							$scope.proveedorForm.$setPristine();
							$scope.inicio();
						},
						function(error){
							mensajes.alerta('Ocurrio un error al subir las imagenes intentelo nuevamente editando el item','error','top right','done_all');
							$scope.guardando = false;
							$scope.proveedorForm.$setPristine();
							$scope.inicio();
						},
						function(data){
							console.log('Estatus: ' + data);
						}

					);
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

	}

	function proveedorEditCtrl($scope,$mdDialog,proveedores,mensajes,datos, archivos ,Upload, $rootScope){

		$rootScope.titulo = 'Edita Proveedor';
		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		$scope.inicio = function(){

			$scope.datos = {
				nombre:datos.datos.PRO_nombre,
				nombrecorto:datos.datos.PRO_nombrecorto,
				razon:datos.datos.PRO_razonSocial,
				rfc:datos.datos.PRO_rfc,
				correo1:datos.datos.PRO_correo1,
				correo2:datos.datos.PRO_correo2,
				activo:datos.datos.PRO_activo ? true:false
			}

			$scope.imagenes = [];
			$scope.imagenesguardadas = datos.archivos.imagenes ? datos.archivos.imagenes : [];

			$scope.guardando = false;

		}

		$scope.guardar = function(){

			if ($scope.proveedorForm.$valid) {

				$scope.guardando = true;
				proveedores.update({proveedor:datos.datos.PRO_clave},$scope.datos,function (data){

					var respuesta = data.respuesta;
					
					archivos.proveedores($scope.imagenes,data.clave).then(

						function(data){
							console.log('Imagenes: ' + data);
							mensajes.alerta(respuesta,'success','top right','done_all');
							$scope.guardando = false;
							$scope.proveedorForm.$setPristine();
							// $scope.inicio();
						},
						function(error){
							console.log(error);
							mensajes.alerta('Ocurrio un error al subir las imagenes intentelo nuevamente editando el proveedor','error','top right','done_all');
							$scope.guardando = false;
							$scope.proveedorForm.$setPristine();
							// $scope.inicio();
						},
						function(data){
							console.log('Estatus: ' + data);
						}

					);

					// mensajes.alerta(data.respuesta,'success','top right','done_all');
					// $scope.guardando = false;
					// $scope.proveedorForm.$setPristine();
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

		$scope.eliminaImagenGuardad = function(index){

			mensajes.alerta('Eliminando imagen','','top right','');

			var imagen = $scope.imagenesguardadas[index];
			archivos.eliminaItem(imagen,$scope.clave).success(function (data){
				$scope.imagenesguardadas.splice(index,1);
			});
		}

	}

})();