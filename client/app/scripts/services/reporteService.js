//servicio que verifica sesiones de usuario
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

app.factory("reportes",reportes);