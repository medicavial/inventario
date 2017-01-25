(function(){


	'use strict';

	angular.module('app')
	.controller('importarCtrl',importarCtrl)

	importarCtrl.$inject = ['$rootScope','$mdDialog','archivos','busqueda','mensajes'];

	function importarCtrl($rootScope,$mdDialog,archivos,busqueda,mensajes){

		if ($rootScope.permisos.PER_perfiles==0) {
			console.clear();
			console.error('No tiene permiso para estar en esta sección');
			$rootScope.ir('index.home');
		};

		var scope = this;
		$rootScope.tema = 'theme2';
		$rootScope.titulo = 'Importación de Datos';
		scope.cargando = false;

		scope.subir = function(file,$event){

			// console.log(file);
			if (file.type == 'application/vnd.ms-excel' ) {
				
				scope.cargando = true;

				archivos.subeArchivo(file).then( 
					function (data){
						// console.log(data);
						mensajes.alerta('Datos Importados Correctamente','success','top right','done_all');
						scope.cargando = false;
					},function (error){
						// console.log(error);
						mensajes.alerta('Ocurrio un error vuelve a intentarlo','error','top right','error');
						scope.cargando = false;
					},function (progreso){
						// console.log(progreso);
						// scope.cargando = false;
				});

			}else{
				mensajes.alerta('Este formato no esta permitido','error','top right','error');
			}
		}
		

	}

})();