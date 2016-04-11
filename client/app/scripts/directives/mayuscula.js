//funcion para convertir mayusculas
(function(){

    "use strict"
    
    angular
    .module('app')
    .directive('mayusculas', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

                element.bind('blur', function () {
                  var inputValue = modelCtrl.$modelValue;
                  if (inputValue) {
                    var capitalized = inputValue.toUpperCase();
                    if(capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                  }
                });

                element.css("text-transform","uppercase");

            }
       };
       
    });

})();