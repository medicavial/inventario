(function(){

    'use strict';
    
    angular
    .module('app')
    .factory('permisos',permisos);
    
	//servicio para permisos
	function permisos($resource,api){

	    var Permiso = $resource(api + 'permisos/:permiso', {}, {
	                'get':    {method:'GET'},
	                'save':   {method:'POST'},
	                'query':  {method:'GET', isArray:true},
	                'update': { method:'PUT' }
	            });

	    return Permiso;
	}

})();