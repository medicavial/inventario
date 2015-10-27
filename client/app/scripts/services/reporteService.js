//servicio que verifica sesiones de usuario
function reportes($http, api){
    return{
        existencias : function(datos)
        {
            return $http.post(api + 'reportes/existencias',datos);
        }
    }
}

app.factory("reportes",reportes);