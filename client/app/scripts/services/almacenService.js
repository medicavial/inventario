"use strict"

//servicio para permisos
function almacenes($resource,api){

    var Almacen = $resource(api + 'almacenes/:almacen', {}, {
                'get':    {method:'GET'},
                'save':   {method:'POST'},
                'query':  {method:'GET', isArray:true},
                'update': { method:'PUT' }
            });

    return Almacen;
}

app.factory("almacenes",almacenes);