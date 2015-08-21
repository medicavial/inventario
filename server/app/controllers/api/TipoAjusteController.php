<?php

class TipoAjusteController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return TipoAjuste::all();
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
		$TipoAjuste = new TipoAjuste;

		$TipoAjuste->TIA_nombre = Input::get('nombre');
		$TipoAjuste->save();

		return Response::json(array('respuesta' => 'Tipo de Ajuste Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return TipoAjuste::find($id);
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
		$TipoAjuste = TipoAjuste::find($id);

		$TipoAjuste->TIA_nombre = Input::get('nombre');
		$TipoAjuste->TIA_activo = Input::get('activo');

		$TipoAjuste->save();

		return Response::json(array('respuesta' => 'Tipo de Ajuste Actualizado Correctamente'));
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
