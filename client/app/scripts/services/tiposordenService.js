(function(){

	'use strict';
	
	angular
	.module('app')
	.factory('tiposorden',tiposorden);

	//servicio para permisos
	function tiposorden($resource,api){

	    var TipoOrden = $resource(api + 'tiposorden/:tipoorden', {}, {
	                'get':    {method:'GET'},
	                'save':   {method:'POST'},
	                'query':  {method:'GET', isArray:true},
	                'update': { method:'PUT' }
	            });

	    return TipoOrden;
	}

})();