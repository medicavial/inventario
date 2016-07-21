(function(){

    'use strict';
    
    angular
    .module('app')
    .factory('proveedores',proveedores);
    
	//servicio para permisos
	function proveedores($resource,api){

	    var Proveedor = $resource(api + 'proveedores/:proveedor', {}, {
	                'get':    {method:'GET'},
	                'save':   {method:'POST'},
	                'query':  {method:'GET', isArray:true},
	                'update': {method:'PUT'},
	                'remove': {method:'DELETE'}
	            });

	    return Proveedor;
	}

})();