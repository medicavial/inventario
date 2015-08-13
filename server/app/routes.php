<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/
Route::get('/', function()
{
	return View::make('hello');
});


Route::group(array('prefix' => 'api'), function()
{

	Route::get('/', function()
	{
		// return View::make('hello');
        return Unidad::activos();
	});

    Route::post('login', array('uses' => 'AuthController@login'));
    Route::get('logout', array('uses' => 'AuthController@logout'));

    //con esto tenemos listo todos las posibles combinaciones rest full asociados al controlador
    //relacionadas a las bajas */ altas y actualizaciones de los catalogos
    Route::resource('almacenes', 'AlmacenesController');
    Route::resource('items', 'ItemsController');
    Route::resource('tiposalmacen', 'TipoAlmacenController');
    Route::resource('tipositem', 'TipoItemController');
    Route::resource('proveedores', 'ProveedoresController');
    Route::resource('permisos', 'PermisosController');
    Route::resource('subtipositem', 'SubTipoItemController');
    Route::resource('usuarios', 'UsuariosController');
    
    Route::group(array('prefix' => 'busquedas'), function()
    {
        Route::get('almacenes', 'BusquedasController@almacenes');
        Route::get('almacen/{usuario}', 'BusquedasController@almacenUsuario');
        Route::get('items', 'BusquedasController@items');
        Route::get('items/proveedor', 'BusquedasController@itemsProveedor');
        Route::get('tiposalmacen', 'BusquedasController@tiposalmacen');
        Route::get('tipositem', 'BusquedasController@tipositem');
        Route::get('permisos', 'BusquedasController@permisos');
        Route::get('proveedores', 'BusquedasController@proveedores');
        Route::get('subtipositem', 'BusquedasController@subtipositem');
        Route::get('unidades', 'BusquedasController@unidades');
        Route::get('usuarios', 'BusquedasController@usuarios');
    });

    Route::group(array('prefix' => 'operacion'), function()
    {
        Route::post('usuario/almacenes', 'OperacionController@usuarioAlmacen');
        Route::get('elimina/almacen/{almacen}/{usuario}', 'OperacionController@eliminaUsuarioAlmacen');
        Route::get('usuarios/almacen', 'OperacionController@usuariosAlm');
    });




});
