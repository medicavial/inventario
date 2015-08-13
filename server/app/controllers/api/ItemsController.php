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
		$item->ITE_precioventa = Input::get('precio');
		$item->ITE_cantidadtotal = Input::get('cantidad');
		$item->TIT_clave = Input::get('tipo');
		$item->STI_clave = Input::get('subtipo');
		// $item->ITE_activo = Input::get('activo')	;

		$item->save();

		return Response::json(array('respuesta' => 'Item Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return Item::find($id);
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
		$item->ITE_precioventa = Input::get('precio');
		$item->ITE_cantidadtotal = Input::get('cantidad');
		$item->TIT_clave = Input::get('tipo');
		$item->STI_clave = Input::get('subtipo');
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
		//
	}


}
