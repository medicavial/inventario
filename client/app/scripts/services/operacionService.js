function operacion($http, api){
    return{
        altaAlmacenes : function(datos)
        {
            return $http.post(api + 'operacion/usuario/almacenes',datos);
        },
        bajaAlmacen : function(almacen,usuario)
        {
            return $http.get(api + 'operacion/elimina/almacen/'+almacen+'/'+usuario);
        },
        altaItempro :function(datos){
            return $http.post(api + 'operacion/item/proveedor',datos);
        }
    }
}

app.factory("operacion",operacion);

