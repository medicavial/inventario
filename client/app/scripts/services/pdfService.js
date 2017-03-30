
(function(){

    'use strict';

    angular.module('app')
    .factory('pdf',pdf);

	//genera el pdf de la orden de compra
	function pdf($http,busqueda,$q,Upload,api){
	    return{

	    	enviaOrden:function(orden){

	    			 console.log(orden);
	                return $http.get(api+'operacion/envia/orden/'+orden);

	   		}

	    };
	}


})();
