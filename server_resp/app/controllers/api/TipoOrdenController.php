<?php

class TipoOrdenController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return TipoOrden::all();
	}

	// muestra todos los usuarios activos
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function actives()
	{
		return TipoOrden::activos();
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
		$TipoOrden = new TipoOrden;

		$TipoOrden->TOR_nombre = Input::get('nombre');
		$TipoOrden->save();

		return Response::json(array('respuesta' => 'Tipo Orden Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return TipoOrden::find($id);
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
		$TipoOrden =  TipoOrden::find($id);

		$TipoOrden->TOR_nombre = Input::get('nombre');
		$TipoOrden->TOR_activo = Input::get('activo');
		$TipoOrden->save();

		return Response::json(array('respuesta' => 'Tipo Orden Actualizado Correctamente'));
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
