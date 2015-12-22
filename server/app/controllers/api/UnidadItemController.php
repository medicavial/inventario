<?php

class UnidadItemController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return UnidadItem::all();
	}


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$UnidadItem = new UnidadItem;

		$UnidadItem->UTI_nombre = Input::get('nombre');
		$UnidadItem->save();

		return Response::json(array('respuesta' => 'Unidad Item Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return UnidadItem::find($id);
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
		$UnidadItem =  UnidadItem::find($id);

		$UnidadItem->UTI_nombre = Input::get('nombre');
		$UnidadItem->UTI_activo = Input::get('activo');
		$UnidadItem->save();

		return Response::json(array('respuesta' => 'Unidad Item Actualizado Correctamente'));
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
