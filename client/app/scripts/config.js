(function(){

	'use strict';

	angular
	.module('app')
	.config(config);

	config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider','$mdThemingProvider','$httpProvider','$compileProvider', '$mdDateLocaleProvider'];

	function config($stateProvider, $urlRouterProvider, $locationProvider,$mdThemingProvider,$httpProvider,$compileProvider, $mdDateLocaleProvider) {

		$compileProvider.debugInfoEnabled(true);

		$mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio','Julio', 'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
		$mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul', 'Ago','Sep','Oct','Nov','Dic'];
		$mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes','Sabado'];
		$mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi' ,'Sa'];

	  	$mdDateLocaleProvider.formatDate = function(date) {
		    return date ? moment(date).format('DD/MM/YYYY') : '';
		};
		  
		$mdDateLocaleProvider.parseDate = function(dateString) {
		    var m = moment(dateString, 'DD/MM/YYYY', true);
		    return m.isValid() ? m.toDate() : new Date(NaN);
		};      

		$urlRouterProvider.otherwise("/home");

		$stateProvider

		.state('login', {
			url: "/login",
			templateUrl: "views/login.html",
			controller: "loginCtrl",
			controllerAs: "sesion"
		})

		.state('index', {
			url: '/',
			abstract:true,
			templateUrl: 'views/base.html'
		})

		.state('index.altaMovimientos',{
			url:'altaMovimientos',
			templateUrl :'views/altaMovimientos.html',
			controller:'altaMovimientosCtrl',
			controllerAs: "am",
			resolve:{
	            datos:function(busqueda,$q,$rootScope){
	            	
	                var promesa 		= $q.defer(),
	            		items 			= busqueda.items(),
	            		tiposMovimiento = busqueda.tiposMovimiento(),
	            		almacenes 		= busqueda.almacenesUsuario($rootScope.id),
	            		tiposajuste 	= busqueda.tiposAjuste();

	            	$q.all([items,tiposMovimiento,almacenes,tiposajuste]).then(function (data){
	            		
	            		promesa.resolve(data);
	            		
	            	});

	                return promesa.promise;
	            }
	        }
		})

		.state('index.almacenes',{
			url:'almacenes',
			templateUrl :'views/almacenes.html',
			controller:'almacenesCtrl',
			controllerAs: "almacenes",
			resolve:{
	            datos:function(almacenes){
	                return almacenes.query().$promise;
	            }
	        }
		})

		.state('index.accionOrden',{
			url:'accionOrden?ordenId',
			templateUrl :'views/accionOrden.html',
			controller 	: function($rootScope,$scope,$stateParams){
				$rootScope.titulo = 'Orden de Compra';
				$scope.orden = $stateParams.ordenId;
			},
			reload:true
		})

		.state('index.conexiones',{
			url:'conexiones',
			templateUrl :'views/conexiones.html',
			controller 	: function($rootScope){
				$rootScope.titulo = 'Conexiones';
			}
		})

		.state('index.configuracion',{
			url:'configuracion',
			templateUrl :'views/configuracion.html',
			controller:'configuracionCtrl',
			controllerAs: "configuracion",
			resolve:{
	            datos:function(busqueda,$rootScope,$q){

	            	var promesa = $q.defer(),
	            		unidades = busqueda.unidadesUsuario($rootScope.id),
	            		items = busqueda.items();

	            	$q.all([unidades,items]).then(
	            		function (data){
	            			var datos = {
	            				unidades:data[0].data,
	            				items:data[1].data
	            			}
	            			promesa.resolve(datos);

	            		},function(error){
	            			promesa.reject(error);
	            		});

	                return promesa.promise;
	               	
	            }
	        }
		})

		.state('index.completar',{
			url:'completar?ordenId',
			templateUrl :'views/completar.html',
			controller 	: 'completarCtrl',
			controllerAs: 'completa',
			resolve:{
	            info:function($stateParams,operacion){
	                return operacion.verificaFaltantes($stateParams.ordenId);
	            }
	        },
			reload:true
		})

		.state('index.detalleItem',{
			url:'detalleItem?itemId',
			templateUrl :'views/item.html',
			controller:'itemEditCtrl',
			controllerAs:'ie',
			resolve:{
	            datos:function(busqueda,$q,$stateParams,items){
	                var promesa = $q.defer(),
	            		tipoitems = busqueda.tiposItem(),
	            		subtipoitems = busqueda.SubTiposItem(),
	            		presentaciones = busqueda.presentaciones(),
	            		unidadesitem = busqueda.unidadesItem(),
	            		item =  items.get({item:$stateParams.itemId}).$promise;
	            	$q.all([tipoitems,subtipoitems,presentaciones,item,unidadesitem]).then(function (data){
	            		promesa.resolve(data);
	            	});

	                return promesa.promise;
	            }
	        }
		})

		.state('index.detalleProveedor',{
			url:'detalleProveedor?proveedorId',
			templateUrl :'views/proveedor.html',
			controller:'proveedorEditCtrl',
			resolve:{
	            datos:function($q,$stateParams,proveedores){
	                return proveedores.get({proveedor:$stateParams.proveedorId}).$promise;;
	            }
	        }
		})

		.state('index.equivalencias',{
			url:'equivalencias',
			templateUrl :'views/equivalencias.html',
			controller:'equivalenciasCtrl',
			controllerAs: "equivalencias",
			resolve:{
	            datos:function(unidadesItem){
	                return unidadesItem.query().$promise;
	            }
	        }
		})

		.state('index.existencias',{
			url:'existencias',
			templateUrl :'views/existencias.html',
			controller:'existenciasCtrl',
			controllerAs: "existencias",
			resolve:{
	            datos:function(busqueda,$rootScope){
	                return busqueda.existencias($rootScope.id);
	            }
	        }
		})

		.state('index.home',{
			url:'home',
			templateUrl :'views/home.html',
			controller:'homeCtrl'
		})

		.state('index.importar',{
			url:'importar',
			templateUrl :'views/importar.html',
			controller:'importarCtrl',
			controllerAs:'imp'
		})

		.state('index.items',{
			url:'items',
			templateUrl :'views/items.html',
			controller:'itemsCtrl',
			controllerAs: "items",
			resolve:{
	            datos:function(items){
	                return items.query().$promise;
	            }
	        }
		})

		.state('index.item',{
			url:'item',
			templateUrl :'views/item.html',
			controller:'itemCtrl',
			controllerAs:'ie',
			resolve:{
	            datos:function(busqueda,$q){
	                var promesa = $q.defer(),
	            		tipoitems = busqueda.tiposItem(),
	            		subtipoitems = busqueda.SubTiposItem(),
	            		unidadesitem = busqueda.unidadesItem(),
	            		presentaciones = busqueda.presentaciones();

	            	$q.all([tipoitems,subtipoitems,presentaciones,unidadesitem]).then(function (data){
	            		promesa.resolve(data);
	            	});

	                return promesa.promise;
	            }
	        }
		})
		
		.state('index.itempro',{
			url:'itempro',
			templateUrl :'views/itempro.html',
			controller:'itemproCtrl',
			controllerAs: "itempro",
			resolve:{
	            datos:function(busqueda){
	                return busqueda.itemsProveedor();
	            }
	        }
		})

		.state('index.movimientos',{
			url:'movimientos',
			templateUrl :'views/movimientos.html',
			controller:'movimientosCtrl',
			controllerAs: "movimientos",
			resolve:{
	            datos:function(busqueda){
	                return busqueda.movimientos();
	            }
	        }
		})

		.state('index.agranel',{
			url:'agranel',
			templateUrl :'views/agranel.html',
			controller:'agranelCtrl',
			controllerAs: "agranel",
			resolve:{
	            datos:function(busqueda){
	                return busqueda.movimientosAgranel();
	            }
	        }
		})

		.state('index.nuevaorden',{
			url:'nuevaorden',
			templateUrl :'views/ordencompra.html',
			controller:'ordenCompraCtrl',
			resolve:{
	            datos:function(busqueda,$rootScope){
	                return busqueda.unidadesUsuario($rootScope.id);
	            }
	        }
		})

		.state('index.ordenescompra',{
			url:'ordenescompra',
			templateUrl :'views/ordenescompra.html',
			controller:'ordenesCompraCtrl',
			controllerAs: "ordenescompra",
			resolve:{
	            datos:function(busqueda,$rootScope){
	                return busqueda.ordenescompra();
	            }
	        }
		})

		.state('index.perfiles',{
			url:'perfiles',
			templateUrl :'views/perfiles.html',
			controller:'perfilesCtrl',
			controllerAs: "perfiles",
			resolve:{
	            datos:function(permisos){
	                return permisos.query().$promise;
	            }
	        }
		})

		.state('index.proveedores',{
			url:'proveedores',
			templateUrl :'views/proveedores.html',
			controller:'proveedoresCtrl',
			controllerAs: "proveedores",
			resolve:{
	            datos:function(proveedores){
	                return proveedores.query().$promise;
	            }
	        }
		})

		.state('index.proveedor',{
			url:'proveedor',
			templateUrl :'views/proveedor.html',
			controller:'proveedorCtrl'
		})

		.state('index.subtipositem',{
			url:'subtipositem',
			templateUrl :'views/subtipositem.html',
			controller:'subTiposItemCtrl',
			controllerAs: "subtipositem",
			resolve:{
	            datos:function(subtipositem){
	                return subtipositem.query().$promise;
	            }
	        }
		})

		.state('index.surtir',{
			url:'surtir?ordenId',
			templateUrl :'views/surtir.html',
			controller 	: 'surtirCtrl',
			resolve:{
	            datos:function($stateParams,busqueda){
	                return busqueda.detalleOrdenCompra($stateParams.ordenId);
	            }
	        },
			reload:true
		})

		.state('index.tipositem',{
			url:'tipositem',
			templateUrl :'views/tipositem.html',
			controller:'tiposItemCtrl',
			controllerAs: "tipositem",
			resolve:{
	            datos:function(tipositem){
	                return tipositem.query().$promise;
	            }
	        }
		})
		
		.state('index.tiposalmacen',{
			url:'tiposalmacen',
			templateUrl :'views/tiposalmacen.html',
			controller:'tiposAlmacenCtrl',
			controllerAs: "tiposalmacen",
			resolve:{
	            datos:function(tiposalmacen){
	                return tiposalmacen.query().$promise;
	            }
	        }
		})

		.state('index.tiposmovimiento',{
			url:'tiposmovimiento',
			templateUrl :'views/tiposmovimiento.html',
			controller:'tiposMovimientoCtrl',
			controllerAs: "tiposmovimiento",
			resolve:{
	            datos:function(tiposmovimiento){
	                return tiposmovimiento.query().$promise;
	            }
	        }
		})

		.state('index.tiposajuste',{
			url:'tiposajuste',
			templateUrl :'views/tiposajuste.html',
			controller:'tiposAjusteCtrl',
			controllerAs: "tiposajuste",
			resolve:{
	            datos:function(tiposajuste){
	                return tiposajuste.query().$promise;
	            }
	        }
		})

		.state('index.tiposorden',{
			url:'tiposorden',
			templateUrl :'views/tiposorden.html',
			controller:'tiposOrdenCtrl',
			controllerAs: "tiposorden",
			resolve:{
	            datos:function(tiposorden){
	                return tiposorden.query().$promise;
	            }
	        }
		})

		.state('index.usuarios',{
			url:'usuarios',
			templateUrl :'views/usuarios.html',
			controller:'usuariosCtrl',
			controllerAs: "usuarios",
			resolve:{
	            datos:function(usuarios){
	                return usuarios.query().$promise;
	            }
	        }
		})

		.state('index.unidades',{
			url:'unidades',
			templateUrl :'views/unidades.html',
			controller:'unidadesCtrl',
			controllerAs: "unidades",
			resolve:{
	            datos:function(unidades){
	                return unidades.query().$promise;
	            }
	        }
		})

		.state('index.usualm',{
			url:'usualm',
			templateUrl :'views/usuarioalmacen.html',
			controller:'usualmCtrl',
			controllerAs: "usualm",
			resolve:{
	            datos:function(busqueda,$q){
	            	var promesa = $q.defer(),
	            		usuarios = busqueda.usuariosAlmacen();

	            	$q.all([usuarios]).then(function (data){
	            		promesa.resolve(data);
	            	});

	                return promesa.promise;
	            }
	        }
		})

		.state('index.usualmNuevo',{
			url:'usualmNuevo?usuario',
			templateUrl :'views/almacenusuario.html',
			controller:'nuevoUsualmCtrl',
			controllerAs: "usualm",
			resolve:{
	            datos:function(busqueda,$q,$stateParams){
	            	var promesa = $q.defer(),
	            		usuarios = busqueda.usuarios();

	            	$q.all([usuarios]).then(function (data){
	            		promesa.resolve(data);
	            	});

	                return promesa.promise;
	            }
	        }
		})

		.state('index.traspaso',{
			url:'traspaso',
			templateUrl :'views/traspaso.html',
			controller:'traspasoCtrl',
			resolve:{
	            datos:function($rootScope,busqueda,$q){
	                var promesa = $q.defer(),
	            		almacenes = busqueda.almacenesUsuario($rootScope.id);
	            	$q.all([almacenes]).then(function (data){
	            		promesa.resolve(data);
	            	});

	                return promesa.promise;
	            }
	        }
		})

		.state('index.receta',{
			url:'receta',
			templateUrl :'views/receta.html',
			controller:'recetaCtrl',
			controllerAs: "receta",
			resolve:{
				datos:function(busqueda,$q){
					var promesa = $q.defer(),
	            		tipoitems = busqueda.tiposItem(),
						items = busqueda.items();
	            	$q.all([tipoitems,items]).then(function (data){
	            		promesa.resolve(data);
	            	});
	                return promesa.promise;

				}
			}
		})

		.state('index.reporteExistencias',{
			url:'reporteExistencias',
			templateUrl :'views/reporteExistencias.html',
			controller:'reporteExistenciasCtrl',
			controllerAs: "existencia",
			resolve:{
	            datos:function(busqueda,$q,$rootScope){
	                var promesa   = $q.defer(),
	            		unidades  = busqueda.unidadesUsuario($rootScope.id),
	            		tipoitems = busqueda.tiposItem(),
	            		items 	  = busqueda.items();
	            	$q.all([unidades,items,tipoitems]).then(function (data){
	            		promesa.resolve(data);
	            	});

	                return promesa.promise;
	            }
	        }
		})

		.state('index.reporteItems',{
			url:'reporteItems',
			templateUrl :'views/reporteItems.html',
			controller:'reporteItemsCtrl',
			controllerAs: "itm"
		})

		.state('index.reporteLotes',{
			url:'reporteLotes',
			templateUrl :'views/reporteLotes.html',
			controller:'reporteLotesCtrl',
			controllerAs: "lot",
			resolve:{
	            datos:function(busqueda,$q,$rootScope){
	                var promesa   = $q.defer(),
	            		unidades  = busqueda.unidadesUsuario($rootScope.id),
	            		tipoitems = busqueda.tiposItem(),
	            		items 	  = busqueda.items();
	            	$q.all([unidades,items,tipoitems]).then(function (data){
	            		promesa.resolve(data);
	            	});

	                return promesa.promise;
	            }
	        }
		})

		.state('index.reporteMovimientos',{
			url:'reporteMovimientos',
			templateUrl :'views/reporteMovimientos.html',
			controller:'reporteMovimientosCtrl',
			controllerAs: "mov",
			resolve:{
	            datos:function(busqueda,$q,$rootScope){
	                var promesa   = $q.defer(),
	            		unidades  = busqueda.unidadesUsuario($rootScope.id),
	            		tipoitems = busqueda.tiposItem(),
	            		items 	  = busqueda.items();
	            	$q.all([unidades,items,tipoitems]).then(function (data){
	            		promesa.resolve(data);
	            	});

	                return promesa.promise;
	            }
	        }
		})

		.state('index.reporteOrdenes',{
			url:'reporteOrdenes',
			templateUrl :'views/reporteOrdenes.html',
			controller:'reporteOrdenesCtrl',
			controllerAs: "ordenes",
			resolve:{
	            datos:function(busqueda,$q,$rootScope){
	                var promesa = $q.defer(),
	            		unidades = busqueda.unidadesUsuario($rootScope.id),
	            		items 	 = busqueda.items();
	            	$q.all([unidades,items]).then(function (data){
	            		promesa.resolve(data);
	            	});

	                return promesa.promise;
	            }
	        }
		})

		.state('index.prueba',{
			url:'prueba',
			templateUrl :'views/prueba.html',
			controller:'pruebaCtrl',
			controllerAs: "prueba",
			resolve:{
	            datos:function(proveedores){
	                return proveedores.query().$promise;
	            }
	        }
		})



		$locationProvider.html5Mode(true);

	    $mdThemingProvider.theme('theme1')
		.primaryPalette('indigo')
	    .accentPalette('red');

	    $mdThemingProvider.theme('theme2')
		.primaryPalette('deep-orange')
		.warnPalette('indigo')
	    .accentPalette('red');

	    $mdThemingProvider.theme('theme3')
		.primaryPalette('neonBlue')
	    .accentPalette('red');

	    $mdThemingProvider.theme('theme4')
		.primaryPalette('blue-grey')
	    .accentPalette('red');

	    $mdThemingProvider.theme('theme5')
		.primaryPalette('neonGreen')
	    .accentPalette('red');

	    $mdThemingProvider.theme('theme6')
		.primaryPalette('deep-purple')
	    .accentPalette('red');

	    $mdThemingProvider.theme('docs-dark')
		.primaryPalette('red')
		.dark();

		var neonBlueMap = $mdThemingProvider.extendPalette('blue', {
			'500': '#3175E7',
			'contrastDefaultColor': 'light'
		});

		var neonGreenMap = $mdThemingProvider.extendPalette('green', {
			'500': '#259B24',
			'contrastDefaultColor': 'light'
		});

		
		// Register the new color palette map with the name <code>neonRed</code>
		$mdThemingProvider.definePalette('neonBlue', neonBlueMap);
		$mdThemingProvider.definePalette('neonGreen', neonGreenMap);
		
	    $mdThemingProvider.setDefaultTheme('theme1');
	    $mdThemingProvider.alwaysWatchTheme(true);

	    // console.log($mdThemingProvider);

	    $httpProvider.defaults.timeout = 1000;
	  	
	};

})();
