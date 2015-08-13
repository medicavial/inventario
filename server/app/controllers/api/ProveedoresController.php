<?php

class ProveedoresController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Proveedor::all();
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
		$proveedor = new Proveedor;

		$proveedor->PRO_nombre = Input::get('nombre');
		$proveedor->PRO_nombrecorto = Input::get('nombrecorto');
		$proveedor->PRO_rfc = Input::get('rfc');
		$proveedor->PRO_razonSocial = Input::get('razon');
		// $proveedor->PRO_activo = Input::get('algo')	;

		$proveedor->save();

		return Response::json(array('respuesta' => 'Proveedor Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return Proveedor::find($id);
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
		$proveedor = Proveedor::find($id);

		$proveedor->PRO_nombre = Input::get('nombre');
		$proveedor->PRO_nombrecorto = Input::get('nombrecorto');
		$proveedor->PRO_rfc = Input::get('rfc');
		$proveedor->PRO_razonSocial = Input::get('razon');
		$proveedor->PRO_activo = Input::get('activo');

		$proveedor->save();

		return Response::json(array('respuesta' => 'Proveedor Actualizado Correctamente'));
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
