function operacion($http, api){
    return{
        altaAlmacenes : function(datos)
        {
            return $http.post(api + 'operacion/usuario/almacenes',datos);
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
        bajaAlmacen : function(almacen,usuario)
        {
            return $http.get(api + 'operacion/elimina/almacen/'+almacen+'/'+usuario);
        }
    }
}

app.factory("operacion",operacion);

