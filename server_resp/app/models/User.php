<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class User extends Eloquent implements UserInterface, RemindableInterface {

	use UserTrait, RemindableTrait;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'usuarios';
	protected $primaryKey ='USU_clave';
	protected $guarded = []; 

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

	protected $hidden = array('USU_psw', 'remember_token');

	//cuando no es una columna llamada password se tiene que especificar cual es para el logueo
	public function getAuthPassword() {
	    return $this->USU_psw;
	}

	//acccion para que elija solo usuarios activos
	public function scopeActivos($query)
    {
        return $query->where('USU_activo',true)->get();
    }

    //acccion para que elija solo usuarios activos
	public function scopeAlmacen($query)
    {
        return $query->leftJoin('usuarioAlmacen', 'usuarioAlmacen.USU_clave', '=', 'usuarios.USU_clave')
        			 ->select('usuarios.USU_clave','USU_login','USU_nombrecompleto','ALM_clave')
        			 ->where('USU_activo',true)
        			 ->get();
    }

}
