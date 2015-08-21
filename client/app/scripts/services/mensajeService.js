function mensajes($mdToast,$mdDialog){
    return{
        confirmacion:function(titulo,mensaje){
         
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
              template: '<md-toast class="' + tipo + '"> <md-icon layout-padding><ng-md-icon icon="'+icono+'" style="fill:white"></ng-md-icon></md-icon> <span flex>' + mensaje + '</span></md-toast>',
              hideDelay: 4000,
              position: posicion
            });
        },
        popup:function(mensaje){
            
        }
    }
}

app.factory("mensajes",mensajes);
