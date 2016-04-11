(function(){

    "use strict"
    
    angular
    .module('app')
    .factory("items",items);

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

})();