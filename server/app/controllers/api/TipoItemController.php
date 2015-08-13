<?php

class TipoItemController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return TipoItem::all();
	}

	// muestra todos los usuarios activos
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function actives()
	{
		return TipoItem::activos();
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
		$tipoitem = new TipoItem;

		$tipoitem->TIT_nombre = Input::get('nombre');
		$tipoitem->save();

		return Response::json(array('respuesta' => 'Tipo Item Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return TipoItem::find($id);
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
		$tipoitem =  TipoItem::find($id);

		$tipoitem->TIT_nombre = Input::get('nombre');
		$tipoitem->TIT_activo = Input::get('activo');
		$tipoitem->save();

		return Response::json(array('respuesta' => 'Tipo Item Actualizado Correctamente'));
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
