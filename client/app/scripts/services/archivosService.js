//servicio que verifica sesiones de usuario
(function(){

    'use strict';
    
    angular.module('app')
    .factory('archivos',archivos);
    
    function archivos($http, api,Upload,$q,$rootScope){
        return{
            items: function(archivos,clave)
            {
                var promesa = $q.defer(),
                    imagenes = [];

                for (var i = 0; i < archivos.length; i++) {

                    Upload.upload({
                        url: api + 'upload/items',
                        fields: {'clave': clave},
                        file: archivos[i]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        promesa.notify(progressPercentage);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        imagenes.push(data);
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    }).error(function (data, status, headers, config) {
                        promesa.reject(data);
                        console.log('error status: ' + status);
                    })

                }

                $q.when(imagenes).then(function(data){
                    promesa.resolve('Imagenes subidas correctamente');
                })

                return promesa.promise;
            },
            eliminaItem:function(imagen,clave,tipo){

                return $http.post(api+'delete',{imagen:imagen,item:clave});
            },
            proveedores: function(archivos,clave)
            {
                var promesa = $q.defer(),
                    imagenes = [];
                for (var i = 0; i < archivos.length; i++) {

                    Upload.upload({
                        url: api + 'upload/proveedores',
                        fields: {'clave': clave},
                        file: archivos[i]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        promesa.notify(progressPercentage);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        imagenes.push(data);
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    }).error(function (data, status, headers, config) {
                        promesa.reject(data);
                        console.log('error status: ' + status);
                    })

                }

                $q.when(imagenes).then(function(data){
                    promesa.resolve('Imagenes subidas correctamente');
                })

                return promesa.promise;
            },
            subeArchivo:function(archivo){

                var promesa = $q.defer();


                Upload.upload({
                    url: api + 'operacion/importacion',
                    fields: {'usuario': $rootScope.id},
                    file: archivo
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    promesa.notify(progressPercentage);
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    promesa.resolve(data);
                    // console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                }).error(function (data, status, headers, config) {
                    promesa.reject(data);
                    // console.log('error status: ' + status);
                })


                return promesa.promise;

            }
        }
    }

})();