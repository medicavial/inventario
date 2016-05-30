(function(){

	'use strict';
	
	angular
	.module('app')
	.controller('opcionesCtrl',opcionesCtrl)


	opcionesCtrl.$inject = ['$scope','$mdBottomSheet'];

	function opcionesCtrl($scope , $mdBottomSheet){
	 	$scope.items = [
			{ name: 'Exp. Excel', icon: 'file_download' },
			{ name: 'Exp. PDF', icon: 'picture_as_pdf' },
			{ name: 'Editar', icon: 'mode_edit' },
			{ name: 'Nuevo', icon: 'insert_drive_file' }
		];
		$scope.listItemClick = function($index) {
			var clickedItem = $scope.items[$index];
			$mdBottomSheet.hide(clickedItem);
		};
	}

})();