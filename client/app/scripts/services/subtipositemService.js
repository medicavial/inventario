"use strict"

//servicio para permisos
function subtipositem($resource,api){

    var TipoItem = $resource(api + 'subtipositem/:subtipoitem', {}, {
                'get':    {method:'GET'},
                'save':   {method:'POST'},
                'query':  {method:'GET', isArray:true},
                'update': { method:'PUT' }
            });

    return TipoItem;
}

app.factory("subtipositem",subtipositem);