function operacion($http, api,$q,busqueda){
    return{
        altaAlmacenes : function(datos)
        {
            return $http.post(api + 'operacion/usuario/almacenes',datos);
        },
        altaConfiguracion : function(datos)
        {
            return $http.post(api + 'operacion/configuraciones',datos);
        },
        altaItempro :function(datos){
            return $http.post(api + 'operacion/item/proveedor',datos);
        },
        altaMovimiento :function(datos){
            return $http.post(api + 'operacion/movimiento',datos);
        },
        altaTraspaso :function(datos){
            return $http.post(api + 'operacion/traspaso',datos);
        },
        bajaAlmacen : function(almacen,usuario){
            return $http.get(api + 'operacion/elimina/almacen/'+almacen+'/'+usuario);
        },
        itemsAlmacenes : function(unidad,almacenes)
        {
            return $http.post(api + 'operacion/items/almacenes/' + unidad,almacenes);
        },
        infoUnidad : function(unidad){
            var promesa   = $q.defer(),
                almacenes = busqueda.almacenesUnidad(unidad),
                items     = busqueda.itemsUnidad(unidad);

            $q.all([almacenes,items]).then( 
                function (data){
                    promesa.resolve(data);
                },
                function (error){
                    promesa.reject('Hubo un problema favor de reintentarlo');
                }
            );

            return promesa.promise;
        },
        proveedoresItems : function(items)
        {
            return $http.post(api + 'operacion/proveedores/items',items);
        }
    }
}

app.factory("operacion",operacion);

