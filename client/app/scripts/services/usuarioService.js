(function(){

	"use strict"
	
	angular
	.module('app')
	.factory('usuarios',usuarios);

	//servicio para usuarios
	function usuarios($resource,api){

	    var User = $resource(api + 'usuarios/:usuario', {}, {
	                'get':    {method:'GET'},
	                'save':   {method:'POST'},
	                'query':  {method:'GET', isArray:true},
	                'update': { method:'PUT' }
	            });

	    return User;
	}

})();