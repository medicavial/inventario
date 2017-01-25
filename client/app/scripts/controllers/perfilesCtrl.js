(function(){

	'use strict';
	
	angular.module('app')
	.controller('perfilCtrl',perfilCtrl)
	.controller('perfilesCtrl',perfilesCtrl)
	.controller('perfilEditCtrl',perfilEditCtrl)

	perfilesCtrl.$inject = ['$rootScope','$mdDialog','datos','permisos','mensajes'];
	perfilCtrl.$inject = ['$scope','$mdDialog','permisos','mensajes'];
	perfilEditCtrl.$inject = ['$scope','$mdDialog','permisos','mensajes','informacion'];

	function perfilesCtrl($rootScope,$mdDialog,datos,permisos,mensajes){

		if ($rootScope.permisos.PER_perfiles==0) {
			console.clear();
			console.error('No tiene permiso para estar en esta sección');
			$rootScope.ir('index.home');
		};

		var scope = this;
		$rootScope.tema = 'theme2';
		$rootScope.titulo = 'Perfiles Registrados';
		scope.info = datos;
		scope.total = 0;
		scope.limit = 10;
		scope.page = 1;
		scope.texto = {
	      text: 'Perfiles por pagina:',
	      of: 'de'
	    };
		scope.paginacion = [10,20,30,40];

		scope.nuevoPerfil = function(ev) {
		    $mdDialog.show({
		      controller: perfilCtrl,
		      templateUrl: 'views/perfil.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true
		    }).then(
		    function(){
		    	scope.info = permisos.query();
		    });
		};

		scope.editaPerfil = function(ev,perfil) {

			// var perfil = scope.info[index];

		    $mdDialog.show({
		      controller: perfilEditCtrl,
		      templateUrl: 'views/perfil.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      locals: {informacion: perfil },
		      closeTo:{bottom: 1500}
		    }).then(
		    function(){
		    	scope.info = permisos.query();
		    });
		};

		scope.confirmacion = function(ev,perfil) {
		    // Abre ventana de confirmacion

		    // console.log(index);
		    // var permiso = scope.info[index];

		    var confirm = $mdDialog.confirm()
		          .title('¿Desactivar el permiso?')
		          .content('Puedes activarlo cuando lo necesites nuevamente')
		          .ariaLabel('Desactivar permiso')
		          .ok('Si')
		          .cancel('No')
		          .targetEvent(ev)
		          .closeTo({
					bottom: 1500
				   });

		    $mdDialog.show(confirm).then(function() {

		    	//en caso de decir SI
		    	if (permiso.PER_activo) {
		      		permiso.PER_activo = 0;
		    	}else{
		    		permiso.PER_activo = 1;
		    	}

		      	var datos = {
		      		nombre : permiso.PER_nombre,
					entradas : permiso.PER_entradas,
					salidas : permiso.PER_salidas,
					traspasos : permiso.PER_traspasos,
					editaItem : permiso.PER_consultaItems,
					desactivaItem : permiso.PER_desactivaItems,
					editaCatalogos : permiso.PER_consultaCatalogo,
					desactivaCatalogos : permiso.PER_desactivaCatalogo,
					autorizaorden : permiso.PER_autorizaOrden,
					modificaorden : permiso.PER_modificaOrden,
					cerrarorden : permiso.PER_cerrarOrden,
					surtir : permiso.PER_surtir,
					facturas : permiso.PER_subirFactura,
					asociar : permiso.PER_asociar,
					activo : permiso.PER_activo
				}

		      	permisos.update({permiso:permiso.PER_clave},datos,
		      		function (data){
		      			mensajes.alerta(data.respuesta,'success','top right','done_all');
		      		}
		      	);

		    });
		};

	}

	function perfilCtrl($scope,$mdDialog,permisos,mensajes){

		$scope.permisos = permisos.query();

		$scope.inicio = function(){
			$scope.datos = {
				nombre:'',
				alertas:false,
	        	conexion:false,
	        	movimientos:false,
	        	traspasos:false,
	        	generaOrden:false,
	        	surtirOrden:false,
	        	cerrarOrden:false,
	        	completaOrden:false,
	        	salidasAgranel:false,
	        	recetaMV:false,
	        	usuarios:false,
	        	perfiles:false,
	        	tipos:false,
	        	catalogos:false,
	        	editaCatalogos:false,
	        	reportes:false,
				activo:true
			}

			$scope.guardando = false;
		}

		$scope.guardar = function(){

			if ($scope.perfilForm.$valid) {

				$scope.guardando = true;
				permisos.save($scope.datos,function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.perfilForm.$setPristine();
					$scope.inicio();
				});

			};
			
		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

	function perfilEditCtrl($scope,$mdDialog,permisos,mensajes,informacion){

		$scope.inicio = function(){

			$scope.datos = {
				nombre : informacion.PER_nombre,
				alertas: informacion.PER_alertas == 1 ? true:false,
	        	conexion: informacion.PER_conexiones == 1 ? true:false,
	        	movimientos: informacion.PER_movimientos == 1 ? true:false,
	        	traspasos: informacion.PER_traspasos == 1 ? true:false,
	        	generaOrden: informacion.PER_generarOrden == 1 ? true:false,
	        	surtirOrden: informacion.PER_surtirOrden == 1 ? true:false,
	        	cerrarOrden: informacion.PER_cerrarOrden == 1 ? true:false,
	        	completaOrden: informacion.PER_completaOrden == 1 ? true:false,
	        	salidasAgranel: informacion.PER_salidasAgranel == 1 ? true:false,
	        	recetaMV: informacion.PER_recetaMV == 1 ? true:false,
	        	usuarios: informacion.PER_usuarios == 1 ? true:false,
	        	perfiles: informacion.PER_perfiles == 1 ? true:false,
	        	tipos: informacion.PER_tipos == 1 ? true:false,
	        	catalogos: informacion.PER_consultaCatalogo == 1 ? true:false,
	        	editaCatalogos: informacion.PER_modificaCatalogo == 1 ? true:false,
	        	reportes: informacion.PER_reportes == 1 ? true:false,
				activo : informacion.PER_activo == 1 ? true:false,

			}

			$scope.guardando = false;
		}

		$scope.guardar = function(){


			if ($scope.perfilForm.$valid) {

				$scope.guardando = true;
				permisos.update({permiso:informacion.PER_clave},$scope.datos,function (data){
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					$scope.guardando = false;
					$scope.perfilForm.$setPristine();
				});

			};
			
		}

		$scope.cancel = function() {
			$mdDialog.hide();
		};

	}

})();