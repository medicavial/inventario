<?php

class AuthController extends BaseController {

	public function login()
	{
		$user = Input::get('usuario');
		$password = Input::get('psw');


		if (Auth::attempt(array('USU_login' => $user, 'password' => $password, 'USU_activo' => 1))){
		    
		    return User::where('USU_login',$user)->join('permisos','permisos.PER_clave','=','usuarios.PER_clave')->first();

		}else{

			return Response::json(array('flash' => 'Nombre de Usuario o contraseña Invalida'), 500); 
		
		}

		// return Input::all();
	}


	public function Logout(){

		Auth::logout();
		return Response::json(array('flash' => 'Sesion cerrada exitosamente'));
		
	}

	public function inicio($usuario){
		
	}

}
