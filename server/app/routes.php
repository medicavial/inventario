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
		return View::make('hello');
	});

    Route::post('/upload', function(){
        
        $ruta = "resource/items/" . Input::get('clave');

        if(Input::hasFile('file')) {
            
            $file = Input::file('file');
            $file->move($ruta,$file->getClientOriginalName());

        }
         
        return Response::json(array('respuesta' => 'Imagenes subidas Correctamente','archivos' => $file));
            
    });

    Route::delete('delete',function(){

        $archivo = Input::get('imagen');
        // $item = Input::get('item');

        // $ruta = public_path() . "/resource/items/" . $item . '/' . $archivo;

        File::delete($archivo);

        return Response::json(array('respuesta' => 'Imagen eliminada Correctamente','archivo' => $archivo));

    });

    Route::post('login', array('uses' => 'AuthController@login'));
    Route::get('logout', array('uses' => 'AuthController@logout'));
    Route::get('inicio/{usuario}', array('uses' => 'AuthController@inicio'));

    //con esto tenemos listo todos las posibles combinaciones rest full asociados al controlador
    //relacionadas a las bajas */ altas y actualizaciones de los catalogos
    Route::resource('almacenes', 'AlmacenesController');
    Route::resource('items', 'ItemsController');
    Route::resource('tiposajuste', 'TipoAjusteController');
    Route::resource('tiposalmacen', 'TipoAlmacenController');
    Route::resource('tipositem', 'TipoItemController');
    Route::resource('tiposorden', 'TipoOrdenController');
    Route::resource('tiposmovimiento', 'TipoMovimientoController');
    Route::resource('proveedores', 'ProveedoresController');
    Route::resource('permisos', 'PermisosController');
    Route::resource('subtipositem', 'SubTipoItemController');
    Route::resource('unidades', 'UnidadesController');
    Route::resource('usuarios', 'UsuariosController');

    
    Route::group(array('prefix' => 'busquedas'), function()
    {
        Route::get('almacen/{usuario}', 'BusquedasController@almacenUsuario');
        Route::get('almacenes', 'BusquedasController@almacenes');
        Route::get('almacenes/{usuario}', 'BusquedasController@almacenesUsuario');
        Route::get('almacenes/unidad/{unidad}', 'BusquedasController@almacenesUnidad');
        Route::get('existencias/{usuario}', 'BusquedasController@existencias');
        Route::get('item/unidad/{item}/{unidad}', 'BusquedasController@itemUnidad');
        Route::get('items', 'BusquedasController@items');
        Route::get('items/existencias/{almacen}', 'BusquedasController@itemsAlmacen');
        Route::get('items/proveedor', 'BusquedasController@itemsProveedor');
        Route::get('movimientos', 'BusquedasController@movimientos');
        Route::get('ordenescompra', 'BusquedasController@ordenescompra');
        Route::get('ordencompra/{id}', 'BusquedasController@ordencompra');
        Route::get('tiposajuste', 'BusquedasController@tiposAjuste');
        Route::get('tiposalmacen', 'BusquedasController@tiposalmacen');
        Route::get('tipositem', 'BusquedasController@tipositem');
        Route::get('tiposmovimiento', 'BusquedasController@tiposMovimiento');
        Route::get('permisos', 'BusquedasController@permisos');
        Route::get('presentaciones', 'BusquedasController@presentaciones');
        Route::get('proveedores', 'BusquedasController@proveedores');
        Route::get('subtipositem', 'BusquedasController@subtipositem');
        Route::get('unidades', 'BusquedasController@unidades');
        Route::get('usuarios', 'BusquedasController@usuarios');
    });

    Route::group(array('prefix' => 'operacion'), function()
    {
        Route::get('configuracion/unidad/{unidad}', 'OperacionController@configuracionUnidad');
        Route::post('configuraciones', 'OperacionController@configuraciones');
        Route::put('configuraciones/{id}', 'OperacionController@actualizaConfiguracion');
        Route::get('elimina/almacen/{almacen}/{usuario}', 'OperacionController@eliminaUsuarioAlmacen');
        Route::post('item/proveedor', 'OperacionController@itemProveedor');
        Route::get('items/unidad/{unidad}', 'OperacionController@itemsUnidad');
        Route::post('items/almacenes/{unidad}', 'OperacionController@itemsAlmacenes');
        Route::post('ordencompra', 'OperacionController@ordencompra');
        Route::post('proveedores/items', 'OperacionController@proveedoresItems');
        Route::post('movimiento', 'OperacionController@movimiento');
        Route::post('traspaso', 'OperacionController@traspaso');
        Route::post('usuario/almacenes', 'OperacionController@usuarioAlmacen');
        Route::get('usuarios/almacen', 'OperacionController@usuariosAlm');

    });


    Route::group(array('prefix' => 'reportes'), function()
    {
        Route::post('existencias', 'ReportesController@existencias');

    });




});
