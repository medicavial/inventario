//servicio que verifica sesiones de usuario

(function(){

    "use strict"
    
    angular.module('app')
    .factory("testInterceptor",testInterceptor);

	function testInterceptor($q,$rootScope){
	    return{
	        request: function(config) {
		     	return config;
		    },

		    requestError: function(config) {
		    	// alert('hubo un error de conexión intentalo nuevamente');
		    	return config;
		    },

		    response: function(res) {
				return res;
		    },

		    responseError: function(res) {
		    	// alert('hubo un error de conexión intentalo nuevamente');
		    	return res;
		    }
	    }
	}

})();