"use strict"

app.controller('perfilCtrl',perfilCtrl)
app.controller('perfilesCtrl',perfilesCtrl)
app.controller('perfilEditCtrl',perfilEditCtrl)

perfilesCtrl.$inject = ['$rootScope','$mdDialog','datos','permisos','mensajes'];
perfilCtrl.$inject = ['$scope','$mdDialog','permisos','mensajes'];
perfilEditCtrl.$inject = ['$scope','$mdDialog','permisos','mensajes','informacion'];

function perfilesCtrl($rootScope,$mdDialog,datos,permisos,mensajes){

	var scope = this;
	$rootScope.tema = 'theme1';
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

	scope.editaPerfil = function(ev,index) {

		var perfil = scope.info[index];

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

	scope.confirmacion = function(ev,index) {
	    // Abre ventana de confirmacion

	    // console.log(index);
	    var permiso = scope.info[index];

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
			entradas:false,
        	salidas:false,
        	traspasos:false,
        	editaItem:false,
        	desactivaItem:false,
        	editaCatalogos:false,
        	desactivaCatalogos:false,
        	autorizaorden:false,
        	modificaorden:false,
        	cerrarorden:false,
        	surtir:false,
        	facturas:false,
        	asociar:false,
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
			entradas : informacion.PER_entradas ? true:false,
			salidas : informacion.PER_salidas ? true:false,
			traspasos : informacion.PER_traspasos ? true:false,
			editaItem : informacion.PER_consultaItems ? true:false,
			desactivaItem : informacion.PER_desactivaItems ? true:false,
			editaCatalogos : informacion.PER_consultaCatalogo ? true:false,
			desactivaCatalogos : informacion.PER_desactivaCatalogo ? true:false,
			autorizaorden : informacion.PER_autorizaOrden ? true:false,
			modificaorden : informacion.PER_modificaOrden ? true:false,
			cerrarorden : informacion.PER_cerrarOrden ? true:false,
			surtir : informacion.PER_surtir ? true:false,
			facturas : informacion.PER_subirFactura ? true:false,
			asociar : informacion.PER_asociar ? true:false,
			activo : informacion.PER_activo ? true:false
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

