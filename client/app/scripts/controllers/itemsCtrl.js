(function(){

	'use strict';

	angular.module('app')
	.controller('itemCtrl',itemCtrl)
	.controller('itemsCtrl',itemsCtrl)
	.controller('itemEditCtrl',itemEditCtrl)

	itemsCtrl.$inject 	 = ['$rootScope','$mdDialog','datos','items','mensajes','webStorage'];
	itemCtrl.$inject 	 = ['$mdDialog','busqueda','items','mensajes', '$rootScope','datos','archivos','$mdConstant'];
	itemEditCtrl.$inject = ['$mdDialog','busqueda','items','mensajes', '$rootScope','datos','archivos','$mdConstant'];


	function itemsCtrl($rootScope,$mdDialog,datos,items,mensajes, webStorage){

		var scope = this;
		$rootScope.tema = 'theme3';
		$rootScope.titulo = 'Items Registrados';
		scope.info = datos;
		scope.total = 0;
		scope.order = webStorage.session.get('ordenItems') == undefined ? '' : webStorage.session.get('ordenItems');
		scope.page = webStorage.session.get('paginaItems') == undefined ? 1 : webStorage.session.get('paginaItems');
		scope.limit = webStorage.session.get('limiteItems') == undefined ? 10 : webStorage.session.get('limiteItems');
		scope.query = webStorage.session.get('queryItems') == undefined ? '' : webStorage.session.get('queryItems');

		scope.onPaginationChange = function (page, limit) {
		    webStorage.session.add('paginaItems',page);
		    webStorage.session.add('limiteItems',limit);
		};

		scope.onOrderChange = function (order) {
			webStorage.session.add('ordenItems',order);
		};

		scope.guardaBusqueda = function(){
			webStorage.session.add('queryItems',scope.query);
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

		scope.edita = function(ev,item) {

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

		scope.confirmacion = function(ev,item) {
		    // Abre ventana de confirmacion

		    // console.log(index);
		    // var item = scope.info[index];
		    console.log(scope.total);
			console.log(scope.limit);
			console.log(scope.page);
			console.log(scope.query);

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

		      	items.remove({item:item.ITE_clave},datos,
		      		function (data){
		      			mensajes.alerta(data.respuesta,'success','top right','done_all');
		      		}
		      	);

		    });
		};

	}

	function itemCtrl($mdDialog,busqueda,items,mensajes, $rootScope,datos,archivos,$mdConstant){

		var scope = this;
		$rootScope.titulo = 'Nuevo Item';
		scope.tipoitems = datos[0].data;
		scope.subtipoitems = datos[1].data;
		scope.presentaciones = datos[2].data;
		scope.unidades = datos[3].data;
		scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];

		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';

		scope.inicio = function(){
			
			scope.sustancias = [];
			scope.imagenes = [];
			scope.guardando = false;

			scope.datos = {
				nombre:'',
				precio:'',
				cantidad:'',
				codigo:'',
				codigoean:'',
				tipo:'',
				subtipo:'',
				presentacion:'',
				clasificacion:'',
				sustancia:scope.sustancias,
				posologia:'',
				presentacionDesc:'',
				agranel:false,
				segmentado:false,
				segmentadoReceta:false,
				receta:false,
				talla:false,
				unidad:'',
				cantidadCaja :'',
				activo:true
			}

		}

		scope.guardar = function(){

			scope.guardando = true;

			items.save(scope.datos,function (data){
				var respuesta = data.respuesta;

				archivos.items(scope.imagenes,data.clave).then(
					function(data){
						console.log('Imagenes: ' + data)
						mensajes.alerta(respuesta,'success','top right','done_all');
						scope.guardando = false;
						scope.itemForm.$setPristine();
						scope.inicio();
					},
					function(data){
						mensajes.alerta('Ocurrio un error al subir las imagenes intentelo nuevamente editando el proveedor','error','top right','done_all');
						scope.guardando = false;
						scope.itemForm.$setPristine();
						scope.inicio();
					},
					function(data){
						console.log('Estatus: ' + data);
					}
				);
			},function (error){
				if (error.status == 500) {
					mensajes.alerta('El Codigo de Item ya existe','error','top right','error');
				}else{
					mensajes.alerta('Ocurrio un error con su conexion a internet','error','top right','error');
				}
				scope.guardando = false;
			});
			// console.log(scope.datos);
			// console.log(scope.imagenes);
		}


		scope.verificador = function(){

			if (scope.itemForm.$valid && scope.datos.tipo != 1) {
				return false;
			}else if(scope.itemForm.$valid && scope.datos.tipo == 1){
				if (scope.sustancias && scope.datos.posologia) {
					return false;
				}else{
					return true;
				}
			}else{
				return true;
			}
		}

		scope.upload = function(files,file,event){
			if (files && files.length) {
				for (var i = 0; i < files.length; i++) {
		        	scope.imagenes.push(files[i]);
		        }
		    }
		}

		scope.eliminaImagen = function(index){
			scope.imagenes.splice(index,1);
		}


		scope.cancel = function() {
			$mdDialog.hide();
		};

	}

	function itemEditCtrl($mdDialog,busqueda,items,mensajes, $rootScope,datos,archivos,$mdConstant){

		$rootScope.titulo = 'Detalle de Item';

		$rootScope.atras = true;
		$rootScope.menu = 'arrow_back';
		var scope = this;
		scope.tipoitems = datos[0].data;
		scope.subtipoitems = datos[1].data;
		scope.presentaciones = datos[2].data;
		scope.unidades = datos[4].data;
		scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];

		scope.sustancias = datos[3].datos.ITE_sustancia ? datos[3].datos.ITE_sustancia.split(","):[];
		scope.clave = datos[3].datos.ITE_clave;
		scope.datos = {
			nombre:datos[3].datos.ITE_nombre,
			codigo:datos[3].datos.ITE_codigo,
			precio:datos[3].datos.ITE_precioventa,
			cantidad:datos[3].datos.ITE_cantidadtotal,
			presentacionDesc:datos[3].datos.ITE_presentacion,
			codigoean:datos[3].datos.ITE_codigoean,
			tipo:datos[3].datos.TIT_clave,
			subtipo:datos[3].datos.STI_clave,
			sustancia: scope.sustancias,
			posologia:datos[3].datos.ITE_posologia,
			presentacion:datos[3].datos.PRE_clave,
			agranel:Number(datos[3].datos.ITE_agranel) ? true:false,
			segmentado:Number(datos[3].datos.ITE_segmentable) ? true:false,
			segmentadoReceta:Number(datos[3].datos.ITE_noSegmentableReceta) ? true:false,
			talla:Number(datos[3].datos.ITE_talla) ? true:false,
			receta:Number(datos[3].datos.ITE_receta) ? true:false,
			unidad:datos[3].datos.UTI_clave,
			cantidadCaja :Number(datos[3].datos.ITE_cantidadCaja),
			activo:Number(datos[3].datos.ITE_activo) ? true:false
		}
		
		scope.imagenesguardadas = datos[3].archivos ? datos[3].archivos : [];

		scope.inicio = function(){

			scope.imagenes = [];
			scope.guardando = false;
		}


		scope.verificador = function(){

			if (scope.itemForm.$valid && scope.datos.tipo != 1) {
				return false;
			}else if(scope.itemForm.$valid && scope.datos.tipo == 1){
				if (scope.sustancias && scope.datos.posologia) {
					return false;
				}else{
					return true;
				}
			}else{
				return true;
			}
		}

		scope.upload = function(files,file,event){
			if (files && files.length) {
				for (var i = 0; i < files.length; i++) {
		        	scope.imagenes.push(files[i]);
		        }
		    }
		}

		scope.eliminaImagen = function(index){
			scope.imagenes.splice(index,1);
		}

		scope.eliminaImagenGuardada = function(index){

			mensajes.alerta('Eliminando imagen','','top right','');
			var imagen = scope.imagenesguardadas[index];
			console.log(imagen);
			archivos.eliminaItem(imagen,scope.clave).success(function (data){
				scope.imagenesguardadas.splice(index,1);
			});
		
		}

		scope.guardar = function(){


			if (scope.itemForm.$valid) {

				scope.guardando = true;
				items.update({item:scope.clave},scope.datos,function (data){
					var respuesta = data.respuesta;

					archivos.items(scope.imagenes,scope.clave).then(
						function(data){
							console.log('Imagenes: ' + data)
							mensajes.alerta(respuesta,'success','top right','done_all');
							scope.guardando = false;
							scope.itemForm.$setPristine();
							scope.inicio();
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

})();