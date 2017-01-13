(function(){

    'use strict';
    
    angular
    .module('app')
    .factory('segundaprueba',segundaprueba);
    
	//servicio para permisos
	function segundaprueba($resource,api){

	    var SegundaPrueba = $resource(api + 'samus/:SegundaPrueba', {}, {
	                'get':    {method:'GET'},
	                'save':   {method:'POST'},
	                'query':  {method:'GET', isArray:true},
	                'update': {method:'PUT'},
	                'remove': {method:'DELETE'}
	            });

	    return SegundaPrueba;
	}

})();