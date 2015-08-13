<?php

class AuthController extends BaseController {

	public function login()
	{
		$user = Input::get('usuario');
		$password = Input::get('psw');

		// return User::where(array('USU_login' => $user, 'USU_psw' => $password))->fisrt();


		if (Auth::attempt(array('USU_login' => $user, 'password' => $password, 'USU_activo' => 1))){
		    
		    return Auth::user();

		}else{

			return Response::json(array('flash' => 'Nombre de Usuario o contraseña Invalida'), 500); 
		
		}

		// return Input::all();
	}


	public function Logout(){

		Auth::logout();
		return Response::json(array('flash' => 'Sesion cerrada exitosamente'));
		
	}

}
