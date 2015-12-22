"use strict"

//servicio para permisos
function unidadesItem($resource,api){

    var unidad = $resource(api + 'unidadesitem/:id', {}, {
                'get':    {method:'GET'},
                'save':   {method:'POST'},
                'query':  {method:'GET', isArray:true},
                'update': { method:'PUT' }
            });

    return unidad;
}

app.factory("unidadesItem",unidadesItem);