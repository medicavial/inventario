"use strict"

//servicio para permisos
function tipositem($resource,api){

    var TipoItem = $resource(api + 'tipositem/:tipoitem', {}, {
                'get':    {method:'GET'},
                'save':   {method:'POST'},
                'query':  {method:'GET', isArray:true},
                'update': { method:'PUT' }
            });

    return TipoItem;
}

app.factory("tipositem",tipositem);