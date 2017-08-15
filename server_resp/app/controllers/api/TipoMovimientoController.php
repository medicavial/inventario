<?php

class TipoMovimientoController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return TipoMovimiento::all();
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
		$TipoMovimiento = new TipoMovimiento;

		$TipoMovimiento->TIM_nombre = Input::get('nombre');
		$TipoMovimiento->save();

		return Response::json(array('respuesta' => 'Tipo Movimiento Guardado Correctamente'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return TipoMovimiento::find($id);
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
		$TipoMovimiento =  TipoMovimiento::find($id);

		$TipoMovimiento->TIM_nombre = Input::get('nombre');
		$TipoMovimiento->TIM_activo = Input::get('activo');
		$TipoMovimiento->save();

		return Response::json(array('respuesta' => 'Tipo Movimiento Actualizado Correctamente'));
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
