
(function(){

    "use strict"
    
    angular
    .module('app')
    .factory("reportes",reportes);
    
    function reportes($http, api){
        return{
            existencias : function(datos)
            {
                return $http.post(api + 'reportes/existencias',datos);
            },
            ordenes : function(datos)
            {
                return $http.post(api + 'reportes/ordenes',datos);
            }
        }
    }

})();