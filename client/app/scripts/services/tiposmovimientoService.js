(function(){

	"use strict"
	
	angular
	.module('app')
	.factory("tiposmovimiento",tiposmovimiento);

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

})();