(function(){

    "use strict"
    
    angular
    .module('app')
    .factory("tiposajuste",tiposajuste);

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

})();