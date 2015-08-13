<?php

class UsuariosController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */

	//muestra todos los usuarios activos/inactivos
	public function index()
	{
		return User::all();
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */

	//crea un nuevo usuario

	//crea un nuevo usuario
	public function store()
	{
		$usuario = new User;

		$usuario->USU_nombrecompleto = Input::get('nombre');
		$usuario->USU_login = Input::get('usuario');
		$usuario->USU_psw = Hash::make(Input::get('psw'));
		$usuario->PER_clave = Input::get('perfil');
		$usuario->save();

		return Response::json(array('respuesta' => 'Usuario Guardado Correctamente'));

	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		return User::find($id);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		$usuario = User::find($id);

		$usuario->USU_nombrecompleto = Input::get('nombre');
		$usuario->USU_login = Input::get('usuario');
		$usuario->USU_activo = Input::get('activo');
		$usuario->PER_clave = Input::get('perfil');
		
		if ( Input::has('psw') || Input::get('psw') != '') {
			$usuario->USU_psw = Hash::make(Input::get('psw'));
		}

		$usuario->save();

		return Response::json(array('respuesta' => 'Usuario Actualizado Correctamente'));
	}



	public function create()
	{

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
