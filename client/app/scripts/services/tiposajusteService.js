"use strict"

//servicio para permisos
function tiposajuste($resource,api){

    var tipoajuste = $resource(api + 'tiposajuste/:tipo', {}, {
                'get':    {method:'GET'},
                'save':   {method:'POST'},
                'query':  {method:'GET', isArray:true},
                'update': { method:'PUT' }
            });

    return tipoajuste;
}

app.factory("tiposajuste",tiposajuste);