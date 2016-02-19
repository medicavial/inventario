app.directive('numero', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            element.on('keydown', function(e){

                if (e.keyCode >= 65 && e.keyCode <= 90) {
                    e.preventDefault();
                }    

            });

      }

    };
    
});