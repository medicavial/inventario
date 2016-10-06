//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('auth',auth);

    function auth($http, api, $state, webStorage,$rootScope,mensajes){
        return{
            login : function(credenciales)
            {   

                $http.post(api+'login',credenciales)
                .success(function (data){

                    $rootScope.cargando = false;

                    webStorage.session.add('username',data.USU_login);
                    webStorage.session.add('nombre',data.USU_nombrecompleto);
                    webStorage.session.add('id',data.USU_clave);

                    $rootScope.username = webStorage.session.get('username');
                    $rootScope.nombre = webStorage.session.get('nombre');
                    $rootScope.id = webStorage.session.get('id');

                    webStorage.session.add('permisos',JSON.stringify(data));
                    $rootScope.permisos = data;

                    if (credenciales.guardar) {
                        webStorage.local.add('usuario',JSON.stringify(data));
                    }

                    $state.go('index.home');

                }).error(function (data){

                    if (data) {
                        mensajes.alerta(data.flash,'error center-dialog','top','error');
                    }else{
                        mensajes.alerta('Error en conexión intentalo nuevamente','error center-dialog','top','error');
                    }
                    $rootScope.cargando = false;
                });

            },
            logout : function()
            {	
            	webStorage.session.clear();
                $http.get(api+'logout');
            	$state.go('login');
            },
            verify : function(url)
            {   //verificacion de permisos por ruta
                if (url == 'index.usuarios' && $rootScope.permisos.PER_usuarios == 0) {
                    return false;
                }else if (url == 'index.usuarios' && $rootScope.permisos.PER_usuarios == 0) {
                    
                }else{
                    return true;
                }
            }
        }
    }

})();