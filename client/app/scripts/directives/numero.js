(function(){

    'use strict';
    
    angular
    .module('app')
    .directive('numero', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {


                element.on('keydown', function(e){

                    // console.log(e.keyCode);

                    if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode == 110 || e.keyCode == 190 || e.keyCode == 189 ) {
                        e.preventDefault();
                    }    

                });

          }

        };
        
    });

})();