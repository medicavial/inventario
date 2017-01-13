<?php

class SamusController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		//return 'ENTRA AL CONTROLADOR SAMUS';
		$segundaprueba = DB::table('segundaprueba')->orderBy('id_cliente', 'desc')->skip(0)->take(10)->get();
		return $segundaprueba;
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
		// return 'ENTRA AL CONTROLADOR SAMUS';
        $segundaprueba=new Segundaprueba;
        //$segundaprueba = Segundaprueba::find(1); //esto es para cuando se hace update
        $segundaprueba->cliente = Input::get('nombreCompleto');
        $segundaprueba->domicilio = Input::get('domicilio');
        $segundaprueba->telefono = Input::get('telefono');
        $segundaprueba->email = Input::get('email');
        $segundaprueba->save();

        //return Segundaprueba::all();

        $id = $segundaprueba->id_cliente;

		return Response::json(array('respuesta' => 'Cliente Guardado Correctamente','ID' => $id));
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
		//
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
