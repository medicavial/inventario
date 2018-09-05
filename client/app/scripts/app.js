(function(){

	/** Sergio Alcala (2016), Samuel Ramirez (2017-2018)
    *Inicio de proyecto Inventarios
    *
    */

	'use strict';

	var hoy = new Date();
	var dd = hoy.getDate();
	var mm = hoy.getMonth()+1;//enero es 0!
	if (mm < 10) { mm = '0' + mm; }
	if (dd < 10) { dd = '0' + dd; }

	var yyyy = hoy.getFullYear();

	//armamos fecha para los datepicker
	var FechaAct = dd + '/' + mm + '/' + yyyy;


	angular.module('app', [
		'ui.router',
		'ngMaterial',
		'ngMdIcons',
		'webStorageModule',
		'ngMessages',
		'ngResource',
		'ngAnimate',
		'md.data.table',
		'ngFileUpload',
		'angular.filter'
	])

	// /* EN LOCAL */
	// .constant('api', 'http://localhost/inventario/server/public/api/')
	// .constant('publicfiles','http://localhost/inventario/server/public/exports/');

	// // /* PARA PRODUCCIÓN */
	// .constant('api', 'http://api.medicavial.mx/api/')
	// .constant('publicfiles','http://api.medicavial.mx/exports/');

	// /* PARA PRODUCCIÓN */
	.constant('api', 'http://inventarioapi.medicavial.net/api/')
	.constant('publicfiles','http://inventarioapi.medicavial.net/exports/');

})();
