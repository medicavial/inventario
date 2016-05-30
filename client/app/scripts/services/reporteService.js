
(function(){

    'use strict';
    
    angular
    .module('app')
    .factory('reportes',reportes);
    
    function reportes($http, api,mensajes,publicfiles){
        return{
            existencias : function(datos)
            {
                return $http.post(api + 'reportes/existencias',datos);
            },
            ordenes : function(datos)
            {
                return $http.post(api + 'reportes/ordenes',datos);
            },
            exportar : function(tipo,datos)
            {
                $http.post(api + 'reportes/exportar/'+ tipo,datos).success(function (archivo){
                    // console.log(archivo);
                    var link = document.createElement("a");    
                    link.href = publicfiles + archivo.file;
                    
                    //set the visibility hidden so it will not effect on your web-layout
                    link.style = "visibility:hidden";
                    link.download = publicfiles + archivo.file;
                    
                    //this part will append the anchor tag and remove it after automatic click
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).error(function (data){
                    mensajes.alerta('Error al generar el reporte intentalo nuevamente','error','top right','alert');
                });
            },
            exportarPDF : function(tipo,datos)
            {
                $http.post(api + 'reportes/exportarPDF/'+ tipo,datos).success(function (archivo){
                    // console.log(archivo);
                    var link = document.createElement("a");    
                    link.href = publicfiles + archivo.file;
                    
                    //set the visibility hidden so it will not effect on your web-layout
                    link.style = "visibility:hidden";
                    link.download = publicfiles + archivo.file;
                    
                    //this part will append the anchor tag and remove it after automatic click
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).error(function (data){
                    mensajes.alerta('Error al generar el reporte intentalo nuevamente','error','top right','alert');
                });
            }
        }
    }

})();