"use strict"

//servicio para permisos
function tiposmovimiento($resource,api){

    var tipomovimietno = $resource(api + 'tiposmovimiento/:tipo', {}, {
                'get':    {method:'GET'},
                'save':   {method:'POST'},
                'query':  {method:'GET', isArray:true},
                'update': { method:'PUT' }
            });

    return tipomovimietno;
}

app.factory("tiposmovimiento",tiposmovimiento);