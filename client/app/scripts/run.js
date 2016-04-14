(function(){

	'use strict';

	angular
	.module('app')
	.run(run);

	run.$inject = ['$rootScope', '$state', '$mdSidenav','$mdBottomSheet','auth','webStorage','$window', 'api'];

	function run($rootScope, $state,$mdSidenav,$mdBottomSheet,auth,webStorage,$window, api) {

		var url = '';

		$rootScope.toggleSidenav = function(menuId) {
			$mdSidenav(menuId).toggle();
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
		});

		$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
	            if (handlingRouteChangeError) { return; }
	            handlingRouteChangeError = true;
	            var destination = (current && (current.title ||
	                current.name || current.loadedTemplateUrl)) ||
	                'unknown target';
	            var msg = 'Error routing to ' + destination + '. ' +
	                (rejection.msg || '');

	            /**
	             * Optionally log using a custom service or $log.
	             * (Don't forget to inject custom service)
	             */
	            logger.warning(msg, [current]);

	            /**
	             * On routing error, go to another route/state.
	             */
	            $location.path('/');

	        }
	    );

		$rootScope.username = webStorage.session.get('username');
		$rootScope.nombre = webStorage.session.get('nombre');
		$rootScope.id = webStorage.session.get('id');

	};

})()