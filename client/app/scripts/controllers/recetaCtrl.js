(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('recetaCtrl',recetaCtrl)
	.controller('loteRecetaCtrl',loteRecetaCtrl)
	.controller('itemRecetaCtrl',itemRecetaCtrl)

	recetaCtrl.$inject = ['$scope','$rootScope', 'busqueda', 'datos', 'operacion', '$mdDialog', 'mensajes'];

	function recetaCtrl($scope, $rootScope, busqueda, datos, operacion, $mdDialog, mensajes){

		var scope = this;
		$rootScope.cargando = false;
		$rootScope.tema = 'theme1';
		$rootScope.titulo = 'Surtir receta';
		scope.items = datos[1].data;
		scope.tipoItems = datos[0].data;
		scope.surtiendo = false;

		scope.inicio = function(){
			scope.receta = '';
			scope.datos = [];
		}

		scope.surtirItem = function(valor){


			// console.log(valor);
			if (valor.lote == '') {
				mensajes.alerta('Debes ingresar un lote para surtir item','error','top right','error');
			}else{
				scope.surtiendo = true;
				operacion.surtirItem(valor).success(function (data){

					scope.surtiendo = false;
					mensajes.alerta(data.respuesta,'success','top right','done_all');
					valor.surtido = true;

				}).error(function (data){
					scope.surtiendo = false;
					mensajes.alerta('Ocurrio un error de conexion verifica que el item se haya surtido por favor','error','top right','error');
				});
			}
		}

		scope.verificaExistencia = function(index,ev){

			var item = scope.datos[index];

			console.log(item);

			if (scope.valorAnterior != item.item) {

				item.surtido = true;

				var confirm = $mdDialog.confirm()
		            .title('Cambio de Item')
		            .content('¿Seguro que quieres cambiar de item puede que la existencia cambie?')
		            .ariaLabel('Confirmación')
		            .targetEvent(ev)
		            .ok('SI')
		            .cancel('NO');
		        $mdDialog.show(confirm).then(function() {
		            
		            operacion.cambiaItem(item).then(
	            	function (data){
	            		item.existencia = data.EXI_clave;
	            		item.surtido = false;
	            	},function (error){
	            		mensajes.alerta(error,'error','top right','error');
	            		item.item = scope.valorAnterior;
	            		item.surtido = false;
	            	})
		        	

		        }, function() {
		            item.item = scope.valorAnterior;
		        });

			};
		}


		scope.ingresaLote = function(index,ev) {
		    $mdDialog.show({
		      controller: loteRecetaCtrl,
		      templateUrl: 'views/loteReceta.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false
		    }).then(function(){
		    });
		};

		scope.ingresaItem = function(index,ev) {
		    $mdDialog.show({
		      controller: itemRecetaCtrl,
		      templateUrl: 'views/itemReceta.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false
		    }).then(function(){
		    });
		};

		scope.buscaReceta = function(){

			scope.cargando = true;
			scope.datos = [];

			busqueda.receta(scope.receta).success(function (data){
				scope.datos = data;
				console.log(data)
				scope.cargando = false;
			}).error(function (data){
				scope.cargando = false;
			});
		}

	}

	function loteRecetaCtrl($scope){

	}

	function itemRecetaCtrl($scope){

	}

})();