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

include(app_path() . '/classes/helpers.php');
include(app_path() . '/classes/Operacion.php');

use SoapBox\Formatter\Formatter;


Route::get('/', function()
{

    // require '../vendor/autoload.php';

    // // dump the database to backup/test.sql
    // $shellProcessor = new McCool\DatabaseBackup\Processors\ShellProcessor(new Symfony\Component\Process\Process(''));
    // $dumper = new McCool\DatabaseBackup\Dumpers\MysqlDumper($shellProcessor, 'www.medicavial.mx', 3306, 'medica2_webusr', 'tosnav50', 'medica2_inventario', 'medicavialmx.sql');

    // $backup = new McCool\DatabaseBackup\BackupProcedure($dumper);
    // $backup->backup();

    // return ordenItem::find(20);


});


Route::group(array('prefix' => 'api'), function()
{

	Route::get('/', function(){

		return View::make('hello');

	});

    Route::post('/upload/{tipo}', function($tipo){

        $ruta = "resource/".$tipo."/" . Input::get('clave');

        if(Input::hasFile('file')) {

            $file = Input::file('file');
            $file->move($ruta,$file->getClientOriginalName());

        }

        return Response::json(array('respuesta' => 'Imagenes subidas Correctamente','archivos' => $file));

    });

    Route::get('/xml', function(){

        $app = new Illuminate\Container\Container;
        $document = new Orchestra\Parser\Xml\Document($app);
        $reader = new Orchestra\Parser\Xml\Reader($document);

        $xml = $reader->load(public_path() . '/archivo.xml');
        $nodos = $xml->getContent();
        foreach($nodos as $nodo) {
            echo $nodo['version'];

        }

        print_r($nodos);

    });

    Route::post('/subePDF/{orden}', function($orden){

        if(Input::has('data')) {

            $data =  base64_decode(Input::get('data'));
            $ruta =  public_path().'/ordenesCompra/'.$orden.'.pdf';

            $datos = OrdenCompra::find($orden);

            file_put_contents($ruta, $datos);

            Mail::send('emails.orden', array('key' => 'value'), function($message) use ($orden)
            {

                $ruta2 =  public_path().'/ordenesCompra/'.$orden.'.pdf';

                $message->from('sramirez@medicavial.com.mx', 'Sistema de Inventario MV');
                $message->subject('Welcome!');
                $message->to('sramirez@medicavial.com.mx');
                // ->cc('bar@example.com');
                $message->attach($ruta2);
            });

            return Response::json(array('respuesta' => 'Correo enviado Correctamente'));

        }

    });

    Route::post('delete',function(){

        $archivo = Input::get('imagen');
        $archivo = str_replace(url('/'), public_path(), $archivo);
        File::delete($archivo);

        return Response::json(array('respuesta' => 'Imagen eliminada Correctamente','archivo' => $archivo));

    });

    Route::post('login', array('uses' => 'AuthController@login'));
    Route::get('logout', array('uses' => 'AuthController@logout'));
    Route::get('inicio/{usuario}', array('uses' => 'AuthController@inicio'));


    Route::get('segundaprueba',function(){
/*        $segundaprueba= new Segundaprueba;

        //$segundaprueba = Segundaprueba::find(1);
        $segundaprueba->cliente = Input::get('nombreCompleto');
        $segundaprueba->domicilio = Input::get('domicilio');
        $segundaprueba->telefono = Input::get('telefono');
        $segundaprueba->email = Input::get('email');
        $segundaprueba->save();*/

        return Segundaprueba::all();
    });

    Route::get('pruebas',function(){
        $prueba=new Prueba;

        //$prueba = Prueba::find(1);
/*        $prueba->nombre = "Samuel";
        $prueba->edad = 25;
        $prueba->estatura = 1.70;
        $prueba->save();*/

        return Prueba::all();
    });

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
    Route::resource('unidadesitem', 'UnidadItemController');
    Route::resource('usuarios', 'UsuariosController');
    //Route::resource('samus/{fun}', 'SamusController@pruebaSamus');


    Route::group(array('prefix' => 'busquedas'), function()
    {
        Route::get('almacen/{usuario}', 'BusquedasController@almacenUsuario');
        Route::get('almacenes', 'BusquedasController@almacenes');
        Route::get('almacenes/{usuario}', 'BusquedasController@almacenesUsuario');
        Route::get('almacenes/unidad/{unidad}', 'BusquedasController@almacenesUnidad');
        //ruta que manda la orden al sistema MV
        Route::get('existencias/unidad/{unidad}/{tipo}', 'BusquedasController@existenciasUnidad');
        Route::get('existencias/{usuario}', 'BusquedasController@existencias');
        Route::get('inicial/{unidades}', 'DatosIniciales@index');
        Route::get('inicial/porCaducar/{unidades}', 'DatosIniciales@porCaducar');
        Route::get('inicial/porSurtir/{unidades}', 'DatosIniciales@porSurtir');
        Route::get('item/existencia/{almacen}/{item}', 'BusquedasController@itemAlmacen');
        Route::get('item/unidad/{item}/{unidad}', 'BusquedasController@itemUnidad');
        Route::get('items', 'BusquedasController@items');
        Route::get('items/agranel', 'BusquedasController@itemsAgranel');
        Route::get('items/existencias/{almacen}', 'BusquedasController@itemsAlmacen');
        Route::get('items/proveedor', 'BusquedasController@itemsProveedor');
        Route::get('items/receta', 'BusquedasController@itemsReceta');
        Route::get('items/receta/{id}', 'BusquedasController@itemsRecetaExistentes');
        Route::get('lote/{lote}', 'BusquedasController@lote');
        Route::get('lotes/almacen/{almacen}/item/{item}', 'BusquedasController@lotesAlmacenXitem');
        Route::get('lotes/unidad/{unidad}/item/{item}', 'BusquedasController@lotesUnidadXitem');
        Route::get('movimientos', 'BusquedasController@movimientos');
        Route::get('movimientos/agranel', 'BusquedasController@movimientosAgranel');
        // Route::get('ordenescompra', 'BusquedasController@ordenescompra');
        Route::get('ordenescompra/{unidades}', 'BusquedasController@ordenescompra');
        Route::get('ordencompra/{id}', 'BusquedasController@ordencompra');
        Route::get('tiposajuste', 'BusquedasController@tiposAjuste');
        Route::get('tiposalmacen', 'BusquedasController@tiposalmacen');
        Route::get('tipositem', 'BusquedasController@tipositem');
        Route::get('tiposmovimiento', 'BusquedasController@tiposMovimiento');
        Route::get('permisos', 'BusquedasController@permisos');
        Route::get('presentaciones', 'BusquedasController@presentaciones');
        Route::get('proveedores', 'BusquedasController@proveedores');
        Route::get('receta/{id}', 'BusquedasController@receta');
        Route::get('subtipositem', 'BusquedasController@subtipositem');
        Route::get('unidades', 'BusquedasController@unidades');
        Route::get('unidades/usuario/{id}', 'BusquedasController@unidadesUsuario');
        Route::get('unidadesItem', 'BusquedasController@unidadesItem');
        Route::get('usuarios', 'BusquedasController@usuarios');
    });

    Route::group(array('prefix' => 'operacion'), function()
    {
        Route::post('cancelarorden', 'OperacionController@cancelarOrden');
        Route::post('cancelar/item/{usuario}', 'OperacionController@cancelarItem');
        Route::post('cerrarorden', 'OperacionController@cerrarOrden');
        Route::get('completa/orden/{orden}', 'OperacionController@verificaOrden');
        Route::post('completa/orden', 'OperacionController@completaOrden');
        Route::get('configuracion/unidad/{unidad}', 'OperacionController@configuracionUnidad');
        Route::post('configuraciones', 'OperacionController@configuraciones');
        Route::put('configuraciones/{id}', 'OperacionController@actualizaConfiguracion');
        Route::post('correo', 'OperacionController@enviaCorreo');
        Route::get('elimina/almacen/{almacen}/{usuario}', 'OperacionController@eliminaUsuarioAlmacen');
        Route::get('envia/orden/{orden}', 'OperacionController@enviaCorreoOrden');
        Route::post('importacion', 'OperacionController@importacion');
        Route::post('item/proveedor', 'OperacionController@itemProveedor');
        Route::put('item/proveedor', 'OperacionController@actualizaItemProveedor');
        Route::delete('item/proveedor', 'OperacionController@eliminaItemProveedor');
        Route::get('items/unidad/{unidad}', 'OperacionController@itemsUnidad');
        Route::post('items/almacenes/{unidad}', 'OperacionController@itemsAlmacenes');
        Route::post('movimiento', 'OperacionController@movimiento');
        Route::post('movimientos', 'OperacionController@movimientos');
        Route::post('ordencompra', 'OperacionController@ordencompra');
        Route::post('proveedores/items', 'OperacionController@proveedoresItems');
        Route::post('reserva/item', 'OperacionController@reservaItem');
        Route::delete('reserva/{id}', 'OperacionController@eliminaReserva');
        Route::post('surtir/orden', 'OperacionController@surtirOrden');
        Route::post('surtir/item/{usuario}', 'OperacionController@surtirItem');
        Route::post('traspaso', 'OperacionController@traspaso');
        Route::post('usuario/almacenes', 'OperacionController@usuarioAlmacen');
        Route::get('usuarios/almacen', 'OperacionController@usuariosAlm');
    });


    Route::group(array('prefix' => 'reportes'), function()
    {
        Route::get('existencias', 'ReportesController@existencias');
        Route::get('items', 'ReportesController@items');
        Route::get('lotes', 'ReportesController@lotes');
        Route::get('movimientos', 'ReportesController@movimientos');
        Route::get('traspasos', 'ReportesController@traspasos');
        Route::post('ordenes', 'ReportesController@ordenes');
        Route::post('exportar/{tipo}', 'ReportesController@exportar');
        Route::post('exportarPDF/{tipo}', 'ReportesController@exportarPDF');
        Route::get('pdf/ordencompra/{id}','ReportesController@ordenCompraPDF');

    });

    Route::group(array('prefix' => 'mv'), function()
    {
        Route::get('tabulador/{claveLesion}/{folio}', 'MedicaController@tabulador');

    });

});
