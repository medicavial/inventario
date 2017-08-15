<?php

class TipoAlmacenController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return TipoAlmacen::all();
	}

	// muestra todos los usuarios activos
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function actives()
	{
		return TipoAlmacen::activos();
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
		$Tipoalmacen = new TipoAlmacen;

		$Tipoalmacen->TAL_nombre = Input::get('nombre');
		$Tipoalmacen->save();

		return Response::json(array('respuesta' => 'Tipo Almacen Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return TipoAlmacen::find($id);
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
		$Tipoalmacen =  TipoAlmacen::find($id);

		$Tipoalmacen->TAL_nombre = Input::get('nombre');
		$Tipoalmacen->TAL_activo = Input::get('activo');
		$Tipoalmacen->save();

		return Response::json(array('respuesta' => 'Tipo Almacen Actualizado Correctamente'));
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
