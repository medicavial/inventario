"use strict"

//servicio para permisos
function proveedores($resource,api){

    var Proveedor = $resource(api + 'proveedores/:proveedor', {}, {
                'get':    {method:'GET'},
                'save':   {method:'POST'},
                'query':  {method:'GET', isArray:true},
                'update': { method:'PUT' }
            });

    return Proveedor;
}

app.factory("proveedores",proveedores);