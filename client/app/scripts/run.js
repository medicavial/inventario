(function(){

	'use strict';

	angular
	.module('app')
	.run(run);

	run.$inject = ['$rootScope', '$state', '$mdSidenav','$mdBottomSheet','auth','webStorage','$window', 'api','$mdMedia','mensajes'];

	function run($rootScope, $state,$mdSidenav,$mdBottomSheet,auth,webStorage,$window, api,$mdMedia, mensajes) {

		var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

		if(window.navigator.standalone && iOS) {
		 	$rootScope.fullScreen = true;
		}

		//seteo inicial de la app
		var url = '';
		$rootScope.atras = false;

		$rootScope.color = '#eee';

		//parametros globales tomados del localStorage
		$rootScope.username = webStorage.session.get('username');
		$rootScope.nombre = webStorage.session.get('nombre');
		$rootScope.id = webStorage.session.get('id');

		$rootScope.permisos = JSON.parse(webStorage.session.get('permisos'));
		
		$rootScope.menu = 'menu';

		//incia el menu;
		$rootScope.resetMenu = function(icono){
			
			$rootScope.iconoAdmin = 'add';
			$rootScope.iconoCatalogos = 'add';
			$rootScope.iconoAlmacen = 'add';
			$rootScope.iconoReportes = 'add';
			$rootScope.iconoPruebas = 'add';

			$rootScope.admin = false;
			$rootScope.catalogos = false;
			$rootScope.almacen = false;
			$rootScope.reportes = false;
			$rootScope.pruebas = false;

		}

		$rootScope.resetMenu();

		// interaccion del menu
		$rootScope.abrirMenu = function(index){			

			if (index == 1) {

				if ($rootScope.admin) {
					$rootScope.iconoAdmin = 'add';
				}else{
					// $rootScope.resetMenu(iconoAdmin);
					$rootScope.iconoAdmin = 'remove';
				}

				$rootScope.admin = !$rootScope.admin;
			};

			if (index == 2) {

				if ($rootScope.catalogos) {
					$rootScope.iconoCatalogos = 'add';
				}else{
					// $rootScope.resetMenu(iconoCatalogos);
					$rootScope.iconoCatalogos = 'remove';
				}

				$rootScope.catalogos = !$rootScope.catalogos;
			};

			if (index == 3) {

				if ($rootScope.almacen) {
					$rootScope.iconoAlmacen = 'add';
				}else{
					// $rootScope.resetMenu(iconoAlmacen);
					$rootScope.iconoAlmacen = 'remove';
				}

				$rootScope.almacen = !$rootScope.almacen;
			};

			if (index == 4) {

				if ($rootScope.reportes) {
					$rootScope.iconoReportes = 'add';
				}else{
					// $rootScope.resetMenu(iconoReportes);
					$rootScope.iconoReportes = 'remove';
				}

				$rootScope.reportes = !$rootScope.reportes;
			};

			if (index == 5) {

				if ($rootScope.pruebas) {
					$rootScope.iconoPruebas = 'add';
				}else{
					// $rootScope.resetMenu(iconoPruebas);
					$rootScope.iconoPruebas = 'remove';
				}

				$rootScope.pruebas = !$rootScope.pruebas;
			};
		}

		$rootScope.toggleSidenav = function(menuId) {
			if ($rootScope.atras) {
				$window.history.back();
			}else{
				$mdSidenav(menuId).toggle();
			}
		};

		$rootScope.muestra = function(ruta) {
		    $state.go(ruta);
		};

		$rootScope.showGridBottomSheet = function($event) {
		    $mdBottomSheet.show({
				templateUrl: 'views/interactivo.html',
				targetEvent: $event
		    });
		};

		$rootScope.logout = function(){
			$mdBottomSheet.hide();
			auth.logout();
		}

		$rootScope.ir = function(ruta){

			if ($mdSidenav('left').isOpen()) {
				$mdSidenav('left').toggle();
			};

			if (ruta == 'index.home') {
				$rootScope.resetMenu();
			};
			$state.go(ruta);
		}

		$rootScope.pdf = function(index){
			$window.open(api + 'reportes/pdf/ordencompra/'+ index, '_blank');
		}

		$rootScope.$on('$stateChangeStart',	function(event, toState, toParams, fromState, fromParams){ 
	        
	        $rootScope.atras = false;

	        url = toState.name;
		    if(url != 'login' && webStorage.session.get('username') == null)
	        {   
	        	event.preventDefault();
	            $state.go('login');
	        }
	        //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
	        if(url == 'login' && webStorage.session.get('username') != null)
	        {
	        	event.preventDefault();
	            $state.go('index.home');
	        }

	        $rootScope.cargando = true;
		});

	    $rootScope.$on('$stateChangeSuccess',	function(event, toState, toParams, fromState, fromParams){ 
	        $rootScope.cargando = false;
	        $rootScope.menu = 'menu';
		});

		$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
			$rootScope.cargando = false;
			mensajes.alerta('Problemas de conexión intentalo nuevamente por favor','error','top right','error');
			event.preventDefault();
            $state.go('index.home');
		});

		$rootScope.verificaVista = function(){
			if (!$mdMedia('gt-md')) {
				return true;
			}else if($rootScope.atras){
				return true;
			}else{
				return false;
			}
		}

	};

})()