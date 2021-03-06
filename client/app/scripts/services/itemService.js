"use strict"

//servicio para permisos
function items($resource,api){

    var Item = $resource(api + 'items/:item', {}, {
                'get':    {method:'GET'},
                'save':   {method:'POST'},
                'query':  {method:'GET', isArray:true},
                'update': { method:'PUT' }
            });

    return Item;
}

app.factory("items",items);