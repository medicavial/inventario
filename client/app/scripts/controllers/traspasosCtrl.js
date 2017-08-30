(function(){

	'use strict';

	angular.module('app')
	.controller('traspasoCtrl',traspasoCtrl)

	traspasoCtrl.$inject = ['$scope','$rootScope','$mdDialog','busqueda','operacion','mensajes','datos','$filter','$q','reportes'];

	function traspasoCtrl($scope,$rootScope,$mdDialog,busqueda,operacion,mensajes,datos,$filter,$q,reportes){

		if ($rootScope.permisos.PER_traspasos==0) {
			console.clear();
			console.error('No tiene permiso para estar en esta sección');
			$rootScope.ir('index.home');
		};

		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Nuevo traspaso';

		$scope.almacenes = datos[0].data;

		$scope.inicio = function(){

			$scope.seleccionado = null;
		    $scope.busqueda = null;
		    $scope.consultado = consultado;
		    $scope.item = '';
		    $scope.disponible = '';
		    $scope.itemsAlmacen = [];
		    $scope.lotes = [];
		    $scope.traspasos = [];
		    $scope.cantidadLote = 0;

			$scope.datos = {
				almacenOrigen:'',
				almacenDestino:'',
				item:'',
				itemNombre:'',
				cantidad:'',
				lote:'',
				usuario:$rootScope.id,
				obs:'',
				nombreOrigen:null,
				nombreDestino:null
			}
			console.log($scope.datos);

			$scope.guardando = false;

		}

		$scope.origen = function(origen){
			$scope.obsOrigen = origen;
			$scope.datos.obs = $scope.obsOrigen+' a '+$scope.obsDestino;
			$scope.datos.nombreOrigen=origen;
			console.log($scope.datos.obs);
		}

		$scope.destino = function(destino){
			$scope.obsDestino = destino;
			$scope.datos.obs = $scope.obsOrigen+' a '+$scope.obsDestino;
			$scope.datos.nombreDestino=destino;
			console.log($scope.datos.obs);
		}

		$scope.datosLote = function(lote){
			if (lote) {
				var dato = JSON.parse(lote);
				$scope.datos.lote = dato.LOT_clave;
				$scope.cantidadLote = dato.LOT_cantidad;
				$scope.verificaCantidadLote();
			};
		}

		$scope.verificaCantidadLote = function(){

			if ($scope.cantidadLote > 0 && $scope.cantidadLote < $scope.datos.cantidad && $scope.datos.lote != '') {
				mensajes.alerta('El lote solo tiene ' + $scope.cantidadLote + ' disponible(s)','error','top right','error');
				$scope.datos.cantidad = 0;
			}else if ($scope.cantidadLote == 0 && $scope.datos.cantidad > 0 && $scope.datos.lote != '') {
				mensajes.alerta('Este lote no tiene cantidad disponible','error','top right','error');
			};
		}

		$scope.agregar = function(){

			$scope.traspasos.push({
				almacenOrigen:$scope.datos.almacenOrigen,
				almacenDestino:$scope.datos.almacenDestino,
				item:$scope.datos.item,
				itemNombre:$scope.datos.itemNombre,
				cantidad:$scope.datos.cantidad,
				lote:$scope.datos.lote,
				usuario:$rootScope.id,
				obs:$scope.datos.obs,
				nombreOrigen: $scope.datos.nombreOrigen,
				nombreDestino: $scope.datos.nombreDestino
			});

			console.log($scope.traspasos);

			$scope.datos.item = '';
			$scope.datos.cantidad = '';
			$scope.datos.lote = '';
			$scope.item = '';
    		$scope.disponible = '';
    		$scope.busqueda = '';
    		// $scope.datos.obs = '';
		}

		$scope.guardar = function(){
			// console.log($scope.datos);
			// console.log($scope.traspasos);
			$scope.guardando = true;
			operacion.altaTraspaso($scope.traspasos).success(function (data){
				mensajes.alerta(data.respuesta,'success','top right','done_all');
				$scope.guardando = false;
				$scope.traspasoForm.$setPristine();
				$scope.inicio();
				reportes.traspasoPdf(data.cveTraspaso);
			}).error(function (data){
				mensajes.alerta('Ocurrio un error vuelve a intentarlo','error','top right','error');
				$scope.guardando = false;
			})


			
		}

		$scope.itemsxalmacen = function(clave){

			// console.log(clave);
			
			$scope.seleccionado = null;
		    $scope.busqueda = null;
		    $scope.disponible = '';
		    $scope.itemsAlmacen = [];
		    
			busqueda.itemsAlmacen(clave).success(function (data){
				$scope.itemsAlmacen = data;
			});

		}

		$scope.eliminar = function(index){
			console.log(index);
			$scope.traspasos.splice(index,1);
		}

		$scope.seleccionaItem = function(item){
			$scope.disponible = '';
			console.log(item);
			if (item) {
				$scope.datos.item = item.ITE_clave;
				$scope.datos.itemNombre = item.ITE_nombre;
				$scope.disponible = Number(item.EXI_cantidad);
				busqueda.lotesAlmacenXitem($scope.datos.almacenOrigen,item.ITE_clave).success(function (data){
					$scope.lotes = data; // originalmente solo es esta linea
					//verificamos si es un item que requiere lote
					// if ($scope.lotes.length > 0) {
					if (item.TIT_forzoso == '1') {
						//verificamos si ya hay traspasos almacenados
						if ($scope.traspasos.length>0) {
							//verificamos si hay traspasos del mismo item con el mismo almacén de origen
							for (var i = 0; i < $scope.traspasos.length; i++) {
								if (($scope.traspasos[i].item == $scope.lotes[0].ITE_clave) && ($scope.traspasos[i].almacenOrigen == $scope.datos.almacenOrigen)) {
									console.log('son iguales');
									//actualizamos la existencia total
									$scope.disponible=$scope.disponible-$scope.traspasos[i].cantidad;
									//verificamos si es el mismo lote
									for (var j = 0; j < $scope.lotes.length; j++) {
										if ($scope.lotes[j].LOT_clave == $scope.traspasos[i].lote) {
											//hacemos la resta
											$scope.lotes[j].LOT_cantidad = $scope.lotes[j].LOT_cantidad - $scope.traspasos[i].cantidad;
										};
									};
								};
							};
						};
					};
					//verificamos si es un item que no requiere lote
					// if ($scope.lotes.length == 0) {
					if (item.TIT_forzoso == '0') {
						console.log('este item no tiene lote');
						//verificamos si ya hay traspasos almacenados
						if ($scope.traspasos.length>0) {
							//verificamos si hay traspasos del mismo item con el mismo almacén de origen
							for (var i = 0; i < $scope.traspasos.length; i++) {
								if (($scope.traspasos[i].item == $scope.datos.item) && ($scope.traspasos[i].almacenOrigen == $scope.datos.almacenOrigen)) {
									console.log('mismo item y mismo origen');
									//actualizamos la existencia total
									$scope.disponible=$scope.disponible-$scope.traspasos[i].cantidad;
								};
							};
						};
					};
				});
			};
		}

		$scope.verificaAlmacen = function(ev){
			if ($scope.datos.almacenDestino == $scope.datos.almacenOrigen) {
				mensajes.alerta('No puedes seleccionar el mismo almacen','error','top right','error');
				$scope.datos.almacenDestino = '';
			};
		}

		function cambioTexto(text) {
	      // console.log('Text changed to ' + text);
	    }

	    function consultado(query) {

			var q = $q.defer(),
				response = query ? $filter( 'filter' )( $scope.itemsAlmacen, query ) : $scope.itemsAlmacen;
				q.resolve( response );

			return q.promise;
	    }

	}

})();