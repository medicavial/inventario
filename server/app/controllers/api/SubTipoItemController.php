<?php

class SubTipoItemController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return SubTipoItem::all();
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
		$subtipoitem = new SubTipoItem;

		$subtipoitem->STI_nombre = Input::get('nombre');
		$subtipoitem->save();

		return Response::json(array('respuesta' => 'SubTipo Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return SubTipoItem::find($id);
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
		$subtipoitem = SubTipoItem::find($id);

		$subtipoitem->STI_nombre = Input::get('nombre');
		$subtipoitem->STI_activo = Input::get('activo');
		$subtipoitem->save();

		return Response::json(array('respuesta' => 'SubTipo Actualizado Correctamente'));
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
