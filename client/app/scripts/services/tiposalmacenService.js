"use strict"

//servicio para permisos
function tiposalmacen($resource,api){

    var TipoItem = $resource(api + 'tiposalmacen/:tipoalmacen', {}, {
                'get':    {method:'GET'},
                'save':   {method:'POST'},
                'query':  {method:'GET', isArray:true},
                'update': { method:'PUT' }
            });

    return TipoItem;
}

app.factory("tiposalmacen",tiposalmacen);