(function(){

	'use strict';
	
	angular
	.module('app')
	.factory('unidades',unidades);

	//servicio para permisos
	function unidades($resource,api){

	    var unidad = $resource(api + 'unidades/:unidad', {}, {
	                'get':    {method:'GET'},
	                'save':   {method:'POST'},
	                'query':  {method:'GET', isArray:true},
	                'update': { method:'PUT' }
	            });

	    return unidad;
	}

})();