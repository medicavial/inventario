function mensajes($mdToast){
    return{
        confirmacion:function(titulo,mensaje){
         
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
