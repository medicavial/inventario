<?php

class UnidadesController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Unidad::all();
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
		$unidad = new Unidad;

		$unidad->UNI_nombre = Input::get('nombre');
		$unidad->UNI_nombrecorto = Input::get('nombrecorto');
		$unidad->UNI_correo = Input::get('correo');
		$unidad->UNI_activo = Input::get('activo');

		$unidad->save();

		return Response::json(array('respuesta' => 'Unidad Registrada Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		$unidad = Unidad::find($id);

		$unidad->UNI_nombre = Input::get('nombre');
		$unidad->UNI_nombrecorto = Input::get('nombrecorto');
		$unidad->UNI_correo = Input::get('correo');
		$unidad->UNI_activo = Input::get('activo');

		$unidad->save();

		return Response::json(array('respuesta' => 'Unidad Actualizada Correctamente'));
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
