<?php

class AlmacenesController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Almacen::todos();
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
		$almacen = new Almacen;

		$almacen->ALM_nombre = Input::get('nombre');
		$almacen->ALM_observaciones = Input::get('observaciones');
		$almacen->ALM_ubicacion = Input::get('ubicacion');
		$almacen->TAL_clave = Input::get('tipo');
		$almacen->UNI_clave = Input::get('unidad');
		// $almacen->ALM_activo = Input::get('activo');

		$almacen->save();

		return Response::json(array('respuesta' => 'Almacen Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return Almacen::find($id);
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
		$almacen = Almacen::find($id);

		$almacen->ALM_nombre = Input::get('nombre');
		$almacen->ALM_observaciones = Input::get('observaciones');
		$almacen->ALM_ubicacion = Input::get('ubicacion');
		$almacen->TAL_clave = Input::get('tipo');
		$almacen->UNI_clave = Input::get('unidad');
		$almacen->ALM_activo = Input::get('activo');

		$almacen->save();

		return Response::json(array('respuesta' => 'Almacen Actualizado Correctamente'));
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}
