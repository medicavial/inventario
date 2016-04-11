
(function(){

    "use strict"
    
    angular
    .module('app')
    .factory("mensajes",mensajes);

    function mensajes($mdToast,$mdDialog,$q){
        return{
            confirmacion:function(titulo,mensaje,ev){
                var confirm = $mdDialog.confirm()
                    .title(titulo)
                    .content(mensaje)
                    .ariaLabel('Confirmación')
                    .targetEvent(ev)
                    .ok('SI')
                    .cancel('NO');
                $mdDialog.show(confirm).then(function() {
                    return true;
                }, function() {
                    return false;
                });
            },
            notifica:function(mensaje,descripcion,ev){

                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title(mensaje)
                    .content(descripcion)
                    .ariaLabel(mensaje)
                    .ok('OK')
                    .targetEvent(ev)
                );
            },
            alerta:function(mensaje,tipo,posicion,icono){
                $mdToast.show({
                  template: '<md-toast class="' + tipo + '"> <md-icon class="padding-right"> <ng-md-icon icon="'+icono+'" style="fill:white"></ng-md-icon></md-icon> <span flex>' + mensaje + '</span></md-toast>',
                  hideDelay: 4000,
                  position: posicion
                });
            },
            popup:function(mensaje){
                
            }
        }
    }

})();
