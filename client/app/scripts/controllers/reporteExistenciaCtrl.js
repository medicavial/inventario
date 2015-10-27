"use strict"


app.controller('reporteExistenciasCtrl',reporteExistenciasCtrl)


reporteExistenciasCtrl.$inject = ['$rootScope','busqueda','mensajes','datos','reportes'];



function reporteExistenciasCtrl($rootScope,busqueda,mensajes,datos,reportes){

	var scope = this;
	$rootScope.tema = 'theme1';
	$rootScope.titulo = 'Existencias';
	scope.unidades = datos[0].data;
	scope.total = 0;
	scope.limit = 10;
	scope.page = 1;
	scope.texto = {
      text: 'Resultados por pagina:',
      of: 'de'
    };
	scope.paginacion = [10,20,30,40];

	scope.inicio = function(){
		scope.items = datos[1].data;
		scope.datos = {
			unidad:'',
			almacen:'',
			item:''
		}
	}

	scope.cargaAlmacenes = function(unidad){
		busqueda.almacenesUnidad(unidad).success(function (data){
				console.log(data);
				scope.almacenes = data;
		});
	};

	scope.cargaItems = function(almacen){
		busqueda.itemsAlmacen(almacen).success(function (data){
			scope.items = data;
		});
	};

	scope.buscar = function(){
		reportes.existencias(scope.datos).success(function (data){
			scope.info = data;
			scope.inicio();
		})
	}

	
}

