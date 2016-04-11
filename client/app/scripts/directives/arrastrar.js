//directiva que detecta cuando se deja de arrastrar un elemento

(function(){


    "use strict"

    angular
    .module('app')
    .directive('dragEnd', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

            	var functionToCall = scope.$eval(attrs.dragEnd);

                // element.on('$md.dragstart', function() {
                // })

                // element.on('$md.drag', function() {
                // })

                element.on('$md.dragend', function() {
                    functionToCall(modelCtrl.$viewValue);
                    // console.log(modelCtrl.$viewValue);
                })

                element.on('click', function() {
                    functionToCall(modelCtrl.$viewValue);
                    // console.log(modelCtrl.$viewValue);
                })
            }
        }
    })

})();