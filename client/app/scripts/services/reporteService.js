
(function(){

    'use strict';
    
    angular
    .module('app')
    .factory('reportes',reportes);
    
    function reportes($http, api,mensajes,publicfiles){

        //funcion que convierte json en parametros get
        function serializeObj(obj) {
            var result = [];

            for (var property in obj)
                result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

            return result.join("&");
        }

        return{
            existencias : function(datos)
            {
                console.log(datos);
                var parametros = serializeObj(datos);
                return $http.get(api + 'reportes/existencias?' + parametros);
            },
            items : function(datos)
            {
                return $http.get(api + 'reportes/items');
            },
            lotes : function(datos)
            {
                var parametros = serializeObj(datos);
                return $http.get(api + 'reportes/lotes?' + parametros);
            },
            movimientos : function(datos)
            {
                var parametros = serializeObj(datos);
                return $http.get(api + 'reportes/movimientos?' + parametros);
            },
            traspasos : function(datos)
            {
                var parametros = serializeObj(datos);
                return $http.get(api + 'reportes/traspasos?' + parametros);
            },
            ordenes : function(datos)
            {
                return $http.post(api + 'reportes/ordenes',datos);
            },
            exportar : function(tipo,datos)
            {
                $http.post(api + 'reportes/exportar/'+ tipo,datos).success(function (archivo){
                     //console.log(archivo);
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
            },
            ordenesAbiertas : function(unidades)
            {
                return $http.get(api + 'reportes/expOrdenes/'+unidades).success(function (archivo){
                     //console.log(archivo);
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
            traspasoPdf : function(cveTraspaso)
            {
                window.open(api + 'reportes/pdfTraspaso/'+cveTraspaso);
                return $http.get(api + 'reportes/pdfTraspaso/'+cveTraspaso).success(function (archivo){
                    // var link = document.createElement("a");    
                    // link.href = publicfiles + archivo.file;
                    
                    // //set the visibility hidden so it will not effect on your web-layout
                    // link.style = "visibility:hidden";
                    // link.download = publicfiles + archivo.file;
                    
                    // //this part will append the anchor tag and remove it after automatic click
                    // document.body.appendChild(link);
                    // link.click();
                    // document.body.removeChild(link);
                }).error(function (data){
                    mensajes.alerta('Error al generar el reporte intentalo nuevamente','error','top right','alert');
                });
            }
        }
    }

})();