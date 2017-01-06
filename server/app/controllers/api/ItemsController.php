<?php

class ItemsController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Item::todos();
	}


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$item = new Item;

		$item->ITE_nombre = Input::get('nombre');
		$item->ITE_codigo = Input::get('codigo');
		$item->ITE_precioventa = Input::get('precio');
		$item->ITE_cantidadtotal = Input::get('cantidad');
		$item->TIT_clave = Input::get('tipo');
		$item->STI_clave = Input::get('subtipo');
		
		if (Input::has('sustancia')) {
			$item->ITE_sustancia = implode("," , Input::get('sustancia'));			
		}

		$item->ITE_presentacion = Input::get('presentacionDesc');
		$item->ITE_posologia = Input::get('posologia');
		$item->PRE_clave = Input::get('presentacion');
		$item->ITE_clasificacion = Input::get('clasificacion');
		$item->ITE_codigoean = Input::get('codigoean');
		$item->ITE_agranel = Input::get('agranel');
		$item->ITE_segmentable = Input::get('segmentado');
		$item->ITE_noSegmentableReceta = Input::get('segmentadoReceta');
		$item->ITE_receta = Input::get('receta');
		$item->ITE_talla = Input::get('talla');
		$item->ITE_cantidadCaja = Input::get('cantidadCaja');
		$item->UTI_clave = Input::get('unidad');
		$item->ITE_agranel = Input::get('agranel');
		$item->ITE_activo = Input::get('activo');

		$item->save();

		$registro = $item->ITE_clave;

		return Response::json(array('respuesta' => 'Item Guardado Correctamente','clave' => $registro));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{	
		$respuesta = array();
		$ruta = public_path() . "/resource/items/" . $id;
		$datos = (File::exists($ruta) ? File::files($ruta) : array());
		$archivos = array();

		foreach ($datos as $archivo) {
			//remplazamos la el texto con la ruta fisica por la ruta de directorio
			$texto = str_replace(public_path(), url('/'), $archivo);
			array_push($archivos, $texto);
		}
		$datos = Item::find($id);

		return Response::json(array('archivos' => $archivos,'datos' => $datos));
		
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		
	}

	


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		$item = Item::find($id);

		$item->ITE_nombre = Input::get('nombre');
		$item->ITE_codigo = Input::get('codigo');
		$item->ITE_precioventa = Input::get('precio');
		$item->ITE_cantidadtotal = Input::get('cantidad');
		$item->TIT_clave = Input::get('tipo');
		$item->STI_clave = Input::get('subtipo');
		if (Input::has('sustancia')) {
			$item->ITE_sustancia = implode("," , Input::get('sustancia'));			
		}
		$item->ITE_posologia = Input::get('posologia');
		$item->ITE_presentacion = Input::get('presentacionDesc');
		$item->PRE_clave = Input::get('presentacion');
		$item->ITE_clasificacion = Input::get('clasificacion');
		$item->ITE_codigoean = Input::get('codigoean');
		$item->ITE_segmentable = Input::get('segmentado');
		$item->ITE_noSegmentableReceta = Input::get('segmentadoReceta');
		$item->ITE_receta = Input::get('receta');
		$item->ITE_talla = Input::get('talla');
		$item->ITE_cantidadCaja = Input::get('cantidadCaja');
		$item->UTI_clave = Input::get('unidad');
		$item->ITE_agranel = Input::get('agranel');
		$item->ITE_activo = Input::get('activo');
		
		$item->save();

		return Response::json(array('respuesta' => 'Item Actualizado Correctamente'));
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$item = Item::find($id);
		$item->ITE_activo = Input::get('activo');
		$item->save();
		
		return Response::json(array('respuesta' => 'Item Modificado Correctamente'));
	}

}
