(function(){

    'use strict';
    
    angular
    .module('app')
    .directive('folio', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

                //funcion que rellena folios 
                var rellenaFolio = function(folio){

                    if (folio !== '') {

                        var totalletras = folio.length;

                        var letras = folio.substr(0,4);
                        var numeros = folio.substr(4,totalletras);

                        if(letras.length < 4 ){

                            var faltantes = 4 - letras.length;

                            for (var i = 0; i < faltantes; i++) {

                              var letra = letras.charAt(i);
                              letras = letras + '0';
                            }
                        }

                        if(numeros.length < 6 ){

                            var faltantes = 6 - numeros.length;

                            for (var i = 0; i < faltantes; i++) {
                              
                              numeros = '0' + numeros;
                            }
                        }

                        folio = letras + numeros;

                        return folio;

                    }else{

                        return folio;

                    }
                };

                element.on('blur',function(){

                    if (modelCtrl.$modelValue.length > 3) {
                        var nuevo = rellenaFolio(modelCtrl.$modelValue);
                        modelCtrl.$setViewValue(nuevo.toUpperCase());
                        modelCtrl.$render();
                        scope.$apply();
                    };

                });

                element.on('keydown', function(e){

                    if (modelCtrl.$modelValue) {

                        var cantidad = modelCtrl.$modelValue.length;

                        //los primero cuatro caracteres NO deben ser numeros
                        if(cantidad < 4){

                            if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105) {
                                e.preventDefault();
                            }else{

                                element.css('text-transform','uppercase');

                            }
                        //los ultimos 6 NO deben ser letras

                        }else if(cantidad > 3 && cantidad < 10){

                            if (e.keyCode >= 65 && e.keyCode <= 90) {
                                e.preventDefault();
                            }else if (e.keyCode == 13) {
                                // var nextinput = element.next('input');
                                // nextinput.focus();
                                var nuevo = rellenaFolio(modelCtrl.$modelValue);
                                modelCtrl.$setViewValue(nuevo.toUpperCase());
                                modelCtrl.$render();
                                scope.$apply();

                            }    
                                  
                        }else{

                            if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 ) {
                                e.preventDefault();
                            }

                        }
                        
                    };
                    
                });

            }

        };
        
    });

})();